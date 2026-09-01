import type { ExerciseCategory } from "./exercise";

export interface WorkoutExercise {
  exerciseId: string;
  durationSeconds?: number;
  repetitions?: number;
  sets?: number;
  restSeconds?: number;
}

export interface MoveWorkout {
  id: string;
  title: string;
  dayNumber: number;
  weekNumber: number;

  focus: ExerciseCategory[];

  estimatedDurationMinutes: number;

  warmup: WorkoutExercise[];
  main: WorkoutExercise[];
  cooldown: WorkoutExercise[];
}
