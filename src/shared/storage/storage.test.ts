import { beforeEach, describe, expect, it } from "vitest";
import { testProfile } from "../../test/fixtures";
import { STORAGE_ROOT_KEY } from "./keys";
import { CURRENT_SCHEMA_VERSION } from "./schema";
import { storage } from "./storage";

beforeEach(() => {
  window.localStorage.clear();
});

describe("storage", () => {
  it("returns an empty, versioned schema when nothing has been stored yet", () => {
    const data = storage.getAll();
    expect(data.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(data.profile).toBeNull();
    expect(data.completions).toEqual([]);
  });

  it("round-trips a profile through the storage abstraction", () => {
    storage.saveProfile(testProfile);
    expect(storage.getProfile()).toEqual(testProfile);
  });

  it("round-trips workout completions", () => {
    storage.addCompletion({
      workoutId: "week-1-day-1",
      completedAt: "2026-01-05T10:00:00.000Z",
      weekNumber: 1,
      dayNumber: 1,
      plannedDurationMinutes: 18,
      difficultyFeedback: "just_right",
      dailyEnergy: "good",
      exerciseIds: ["strength-a"],
    });
    expect(storage.getCompletions()).toHaveLength(1);
  });

  it("keeps one check-in per calendar date, replacing same-day entries", () => {
    storage.upsertCheckIn({ date: "2026-01-05", energy: "tired", painArea: "none" });
    storage.upsertCheckIn({ date: "2026-01-05", energy: "good", painArea: "knees" });
    const checkIns = storage.getCheckIns();
    expect(checkIns).toHaveLength(1);
    expect(checkIns[0]!.energy).toBe("good");
  });

  it("survives malformed stored data by falling back to an empty schema", () => {
    window.localStorage.setItem(STORAGE_ROOT_KEY, "{not valid json");
    const data = storage.getAll();
    expect(data.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(data.profile).toBeNull();
  });

  it("clears all data on demand", () => {
    storage.saveProfile(testProfile);
    storage.clearAll();
    expect(storage.getProfile()).toBeNull();
  });
});
