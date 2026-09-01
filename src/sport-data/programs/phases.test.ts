import { describe, expect, it } from "vitest";
import { getPhaseForWeek, PROGRAM_TOTAL_WEEKS, programPhases } from "./phases";

describe("getPhaseForWeek", () => {
  it("returns phase 1 for week 1", () => {
    expect(getPhaseForWeek(1).id).toBe("phase-1");
  });

  it("returns phase 3 for week 5", () => {
    expect(getPhaseForWeek(5).id).toBe("phase-3");
  });

  it("returns phase 4 for week 10", () => {
    expect(getPhaseForWeek(10).id).toBe("phase-4");
  });

  it("covers the full 12-week program without gaps", () => {
    for (let week = 1; week <= PROGRAM_TOTAL_WEEKS; week++) {
      expect(getPhaseForWeek(week)).toBeDefined();
    }
  });

  it("keeps returning a valid phase beyond week 12 instead of throwing", () => {
    expect(getPhaseForWeek(20).id).toBe("phase-4");
  });

  it("difficulty caps never decrease across phases", () => {
    for (let i = 1; i < programPhases.length; i++) {
      expect(programPhases[i]!.difficultyCap).toBeGreaterThanOrEqual(
        programPhases[i - 1]!.difficultyCap,
      );
    }
  });
});
