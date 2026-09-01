import type { DailyEnergy, DailyPainArea } from "./daily";

export type WorkoutDifficultyFeedback = "too_hard" | "just_right" | "too_easy";

export interface WorkoutCompletion {
  workoutId: string;
  completedAt: string;

  weekNumber: number;
  dayNumber: number;

  plannedDurationMinutes: number;
  actualDurationMinutes?: number;

  difficultyFeedback: WorkoutDifficultyFeedback;
  dailyEnergy: DailyEnergy;

  painArea?: DailyPainArea;

  /** Exercise ids actually included in this completed workout, used by the memory engine. */
  exerciseIds: string[];
}
