import { describe, expect, it } from "vitest";
import { makeCompletion } from "../../test/fixtures";
import { computeProgressStats } from "./progressStats";

describe("computeProgressStats", () => {
  it("counts total completions and this week's completions correctly", () => {
    const programStart = "2026-01-05"; // a Monday
    const completions = [
      makeCompletion({ weekNumber: 1, dayNumber: 1 }),
      makeCompletion({ weekNumber: 1, dayNumber: 2 }),
      makeCompletion({ weekNumber: 2, dayNumber: 1 }),
    ];
    // "today" is still within week 1 relative to programStart.
    const stats = computeProgressStats(completions, programStart, "2026-01-06");
    expect(stats.totalCompleted).toBe(3);
    expect(stats.completedThisWeek).toBe(2);
    expect(stats.currentWeek).toBe(1);
  });

  it("computes the longest streak of active weeks", () => {
    const programStart = "2026-01-05";
    const completions = [
      makeCompletion({ weekNumber: 1 }),
      makeCompletion({ weekNumber: 2 }),
      makeCompletion({ weekNumber: 3 }),
      makeCompletion({ weekNumber: 5 }),
    ];
    const stats = computeProgressStats(completions, programStart, "2026-03-01");
    expect(stats.bestActiveWeekStreak).toBe(3);
    expect(stats.activeWeeksCount).toBe(4);
  });

  it("reports zero activity for a brand new program", () => {
    const stats = computeProgressStats([], "2026-01-05", "2026-01-05");
    expect(stats.totalCompleted).toBe(0);
    expect(stats.completedThisWeek).toBe(0);
    expect(stats.bestActiveWeekStreak).toBe(0);
  });
});
