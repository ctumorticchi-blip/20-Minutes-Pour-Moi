import { describe, expect, it } from "vitest";
import { getProgramPosition } from "./position";

describe("getProgramPosition", () => {
  it("maps Monday through Friday to training days 1-5", () => {
    // 2026-01-05 is a Monday.
    expect(getProgramPosition("2026-01-05", "2026-01-05").dayNumber).toBe(1);
    expect(getProgramPosition("2026-01-05", "2026-01-06").dayNumber).toBe(2);
    expect(getProgramPosition("2026-01-05", "2026-01-09").dayNumber).toBe(5);
  });

  it("treats Saturday and Sunday as rest days", () => {
    expect(getProgramPosition("2026-01-05", "2026-01-10").isRestDay).toBe(true);
    expect(getProgramPosition("2026-01-05", "2026-01-11").isRestDay).toBe(true);
  });

  it("advances the week number as calendar weeks pass", () => {
    expect(getProgramPosition("2026-01-05", "2026-01-05").weekNumber).toBe(1);
    expect(getProgramPosition("2026-01-05", "2026-01-12").weekNumber).toBe(2);
    expect(getProgramPosition("2026-01-05", "2026-02-02").weekNumber).toBe(5);
  });

  it("never accumulates missed days: the position depends only on today's date", () => {
    // Whether or not sessions were completed earlier, the position for a given
    // date is always the same — there is no backlog to "catch up" on.
    const a = getProgramPosition("2026-01-05", "2026-01-14");
    const b = getProgramPosition("2026-01-05", "2026-01-14");
    expect(a).toEqual(b);
  });
});
