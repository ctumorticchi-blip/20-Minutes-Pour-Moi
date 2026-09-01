import type { MoveWorkout, WorkoutExercise } from "../../shared/types";
import { SECONDS_PER_REPETITION_ESTIMATE } from "../program/constants";

/** Deterministic time estimate for one workout exercise, sets and rest included. */
export function estimateExerciseSeconds(workoutExercise: WorkoutExercise): number {
  const sets = workoutExercise.sets ?? 1;
  const workSecondsPerSet =
    workoutExercise.durationSeconds ??
    (workoutExercise.repetitions ?? 0) * SECONDS_PER_REPETITION_ESTIMATE;
  const rest = workoutExercise.restSeconds ?? 0;
  return sets * workSecondsPerSet + sets * rest;
}

export function estimateWorkoutSeconds(
  workout: Pick<MoveWorkout, "warmup" | "main" | "cooldown">,
): number {
  const all = [...workout.warmup, ...workout.main, ...workout.cooldown];
  return all.reduce((sum, we) => sum + estimateExerciseSeconds(we), 0);
}

export function estimateWorkoutMinutes(
  workout: Pick<MoveWorkout, "warmup" | "main" | "cooldown">,
): number {
  return estimateWorkoutSeconds(workout) / 60;
}
