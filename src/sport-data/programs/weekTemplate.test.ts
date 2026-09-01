import { describe, expect, it } from "vitest";
import { TRAINING_DAYS_PER_WEEK, weekTemplate } from "./weekTemplate";

describe("weekTemplate", () => {
  it("plans exactly 5 sessions per week", () => {
    expect(weekTemplate).toHaveLength(5);
    expect(TRAINING_DAYS_PER_WEEK).toBe(5);
  });

  it("numbers days 1 through 5 without gaps or duplicates", () => {
    const dayNumbers = weekTemplate.map((d) => d.dayNumber).sort((a, b) => a - b);
    expect(dayNumbers).toEqual([1, 2, 3, 4, 5]);
  });

  it("weaves balance work into every day", () => {
    for (const day of weekTemplate) {
      const hasBalance = day.mainSlots.some((slot) => slot.category === "balance");
      expect(hasBalance).toBe(true);
    }
  });
});
