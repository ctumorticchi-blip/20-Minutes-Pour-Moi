import type { DailyPainArea } from "./daily";
import type { BodyArea, ExerciseCategory } from "./exercise";
import type { WorkoutDifficultyFeedback } from "./feedback";

/**
 * A read of the user's recent training activity, built from stored completions
 * and check-ins. Nothing here is diagnostic; it only feeds the adaptation engine.
 */
export interface TrainingHistorySummary {
  completedWorkoutsLast7Days: number;

  recentExerciseIds: string[];

  /** Exercise id -> ISO date it was last performed. */
  lastPerformedByExercise: Record<string, string>;

  categoryFrequency: Partial<Record<ExerciseCategory, number>>;

  previousDayCategories: ExerciseCategory[];

  previousDayExerciseIds: string[];

  recentDifficultyFeedback: WorkoutDifficultyFeedback[];

  recentPainAreas: DailyPainArea[];

  /** Number of consecutive calendar days without a completed workout, ending yesterday. */
  daysSinceLastWorkout: number | null;
}

/** A simple, deterministic estimate of how much a body area has been worked recently. */
export interface BodyAreaLoad {
  bodyArea: BodyArea;
  recentLoad: number;
  lastTrainedAt?: string;
}
