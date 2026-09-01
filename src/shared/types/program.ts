export interface ProgramPhase {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
  description: string;
  volumeMultiplier: number;
  difficultyCap: 1 | 2 | 3;
}

/** Where the user currently sits in the 12-week program, derived from calendar dates. */
export interface ProgramPosition {
  weekNumber: number;
  /** ISO weekday: 1 = Monday ... 7 = Sunday. */
  isoWeekday: number;
  /** 1-5 on a scheduled training day, null on a rest day (weekend). */
  dayNumber: number | null;
  isRestDay: boolean;
}
