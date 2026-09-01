import { describe, expect, it } from "vitest";
import { allExercises, exercisesById } from "../../sport-data/exercises";
import { getPhaseForWeek, PROGRAM_TOTAL_WEEKS } from "../../sport-data/programs/phases";
import { weekTemplate } from "../../sport-data/programs/weekTemplate";
import { testProfile } from "../../test/fixtures";
import { analyzeTrainingHistory } from "../history/analyzeTrainingHistory";
import { computeBodyAreaLoads } from "../recovery/bodyAreaLoad";
import { MAX_SESSION_MINUTES } from "../program/constants";
import { buildWorkout } from "./buildWorkout";
import { selectExercisesForWorkout } from "./selectExercisesForWorkout";

const emptyHistory = analyzeTrainingHistory([], [], exercisesById, "2026-03-02");
const emptyLoads = computeBodyAreaLoads([], exercisesById, "2026-03-02");

function planFor(weekNumber: number, dayNumber: number) {
  const phase = getPhaseForWeek(weekNumber);
  const dayTemplate = weekTemplate.find((d) => d.dayNumber === dayNumber)!;
  const selection = selectExercisesForWorkout({
    dayTemplate,
    profile: testProfile,
    painArea: "none",
    phase,
    history: emptyHistory,
    bodyAreaLoads: emptyLoads,
    availableExercises: allExercises,
    referenceDateIso: "2026-03-02",
  });
  return buildWorkout({ dayTemplate, weekNumber, phase, selection, exercisesById });
}

describe("buildWorkout", () => {
  it("never exceeds the 20-minute session cap, across every week and day", () => {
    for (let week = 1; week <= PROGRAM_TOTAL_WEEKS; week++) {
      for (const day of weekTemplate) {
        const workout = planFor(week, day.dayNumber);
        expect(workout.estimatedDurationMinutes).toBeLessThanOrEqual(MAX_SESSION_MINUTES);
      }
    }
  });

  it("always includes a warmup", () => {
    const workout = planFor(1, 1);
    expect(workout.warmup.length).toBeGreaterThan(0);
  });

  it("always includes a cooldown", () => {
    const workout = planFor(1, 1);
    expect(workout.cooldown.length).toBeGreaterThan(0);
  });

  it("labels the session with the right week and day numbers", () => {
    const workout = planFor(3, 2);
    expect(workout.weekNumber).toBe(3);
    expect(workout.dayNumber).toBe(2);
  });
});
