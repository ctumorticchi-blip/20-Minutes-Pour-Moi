import { useState } from "react";
import type { MoveExercise, WorkoutExercise } from "../../../shared/types";
import { IllustrationPlaceholder } from "../../../shared/components/IllustrationPlaceholder";
import { Button } from "../../../shared/components/Button";
import { CATEGORY_LABELS } from "../../../sport-data/content/editorial";
import { PAIN_DURING_SESSION_NOTICE } from "../../../sport-data/content/editorial";

interface ExerciseCardProps {
  exercise: MoveExercise;
  workoutExercise: WorkoutExercise;
  positionLabel: string;
  countdown?: {
    remainingSeconds: number;
    isRunning: boolean;
    pause: () => void;
    resume: () => void;
  };
}

export function ExerciseCard({
  exercise,
  workoutExercise,
  positionLabel,
  countdown,
}: ExerciseCardProps) {
  const [showEasier, setShowEasier] = useState(false);

  return (
    <div>
      <p className="text-sm font-medium text-warmgray-500">{positionLabel}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-sage-700">
        {CATEGORY_LABELS[exercise.category]}
        {(workoutExercise.sets ?? 1) > 1 && ` · ${workoutExercise.sets} séries`}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-warmgray-900">{exercise.name}</h1>

      <IllustrationPlaceholder
        illustrationKey={exercise.illustrationKey}
        category={exercise.category}
        className="mt-4"
      />

      {countdown ? (
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-5xl font-semibold tabular-nums text-warmgray-900" aria-live="polite">
            {countdown.remainingSeconds}s
          </p>
          <Button
            variant="secondary"
            className="w-auto px-6"
            onClick={countdown.isRunning ? countdown.pause : countdown.resume}
          >
            {countdown.isRunning ? "Pause" : "Reprendre"}
          </Button>
        </div>
      ) : (
        <p className="mt-5 text-3xl font-semibold text-warmgray-900">
          {workoutExercise.repetitions} répétitions
        </p>
      )}

      <ul className="mt-5 space-y-2 text-warmgray-700">
        {exercise.instructions.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      {exercise.breathingCue && (
        <p className="mt-4 text-sm italic text-warmgray-500">{exercise.breathingCue}</p>
      )}

      {exercise.avoidWith && exercise.avoidWith.length > 0 && (
        <p className="mt-4 text-xs text-warmgray-400">{PAIN_DURING_SESSION_NOTICE}</p>
      )}

      {exercise.easierVariation && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowEasier((v) => !v)}
            className="text-sm font-medium text-sage-700 underline underline-offset-2"
          >
            Version plus facile
          </button>
          {showEasier && (
            <p className="mt-2 rounded-xl bg-sage-50 p-3 text-sm text-sage-900">
              {exercise.easierVariation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
