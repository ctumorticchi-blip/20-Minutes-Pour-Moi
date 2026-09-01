import type { MoveExercise } from "../../shared/types";
import { balanceExercises } from "./balance";
import { cardioExercises } from "./cardio";
import { mobilityExercises } from "./mobility";
import { pilatesExercises } from "./pilates";
import { strengthExercises } from "./strength";

export const allExercises: MoveExercise[] = [
  ...strengthExercises,
  ...cardioExercises,
  ...mobilityExercises,
  ...pilatesExercises,
  ...balanceExercises,
];

export const exercisesById: Record<string, MoveExercise> = Object.fromEntries(
  allExercises.map((exercise) => [exercise.id, exercise]),
);

export function getExerciseById(id: string): MoveExercise | undefined {
  return exercisesById[id];
}

export {
  balanceExercises,
  cardioExercises,
  mobilityExercises,
  pilatesExercises,
  strengthExercises,
};
