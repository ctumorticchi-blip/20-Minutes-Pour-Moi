import { describe, expect, it } from "vitest";
import { makeCompletion, testExercisesById } from "../../test/fixtures";
import { computeBodyAreaLoads, getLoadForArea, isBodyAreaStillRecovering } from "./bodyAreaLoad";

const today = "2026-01-10";

describe("computeBodyAreaLoads", () => {
  it("weights yesterday's training more heavily than training from 3 or 7 days ago", () => {
    const loads = computeBodyAreaLoads(
      [
        makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z", exerciseIds: ["strength-a"] }), // 1 day ago -> legs
      ],
      testExercisesById,
      today,
    );
    const olderLoads = computeBodyAreaLoads(
      [
        makeCompletion({ completedAt: "2026-01-03T10:00:00.000Z", exerciseIds: ["strength-a"] }), // 7 days ago -> legs
      ],
      testExercisesById,
      today,
    );
    expect(getLoadForArea(loads, "legs")).toBeGreaterThan(getLoadForArea(olderLoads, "legs"));
  });

  it("does not count training from more than 7 days ago", () => {
    const loads = computeBodyAreaLoads(
      [makeCompletion({ completedAt: "2025-12-01T10:00:00.000Z", exerciseIds: ["strength-a"] })],
      testExercisesById,
      today,
    );
    expect(getLoadForArea(loads, "legs")).toBe(0);
  });

  it("flags a body area worked yesterday as still recovering today", () => {
    const loads = computeBodyAreaLoads(
      [makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z", exerciseIds: ["strength-a"] })],
      testExercisesById,
      today,
    );
    expect(isBodyAreaStillRecovering(loads, "legs")).toBe(true);
    // An unrelated area worked yesterday should not appear loaded.
    expect(isBodyAreaStillRecovering(loads, "arms")).toBe(false);
  });

  it("accumulates load across the last 3 days for the same area", () => {
    const loads = computeBodyAreaLoads(
      [
        makeCompletion({ completedAt: "2026-01-08T10:00:00.000Z", exerciseIds: ["strength-a"] }),
        makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z", exerciseIds: ["strength-a"] }),
      ],
      testExercisesById,
      today,
    );
    const singleDay = computeBodyAreaLoads(
      [makeCompletion({ completedAt: "2026-01-09T10:00:00.000Z", exerciseIds: ["strength-a"] })],
      testExercisesById,
      today,
    );
    expect(getLoadForArea(loads, "legs")).toBeGreaterThan(getLoadForArea(singleDay, "legs"));
  });
});
