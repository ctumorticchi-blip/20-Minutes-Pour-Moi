import type { MoveExercise, MoveWorkout, ProgramPhase, WorkoutExercise } from "../../shared/types";
import type { DayTemplate } from "../../sport-data/programs/weekTemplate";
import { getProgressionForPhase } from "../../sport-data/programs/progression";
import { MAX_SESSION_MINUTES } from "../program/constants";
import { estimateWorkoutMinutes } from "./duration";
import type { WorkoutSelection } from "./selectExercisesForWorkout";

const WARMUP_COOLDOWN_REST_SECONDS = 15;
const MIN_MAIN_EXERCISES = 3;

/** Categories that build up load across the phases and can use more than one set. */
const MULTI_SET_CATEGORIES: MoveExercise["category"][] = ["strength", "balance"];

/**
 * Warmup and cooldown stay at a fixed, gentle dose across the whole program.
 * They prepare and settle the body; they are not where progression happens,
 * so they don't scale with the phase like the main block does.
 */
const WARMUP_COOLDOWN_REPETITIONS = 8;
const WARMUP_COOLDOWN_DURATION_SECONDS = 20;

function toWorkoutExercise(
  exercise: MoveExercise,
  repetitions: number,
  durationSeconds: number,
  restSeconds: number,
  sets = 1,
): WorkoutExercise {
  const isTimed = exercise.durationSeconds !== undefined;
  return {
    exerciseId: exercise.id,
    ...(isTimed ? { durationSeconds } : { repetitions }),
    sets,
    restSeconds,
  };
}

function buildSection(
  ids: string[],
  exercisesById: Record<string, MoveExercise>,
  repetitions: number,
  durationSeconds: number,
  restSeconds: number,
  setsForCategory: (category: MoveExercise["category"]) => number = () => 1,
): WorkoutExercise[] {
  return ids
    .map((id) => exercisesById[id])
    .filter((exercise): exercise is MoveExercise => !!exercise)
    .map((exercise) =>
      toWorkoutExercise(
        exercise,
        repetitions,
        durationSeconds,
        restSeconds,
        setsForCategory(exercise.category),
      ),
    );
}

/** Trims a workout down to the session cap without ever dropping warmup or cooldown. */
export function enforceMaxDuration(workout: MoveWorkout): MoveWorkout {
  const trimmed: MoveWorkout = { ...workout, main: [...workout.main] };

  while (
    estimateWorkoutMinutes(trimmed) > MAX_SESSION_MINUTES &&
    trimmed.main.length > 0
  ) {
    const multiSetIndex = trimmed.main.findIndex((we) => (we.sets ?? 1) > 1);
    if (multiSetIndex !== -1) {
      trimmed.main = trimmed.main.map((we, i) =>
        i === multiSetIndex ? { ...we, sets: 1 } : we,
      );
      continue;
    }
    if (trimmed.main.length > MIN_MAIN_EXERCISES) {
      trimmed.main = trimmed.main.slice(0, -1);
      continue;
    }
    break;
  }

  return { ...trimmed, estimatedDurationMinutes: Math.round(estimateWorkoutMinutes(trimmed)) };
}

export interface BuildWorkoutInput {
  dayTemplate: DayTemplate;
  weekNumber: number;
  phase: ProgramPhase;
  selection: WorkoutSelection;
  exercisesById: Record<string, MoveExercise>;
}

/**
 * Assembles the planned session (before today's energy/pain-driven
 * adaptation) from a pre-computed exercise selection and the phase's
 * progression guidelines. Always includes a warmup and a cooldown, and is
 * always trimmed to fit within the session time cap.
 */
export function buildWorkout(input: BuildWorkoutInput): MoveWorkout {
  const { dayTemplate, weekNumber, phase, selection, exercisesById } = input;
  const progression = getProgressionForPhase(phase);

  const warmup = buildSection(
    selection.warmupIds,
    exercisesById,
    WARMUP_COOLDOWN_REPETITIONS,
    WARMUP_COOLDOWN_DURATION_SECONDS,
    WARMUP_COOLDOWN_REST_SECONDS,
  );

  const main = buildSection(
    selection.mainIds,
    exercisesById,
    progression.repetitions,
    progression.durationSeconds,
    progression.restSeconds,
    (category) => (MULTI_SET_CATEGORIES.includes(category) ? progression.mainSets : 1),
  );

  const cooldown = buildSection(
    selection.cooldownIds,
    exercisesById,
    WARMUP_COOLDOWN_REPETITIONS,
    WARMUP_COOLDOWN_DURATION_SECONDS,
    WARMUP_COOLDOWN_REST_SECONDS,
  );

  const workout: MoveWorkout = {
    id: `week-${weekNumber}-day-${dayTemplate.dayNumber}`,
    title: dayTemplate.title,
    dayNumber: dayTemplate.dayNumber,
    weekNumber,
    focus: dayTemplate.focus,
    estimatedDurationMinutes: 0,
    warmup,
    main,
    cooldown,
  };

  return enforceMaxDuration(workout);
}
