/** How the user reports feeling before a session. */
export type DailyEnergy = "tired" | "good" | "energetic";

/** A body area the user reports as painful today. "none" and "other" are always available. */
export type DailyPainArea =
  | "none"
  | "knees"
  | "back"
  | "hips"
  | "shoulders"
  | "ankles"
  | "other";

/** A single day's check-in, persisted so the engine can reason about recent state. */
export interface DailyCheckIn {
  /** ISO date (yyyy-mm-dd), one check-in per calendar date. */
  date: string;
  energy: DailyEnergy;
  painArea: DailyPainArea;
}
