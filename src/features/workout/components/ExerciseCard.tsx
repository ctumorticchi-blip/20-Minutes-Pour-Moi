import type { MoveExercise, WorkoutExercise } from "../../../shared/types";
import { ExerciseIllustration } from "../../../shared/components/ExerciseIllustration";
import { Button } from "../../../shared/components/Button";
import { CATEGORY_LABELS, PAIN_DURING_SESSION_NOTICE } from "../../../sport-data/content/editorial";
import { formatMinutesSeconds } from "../../../shared/utils/time";
import type { CountdownStatus } from "../useCountdown";
import { HowToAccordion } from "./HowToAccordion";

interface ExerciseCardProps {
  exercise: MoveExercise;
  workoutExercise: WorkoutExercise;
  positionLabel: string;
  countdown?: {
    remainingSeconds: number;
    status: CountdownStatus;
    isDone: boolean;
    start: () => void;
    pause: () => void;
    resume: () => void;
    restart: () => void;
  };
}

function CountdownControl({ countdown }: { countdown: NonNullable<ExerciseCardProps["countdown"]> }) {
  const { remainingSeconds, status, isDone } = countdown;

  return (
    <div className="mt-5 flex flex-col items-center gap-3">
      <p
        className="text-5xl font-semibold tabular-nums text-warmgray-900"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatMinutesSeconds(remainingSeconds)}
      </p>

      {isDone ? (
        <>
          <p className="font-medium text-sage-700">Exercice terminé ✓</p>
          <Button variant="secondary" className="w-auto px-6" onClick={countdown.restart}>
            Recommencer
          </Button>
        </>
      ) : status === "idle" ? (
        <Button className="w-auto px-8" onClick={countdown.start}>
          Démarrer
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="w-auto px-6"
            onClick={status === "running" ? countdown.pause : countdown.resume}
          >
            {status === "running" ? "Pause" : "Reprendre"}
          </Button>
          <Button variant="ghost" className="w-auto px-6" onClick={countdown.restart}>
            Recommencer
          </Button>
        </div>
      )}
    </div>
  );
}

export function ExerciseCard({
  exercise,
  workoutExercise,
  positionLabel,
  countdown,
}: ExerciseCardProps) {
  const mainCue = exercise.instructions[0];
  const essentialTip = exercise.cues?.[0];

  return (
    <div>
      <p className="text-sm font-medium text-warmgray-500">{positionLabel}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-sage-700">
        {CATEGORY_LABELS[exercise.category]}
        {(workoutExercise.sets ?? 1) > 1 && ` · ${workoutExercise.sets} séries`}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-warmgray-900">{exercise.name}</h1>

      <ExerciseIllustration
        illustrationKey={exercise.illustrationKey}
        category={exercise.category}
        className="mt-4"
      />

      {countdown ? (
        <CountdownControl countdown={countdown} />
      ) : (
        <p className="mt-5 text-3xl font-semibold text-warmgray-900">
          {workoutExercise.repetitions} répétitions
        </p>
      )}

      {mainCue && <p className="mt-5 text-warmgray-800">{mainCue}</p>}

      {exercise.breathingCue && (
        <p className="mt-3 text-sm italic text-warmgray-500">{exercise.breathingCue}</p>
      )}

      {essentialTip && <p className="mt-3 text-sm text-warmgray-500">💡 {essentialTip}</p>}

      {exercise.avoidWith && exercise.avoidWith.length > 0 && (
        <p className="mt-3 text-xs text-warmgray-400">{PAIN_DURING_SESSION_NOTICE}</p>
      )}

      <HowToAccordion exercise={exercise} />
    </div>
  );
}
