import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppData } from "../../app/providers/AppDataProvider";
import { useTrainingContext } from "../../shared/hooks/useTrainingContext";
import { generateWorkout } from "../../engine/workout/generateWorkout";
import { exercisesById } from "../../sport-data/exercises";
import type { WorkoutExercise } from "../../shared/types";
import { Button } from "../../shared/components/Button";
import { ExerciseCard } from "./components/ExerciseCard";
import { useCountdown } from "./useCountdown";

type Section = "warmup" | "main" | "cooldown";
const SECTION_LABELS: Record<Section, string> = {
  warmup: "Échauffement",
  main: "Séance principale",
  cooldown: "Retour au calme",
};

interface FlatItem {
  section: Section;
  workoutExercise: WorkoutExercise;
}

function flatten(warmup: WorkoutExercise[], main: WorkoutExercise[], cooldown: WorkoutExercise[]): FlatItem[] {
  return [
    ...warmup.map((we) => ({ section: "warmup" as const, workoutExercise: we })),
    ...main.map((we) => ({ section: "main" as const, workoutExercise: we })),
    ...cooldown.map((we) => ({ section: "cooldown" as const, workoutExercise: we })),
  ];
}

export function WorkoutPlayerPage() {
  const { profile, programStartDate, checkIns, completions } = useAppData();
  const navigate = useNavigate();
  const context = useTrainingContext(programStartDate, completions, checkIns);
  // Lazy initializer: runs once on mount, not during every render.
  const [startedAt] = useState(() => Date.now());
  const [index, setIndex] = useState(0);

  const workout = useMemo(() => {
    if (!profile || !context.dayTemplate || !context.todaysCheckIn) return null;
    return generateWorkout({
      dayTemplate: context.dayTemplate,
      weekNumber: context.position.weekNumber,
      phase: context.phase,
      profile,
      energy: context.todaysCheckIn.energy,
      painArea: context.todaysCheckIn.painArea,
      history: context.history,
      bodyAreaLoads: context.bodyAreaLoads,
      availableExercises: context.availableExercises,
      referenceDateIso: context.todayIso,
    });
  }, [profile, context]);

  const items = useMemo(
    () => (workout ? flatten(workout.warmup, workout.main, workout.cooldown) : []),
    [workout],
  );

  const current = items[index];
  const currentExercise = current ? exercisesById[current.workoutExercise.exerciseId] : undefined;

  const countdown = useCountdown(current?.workoutExercise.durationSeconds ?? 0);

  useEffect(() => {
    // Reset scroll position when moving between exercises for a calmer flow.
    window.scrollTo({ top: 0 });
  }, [index]);

  if (!profile || !context.todaysCheckIn) {
    return <Navigate to="/today" replace />;
  }

  if (!workout || items.length === 0 || !current || !currentExercise) {
    return <Navigate to="/today" replace />;
  }

  const isLast = index === items.length - 1;
  const isTimed = current.workoutExercise.durationSeconds !== undefined;

  function goNext() {
    if (isLast) {
      const actualDurationMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
      navigate("/workout/complete", {
        state: {
          workoutId: workout!.id,
          weekNumber: workout!.weekNumber,
          dayNumber: workout!.dayNumber,
          plannedDurationMinutes: workout!.estimatedDurationMinutes,
          actualDurationMinutes,
          exerciseIds: items.map((i) => i.workoutExercise.exerciseId),
          dailyEnergy: context.todaysCheckIn!.energy,
          painArea: context.todaysCheckIn!.painArea,
        },
      });
      return;
    }
    setIndex((i) => Math.min(i + 1, items.length - 1));
  }

  function goPrevious() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-5 pb-8 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-warmgray-400">
          {SECTION_LABELS[current.section]}
        </p>
        <button
          type="button"
          onClick={() => navigate("/today")}
          className="text-sm text-warmgray-500 underline underline-offset-2"
        >
          Quitter
        </button>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-warmgray-100" aria-hidden="true">
        <div
          className="h-full rounded-full bg-sage-600 transition-all"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <div className="flex-1">
        <ExerciseCard
          exercise={currentExercise}
          workoutExercise={current.workoutExercise}
          positionLabel={`${index + 1} / ${items.length}`}
          countdown={
            isTimed
              ? {
                  remainingSeconds: countdown.remainingSeconds,
                  isRunning: countdown.isRunning,
                  pause: countdown.pause,
                  resume: countdown.resume,
                }
              : undefined
          }
        />
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="secondary" onClick={goPrevious} disabled={index === 0} className="w-auto px-6">
          Précédent
        </Button>
        <Button onClick={goNext}>{isLast ? "Terminer la séance" : "Suivant"}</Button>
      </div>
    </div>
  );
}
