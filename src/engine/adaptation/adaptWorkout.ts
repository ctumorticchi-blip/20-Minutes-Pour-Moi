import type {
  DailyEnergy,
  DailyPainArea,
  MoveExercise,
  MoveWorkout,
  TrainingHistorySummary,
  UserProfile,
  WorkoutExercise,
} from "../../shared/types";
import { enforceMaxDuration } from "../workout/buildWorkout";
import { hasRequiredEquipment, isSafeForToday } from "../workout/selectExercisesForWorkout";

export interface AdaptWorkoutContext {
  profile: UserProfile;
  energy: DailyEnergy;
  painArea: DailyPainArea;
  history: TrainingHistorySummary;
  availableExercises: MoveExercise[];
}

const MIN_REPETITIONS = 4;
const MIN_DURATION_SECONDS = 15;
const MIN_VOLUME_FACTOR = 0.6;
const MAX_VOLUME_FACTOR = 1.15;

/**
 * How much to scale today's main-block volume (reps / hold time), based on
 * energy and recent feedback. Never touches exercise *selection* difficulty —
 * only how much of it is asked for today. Warmup and cooldown are
 * deliberately left untouched: they stay a stable, reassuring constant.
 */
function computeVolumeFactor(
  energy: DailyEnergy,
  history: TrainingHistorySummary,
): number {
  let factor = 1;

  if (energy === "tired") factor *= 0.8;
  else if (energy === "energetic") factor *= 1.05;

  const feedback = history.recentDifficultyFeedback;
  const lastFeedback = feedback[feedback.length - 1];
  const lastTwoWereTooEasy =
    feedback.length >= 2 && feedback.slice(-2).every((f) => f === "too_easy");

  if (lastFeedback === "too_hard") factor *= 0.9;
  if (lastTwoWereTooEasy) factor *= 1.1;

  // Fatigue combined with a recently-too-hard session calls for a stronger,
  // deliberate step back rather than the two adjustments simply stacking.
  if (energy === "tired" && lastFeedback === "too_hard") factor *= 0.85;

  return Math.min(Math.max(factor, MIN_VOLUME_FACTOR), MAX_VOLUME_FACTOR);
}

function scaleMainVolume(main: WorkoutExercise[], factor: number): WorkoutExercise[] {
  return main.map((we) => {
    const scaled: WorkoutExercise = { ...we };
    if (we.repetitions !== undefined) {
      scaled.repetitions = Math.max(MIN_REPETITIONS, Math.round(we.repetitions * factor));
    }
    if (we.durationSeconds !== undefined) {
      scaled.durationSeconds = Math.max(
        MIN_DURATION_SECONDS,
        Math.round(we.durationSeconds * factor),
      );
    }
    // Never let fatigue-driven scaling add sets; only phase progression does that.
    if (factor < 1 && (we.sets ?? 1) > 1) {
      scaled.sets = 1;
    }
    return scaled;
  });
}

/**
 * Re-checks every exercise against today's pain and the user's sensitive
 * areas, replacing what it safely can and dropping the rest. This is a
 * defensive second pass: selection already applies the same safety filter,
 * but a workout can be re-adapted later with different pain input.
 */
function reapplyPainSafety(
  workout: MoveWorkout,
  context: AdaptWorkoutContext,
  exercisesById: Record<string, MoveExercise>,
): MoveWorkout {
  const usedIds = new Set(
    [...workout.warmup, ...workout.main, ...workout.cooldown].map((we) => we.exerciseId),
  );

  const findReplacement = (category: MoveExercise["category"]): MoveExercise | undefined =>
    context.availableExercises
      .filter(
        (candidate) =>
          candidate.category === category &&
          !usedIds.has(candidate.id) &&
          hasRequiredEquipment(candidate, context.profile) &&
          isSafeForToday(candidate, context.profile, context.painArea),
      )
      .sort((a, b) => a.id.localeCompare(b.id))[0];

  const filterSection = (section: WorkoutExercise[]): WorkoutExercise[] =>
    section.flatMap((we) => {
      const exercise = exercisesById[we.exerciseId];
      if (!exercise) return [];
      if (isSafeForToday(exercise, context.profile, context.painArea)) return [we];

      const replacement = findReplacement(exercise.category);
      if (!replacement) return [];
      usedIds.delete(we.exerciseId);
      usedIds.add(replacement.id);
      return [{ ...we, exerciseId: replacement.id }];
    });

  return {
    ...workout,
    warmup: filterSection(workout.warmup),
    main: filterSection(workout.main),
    cooldown: filterSection(workout.cooldown),
  };
}

/**
 * The central adaptation function: takes the session already planned for
 * today's program day and adjusts it to today's real state — energy, pain,
 * and what recent feedback says. Pure and deterministic: same planned
 * workout + same context always produce the same adapted session.
 */
export function adaptWorkout(
  planned: MoveWorkout,
  context: AdaptWorkoutContext,
): MoveWorkout {
  const exercisesById: Record<string, MoveExercise> = Object.fromEntries(
    context.availableExercises.map((exercise) => [exercise.id, exercise]),
  );

  const safeWorkout = reapplyPainSafety(planned, context, exercisesById);
  const factor = computeVolumeFactor(context.energy, context.history);
  const adapted: MoveWorkout = {
    ...safeWorkout,
    main: scaleMainVolume(safeWorkout.main, factor),
  };

  return enforceMaxDuration(adapted);
}
