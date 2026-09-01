import { HISTORY_WINDOW_DAYS } from "../program/constants";
import type {
  DailyCheckIn,
  ExerciseCategory,
  MoveExercise,
  TrainingHistorySummary,
  WorkoutCompletion,
} from "../../shared/types";
import { diffInDays, todayIsoDate } from "../../shared/utils/date";

/**
 * Reads the user's recent activity from stored completions and check-ins.
 * Pure and deterministic: same inputs (including `referenceDateIso`) always
 * produce the same summary, so callers can test it without mocking dates.
 *
 * `exercisesById` is the Move-specific exercise catalog. Keeping it as a
 * parameter (rather than importing sport-data here) is the seam a future
 * multi-sport engine would cut along: a generic `analyzeTrainingHistory`
 * would take a category-lookup callback instead of a Move exercise map.
 */
export function analyzeTrainingHistory(
  completions: WorkoutCompletion[],
  checkIns: DailyCheckIn[],
  exercisesById: Record<string, MoveExercise>,
  referenceDateIso: string = todayIsoDate(),
): TrainingHistorySummary {
  const withinWindow = (isoDate: string, windowDays: number): boolean => {
    const diff = diffInDays(isoDate, referenceDateIso);
    return diff >= 1 && diff <= windowDays;
  };

  const completionDateOf = (completion: WorkoutCompletion): string =>
    completion.completedAt.slice(0, 10);

  const last7DaysCompletions = completions.filter((c) =>
    withinWindow(completionDateOf(c), HISTORY_WINDOW_DAYS),
  );

  const recentExerciseIds = Array.from(
    new Set(last7DaysCompletions.flatMap((c) => c.exerciseIds)),
  );

  const lastPerformedByExercise: Record<string, string> = {};
  for (const completion of completions) {
    const date = completionDateOf(completion);
    for (const exerciseId of completion.exerciseIds) {
      const previous = lastPerformedByExercise[exerciseId];
      if (!previous || date > previous) {
        lastPerformedByExercise[exerciseId] = date;
      }
    }
  }

  const categoryFrequency: Partial<Record<ExerciseCategory, number>> = {};
  for (const completion of last7DaysCompletions) {
    for (const exerciseId of completion.exerciseIds) {
      const category = exercisesById[exerciseId]?.category;
      if (!category) continue;
      categoryFrequency[category] = (categoryFrequency[category] ?? 0) + 1;
    }
  }

  const yesterdayCompletions = completions.filter(
    (c) => diffInDays(completionDateOf(c), referenceDateIso) === 1,
  );
  const previousDayExerciseIds = Array.from(
    new Set(yesterdayCompletions.flatMap((c) => c.exerciseIds)),
  );
  const previousDayCategories = Array.from(
    new Set(
      previousDayExerciseIds
        .map((id) => exercisesById[id]?.category)
        .filter((c): c is ExerciseCategory => !!c),
    ),
  );

  const recentDifficultyFeedback = last7DaysCompletions
    .slice()
    .sort((a, b) => a.completedAt.localeCompare(b.completedAt))
    .map((c) => c.difficultyFeedback);

  const recentPainAreas = checkIns
    .filter((c) => withinWindow(c.date, HISTORY_WINDOW_DAYS) && c.painArea !== "none")
    .map((c) => c.painArea);

  const mostRecentCompletionDate = completions
    .map(completionDateOf)
    .sort()
    .pop();
  const daysSinceLastWorkout = mostRecentCompletionDate
    ? diffInDays(mostRecentCompletionDate, referenceDateIso)
    : null;

  return {
    completedWorkoutsLast7Days: last7DaysCompletions.length,
    recentExerciseIds,
    lastPerformedByExercise,
    categoryFrequency,
    previousDayCategories,
    previousDayExerciseIds,
    recentDifficultyFeedback,
    recentPainAreas,
    daysSinceLastWorkout,
  };
}
