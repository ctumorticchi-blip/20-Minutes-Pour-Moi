import { describe, expect, it } from "vitest";
import { makeCompletion, testExercisesById } from "../../test/fixtures";
import { analyzeTrainingHistory } from "./analyzeTrainingHistory";

const today = "2026-01-10";

describe("analyzeTrainingHistory", () => {
  it("counts only completions within the last 7 days", () => {
    const completions = [
      makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z" }), // 1 day ago
      makeCompletion({ completedAt: "2026-01-04T10:00:00.000Z" }), // 6 days ago
      makeCompletion({ completedAt: "2025-12-20T10:00:00.000Z" }), // way older
    ];
    const summary = analyzeTrainingHistory(completions, [], testExercisesById, today);
    expect(summary.completedWorkoutsLast7Days).toBe(2);
  });

  it("does not count a missed (never completed) session", () => {
    // No completion recorded for yesterday at all — the summary must reflect
    // that nothing happened, not fabricate a completion for it.
    const summary = analyzeTrainingHistory([], [], testExercisesById, today);
    expect(summary.completedWorkoutsLast7Days).toBe(0);
    expect(summary.previousDayExerciseIds).toEqual([]);
  });

  it("identifies exercises performed recently", () => {
    const completions = [
      makeCompletion({
        completedAt: "2026-01-09T10:00:00.000Z",
        exerciseIds: ["strength-a", "mobility-a"],
      }),
    ];
    const summary = analyzeTrainingHistory(completions, [], testExercisesById, today);
    expect(summary.recentExerciseIds).toEqual(
      expect.arrayContaining(["strength-a", "mobility-a"]),
    );
  });

  it("tracks the last performed date per exercise, even outside the 7-day window", () => {
    const completions = [
      makeCompletion({ completedAt: "2025-11-01T10:00:00.000Z", exerciseIds: ["strength-a"] }),
      makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z", exerciseIds: ["strength-a"] }),
    ];
    const summary = analyzeTrainingHistory(completions, [], testExercisesById, today);
    expect(summary.lastPerformedByExercise["strength-a"]).toBe("2026-01-09");
  });

  it("only counts categories from the last 7 days towards category frequency", () => {
    const completions = [
      makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z", exerciseIds: ["strength-a"] }),
      makeCompletion({ completedAt: "2025-11-01T10:00:00.000Z", exerciseIds: ["cardio-a"] }),
    ];
    const summary = analyzeTrainingHistory(completions, [], testExercisesById, today);
    expect(summary.categoryFrequency.strength).toBe(1);
    expect(summary.categoryFrequency.cardio).toBeUndefined();
  });

  it("reports null days-since-last-workout when nothing was ever completed", () => {
    const summary = analyzeTrainingHistory([], [], testExercisesById, today);
    expect(summary.daysSinceLastWorkout).toBeNull();
  });

  it("does not trigger any automatic catch-up after several days off", () => {
    const completions = [makeCompletion({ completedAt: "2025-12-20T10:00:00.000Z" })];
    const summary = analyzeTrainingHistory(completions, [], testExercisesById, today);
    expect(summary.daysSinceLastWorkout).toBeGreaterThan(7);
    expect(summary.completedWorkoutsLast7Days).toBe(0);
  });
});
