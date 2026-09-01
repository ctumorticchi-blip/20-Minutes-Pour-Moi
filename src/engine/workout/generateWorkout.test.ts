import { describe, expect, it } from "vitest";
import { makeCompletion, testDayTemplate, testExercises, testPhase, testProfile } from "../../test/fixtures";
import { analyzeTrainingHistory } from "../history/analyzeTrainingHistory";
import { computeBodyAreaLoads } from "../recovery/bodyAreaLoad";
import { generateWorkout } from "./generateWorkout";

const today = "2026-01-10";

function buildInput(completions: ReturnType<typeof makeCompletion>[] = []) {
  const exercisesById = Object.fromEntries(testExercises.map((e) => [e.id, e]));
  const history = analyzeTrainingHistory(completions, [], exercisesById, today);
  const bodyAreaLoads = computeBodyAreaLoads(completions, exercisesById, today);
  return {
    dayTemplate: testDayTemplate,
    weekNumber: 2,
    phase: testPhase,
    profile: testProfile,
    energy: "good" as const,
    painArea: "none" as const,
    history,
    bodyAreaLoads,
    availableExercises: testExercises,
    referenceDateIso: today,
  };
}

describe("generateWorkout", () => {
  it("is fully deterministic given identical inputs (same history, same profile, same day)", () => {
    const completions = [
      makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z", exerciseIds: ["strength-b"] }),
    ];
    const first = generateWorkout(buildInput(completions));
    const second = generateWorkout(buildInput(completions));
    expect(first).toEqual(second);
  });

  it("produces a session that respects the 20-minute cap", () => {
    const workout = generateWorkout(buildInput());
    expect(workout.estimatedDurationMinutes).toBeLessThanOrEqual(20);
  });
});
