import { describe, expect, it } from "vitest";
import type { MoveWorkout, TrainingHistorySummary } from "../../shared/types";
import { testExercises, testProfile } from "../../test/fixtures";
import { adaptWorkout } from "./adaptWorkout";

const baseHistory: TrainingHistorySummary = {
  completedWorkoutsLast7Days: 0,
  recentExerciseIds: [],
  lastPerformedByExercise: {},
  categoryFrequency: {},
  previousDayCategories: [],
  previousDayExerciseIds: [],
  recentDifficultyFeedback: [],
  recentPainAreas: [],
  daysSinceLastWorkout: null,
};

const plannedWorkout: MoveWorkout = {
  id: "week-1-day-1",
  title: "Séance de test",
  dayNumber: 1,
  weekNumber: 1,
  focus: ["strength"],
  estimatedDurationMinutes: 10,
  warmup: [{ exerciseId: "mobility-a", repetitions: 8, sets: 1, restSeconds: 15 }],
  main: [
    { exerciseId: "strength-a", repetitions: 10, sets: 1, restSeconds: 20 },
    { exerciseId: "balance-a", durationSeconds: 15, sets: 2, restSeconds: 20 },
  ],
  cooldown: [{ exerciseId: "mobility-b", durationSeconds: 20, sets: 1, restSeconds: 15 }],
};

function adapt(
  energy: "tired" | "good" | "energetic",
  history: TrainingHistorySummary = baseHistory,
  painArea: "none" | "knees" = "none",
) {
  return adaptWorkout(plannedWorkout, {
    profile: testProfile,
    energy,
    painArea,
    history,
    availableExercises: testExercises,
  });
}

describe("adaptWorkout", () => {
  it("reduces volume when the user reports being tired", () => {
    const good = adapt("good");
    const tired = adapt("tired");
    expect(tired.main[0]!.repetitions!).toBeLessThan(good.main[0]!.repetitions!);
  });

  it("keeps the standard session when the user feels good", () => {
    const good = adapt("good");
    expect(good.main[0]!.repetitions).toBe(10);
    expect(good.main[1]!.sets).toBe(2);
  });

  it("reduces a future similar session after a too_hard feedback", () => {
    const afterTooHard = adapt("good", { ...baseHistory, recentDifficultyFeedback: ["too_hard"] });
    const standard = adapt("good");
    expect(afterTooHard.main[0]!.repetitions!).toBeLessThan(standard.main[0]!.repetitions!);
  });

  it("allows a modest progression after repeated too_easy feedback", () => {
    const afterTooEasy = adapt("good", {
      ...baseHistory,
      recentDifficultyFeedback: ["too_easy", "too_easy"],
    });
    const standard = adapt("good");
    expect(afterTooEasy.main[0]!.repetitions!).toBeGreaterThan(standard.main[0]!.repetitions!);
  });

  it("combines fatigue and a recent too_hard session into a stronger reduction", () => {
    const combined = adapt("tired", { ...baseHistory, recentDifficultyFeedback: ["too_hard"] });
    const tiredOnly = adapt("tired");
    expect(combined.main[0]!.repetitions!).toBeLessThanOrEqual(tiredOnly.main[0]!.repetitions!);
  });

  it("excludes exercises incompatible with today's reported pain", () => {
    const withKneePain = adapt("good", baseHistory, "knees");
    const ids = [...withKneePain.warmup, ...withKneePain.main, ...withKneePain.cooldown].map(
      (we) => we.exerciseId,
    );
    expect(ids).not.toContain("strength-a");
  });

  it("never adds sets when reducing volume", () => {
    const tired = adapt("tired");
    expect(tired.main[1]!.sets).toBe(1);
  });

  it("is deterministic: identical inputs always produce the identical adapted workout", () => {
    const a = adapt("tired", { ...baseHistory, recentDifficultyFeedback: ["too_hard"] });
    const b = adapt("tired", { ...baseHistory, recentDifficultyFeedback: ["too_hard"] });
    expect(a).toEqual(b);
  });
});
