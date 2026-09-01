import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppData } from "../../app/providers/AppDataProvider";
import { useTrainingContext } from "../../shared/hooks/useTrainingContext";
import { generateWorkout } from "../../engine/workout/generateWorkout";
import { exercisesById } from "../../sport-data/exercises";
import type { WorkoutExercise } from "../../shared/types";
import { Button } from "../../shared/components/Button";
import { cn } from "../../shared/utils/cn";
import { ExerciseCard } from "./components/ExerciseCard";
import { useCountdown } from "./useCountdown";

type Section = "warmup" | "main" | "cooldown";
const SECTION_LABELS: Record<Section, string> = {
  warmup: "Échauffement",
  main: "Séance principale",
  cooldown: "Retour au calme",
};

/** How long the brief "Très bien 🌿" acknowledgment stays visible after moving on. */
const ENCOURAGEMENT_DURATION_MS = 1100;

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
  const [showEncouragement, setShowEncouragement] = useState(false);

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

  useEffect(() => {
    if (!showEncouragement) return;
    const timeout = setTimeout(() => setShowEncouragement(false), ENCOURAGEMENT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [showEncouragement]);

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
    setShowEncouragement(true);
    setIndex((i) => Math.min(i + 1, items.length - 1));
  }

  function goPrevious() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-5 pb-8 pt-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-warmgray-700">
          Exercice {index + 1} sur {items.length}
        </p>
        <button
          type="button"
          onClick={() => navigate("/today")}
          className="text-sm text-warmgray-500 underline underline-offset-2"
        >
          Quitter
        </button>
      </div>

      <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-warmgray-100" aria-hidden="true">
        <div
          className="h-full rounded-full bg-sage-600 transition-all"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <div className="mb-3 flex h-6 items-center" aria-hidden="true">
        <span
          className={cn(
            "rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700 transition-opacity",
            showEncouragement ? "opacity-100" : "opacity-0",
          )}
        >
          Très bien 🌿 — exercice suivant
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-warmgray-400">
        {SECTION_LABELS[current.section]}
      </p>

      <div className="mt-2 flex-1">
        <ExerciseCard
          key={index}
          exercise={currentExercise}
          workoutExercise={current.workoutExercise}
          countdown={isTimed ? countdown : undefined}
          onComplete={goNext}
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
