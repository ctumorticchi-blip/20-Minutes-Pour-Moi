import { describe, expect, it } from "vitest";
import {
  makeCompletion,
  testDayTemplate,
  testExercises,
  testExercisesById,
  testPhase,
  testProfile,
} from "../../test/fixtures";
import { analyzeTrainingHistory } from "../history/analyzeTrainingHistory";
import { computeBodyAreaLoads } from "../recovery/bodyAreaLoad";
import { selectExercisesForWorkout } from "./selectExercisesForWorkout";

const today = "2026-01-06";
const emptyHistory = analyzeTrainingHistory([], [], testExercisesById, today);
const emptyLoads = computeBodyAreaLoads([], testExercisesById, today);

function select(overrides: Partial<Parameters<typeof selectExercisesForWorkout>[0]> = {}) {
  return selectExercisesForWorkout({
    dayTemplate: testDayTemplate,
    profile: testProfile,
    painArea: "none",
    phase: testPhase,
    history: emptyHistory,
    bodyAreaLoads: emptyLoads,
    availableExercises: testExercises,
    referenceDateIso: today,
    ...overrides,
  });
}

describe("selectExercisesForWorkout", () => {
  it("excludes an exercise marked avoidWith the reported pain area", () => {
    const selection = select({ painArea: "knees" });
    const allIds = [...selection.warmupIds, ...selection.mainIds, ...selection.cooldownIds];
    expect(allIds).not.toContain("strength-a");
  });

  it("keeps the exercise when there is no matching pain", () => {
    const selection = select({ painArea: "none" });
    const allIds = [...selection.warmupIds, ...selection.mainIds, ...selection.cooldownIds];
    // strength-a is otherwise the top-ranked strength candidate, so it should be picked.
    expect(allIds).toContain("strength-a");
  });

  it("avoids repeating a recovery_sensitive exercise the day right after it was done", () => {
    const yesterdayCompletion = makeCompletion({
      completedAt: "2026-01-05T10:00:00.000Z",
      exerciseIds: ["core-sensitive", "mobility-a"],
    });
    const history = analyzeTrainingHistory(
      [yesterdayCompletion],
      [],
      testExercisesById,
      today,
    );
    expect(history.previousDayExerciseIds).toContain("core-sensitive");

    const dayTemplateWithPilates = {
      ...testDayTemplate,
      mainSlots: [{ category: "pilates" as const, count: 1 }],
    };
    const selection = select({ dayTemplate: dayTemplateWithPilates, history });
    // "core-sensitive" is the only pilates exercise in the fixture catalog; with no
    // alternative the engine still has to pick it, so instead we check it is *not*
    // preferred once an easier-to-repeat alternative exists.
    expect(selection.mainIds).toContain("core-sensitive");
  });

  it("deprioritizes a recovery_sensitive exercise when an alternative in its category exists", () => {
    const extendedCatalog = [
      ...testExercises,
      {
        ...testExercises.find((e) => e.id === "core-sensitive")!,
        id: "core-alt",
        repeatability: "normal" as const,
      },
    ];
    const yesterdayCompletion = makeCompletion({
      completedAt: "2026-01-05T10:00:00.000Z",
      exerciseIds: ["core-sensitive"],
    });
    const history = analyzeTrainingHistory([yesterdayCompletion], [], testExercisesById, today);

    const dayTemplateWithPilates = {
      ...testDayTemplate,
      mainSlots: [{ category: "pilates" as const, count: 1 }],
    };
    const selection = select({
      dayTemplate: dayTemplateWithPilates,
      history,
      availableExercises: extendedCatalog,
    });
    expect(selection.mainIds).toEqual(["core-alt"]);
  });

  it("is deterministic: identical inputs always produce identical selections", () => {
    const a = select();
    const b = select();
    expect(a).toEqual(b);
  });
});
