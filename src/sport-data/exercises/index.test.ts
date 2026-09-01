import { describe, expect, it } from "vitest";
import { allExercises } from "./index";

describe("exercise catalog", () => {
  it("has around 30 seed exercises", () => {
    expect(allExercises.length).toBeGreaterThanOrEqual(28);
  });

  it("has unique ids", () => {
    const ids = allExercises.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is entirely low-impact", () => {
    expect(allExercises.every((e) => e.lowImpact)).toBe(true);
  });

  it("covers all five categories", () => {
    const categories = new Set(allExercises.map((e) => e.category));
    expect(categories).toEqual(
      new Set(["strength", "cardio", "mobility", "pilates", "balance"]),
    );
  });

  it("gives every exercise an illustration key", () => {
    expect(allExercises.every((e) => e.illustrationKey.length > 0)).toBe(true);
  });
});
