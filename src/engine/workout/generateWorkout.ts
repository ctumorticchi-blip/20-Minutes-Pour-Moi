import type {
  BodyAreaLoad,
  DailyEnergy,
  DailyPainArea,
  MoveExercise,
  MoveWorkout,
  ProgramPhase,
  TrainingHistorySummary,
  UserProfile,
} from "../../shared/types";
import type { DayTemplate } from "../../sport-data/programs/weekTemplate";
import { adaptWorkout } from "../adaptation/adaptWorkout";
import { buildWorkout } from "./buildWorkout";
import { selectExercisesForWorkout } from "./selectExercisesForWorkout";

export interface GenerateWorkoutInput {
  dayTemplate: DayTemplate;
  weekNumber: number;
  phase: ProgramPhase;
  profile: UserProfile;
  energy: DailyEnergy;
  painArea: DailyPainArea;
  history: TrainingHistorySummary;
  bodyAreaLoads: BodyAreaLoad[];
  availableExercises: MoveExercise[];
  referenceDateIso?: string;
}

/**
 * The full pipeline for a single day: select exercises (recovery- and
 * history-aware) → assemble the planned session (phase progression) → adapt
 * it to today (energy, pain, feedback). Deterministic end to end, so the
 * Today preview and the Workout Player recompute the exact same session
 * from the same stored inputs without needing to persist the workout itself.
 */
export function generateWorkout(input: GenerateWorkoutInput): MoveWorkout {
  const exercisesById: Record<string, MoveExercise> = Object.fromEntries(
    input.availableExercises.map((exercise) => [exercise.id, exercise]),
  );

  const selection = selectExercisesForWorkout({
    dayTemplate: input.dayTemplate,
    profile: input.profile,
    painArea: input.painArea,
    phase: input.phase,
    history: input.history,
    bodyAreaLoads: input.bodyAreaLoads,
    availableExercises: input.availableExercises,
    referenceDateIso: input.referenceDateIso,
  });

  const planned = buildWorkout({
    dayTemplate: input.dayTemplate,
    weekNumber: input.weekNumber,
    phase: input.phase,
    selection,
    exercisesById,
  });

  return adaptWorkout(planned, {
    profile: input.profile,
    energy: input.energy,
    painArea: input.painArea,
    history: input.history,
    availableExercises: input.availableExercises,
  });
}
