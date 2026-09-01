import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppData } from "../../app/providers/AppDataProvider";
import type { DailyEnergy, DailyPainArea, WorkoutDifficultyFeedback } from "../../shared/types";
import { Button } from "../../shared/components/Button";
import { PageContainer } from "../../shared/components/PageContainer";
import { DIFFICULTY_FEEDBACK_LABELS } from "../../sport-data/content/editorial";
import { cn } from "../../shared/utils/cn";

interface CompletionState {
  workoutId: string;
  weekNumber: number;
  dayNumber: number;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  exerciseIds: string[];
  dailyEnergy: DailyEnergy;
  painArea: DailyPainArea;
}

const FEEDBACK_OPTIONS: WorkoutDifficultyFeedback[] = ["too_hard", "just_right", "too_easy"];

export function WorkoutCompletePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addCompletion } = useAppData();
  const [submitted, setSubmitted] = useState(false);

  const state = location.state as CompletionState | null;

  if (!state) {
    return <Navigate to="/today" replace />;
  }

  function handleFeedback(feedback: WorkoutDifficultyFeedback) {
    addCompletion({
      workoutId: state!.workoutId,
      completedAt: new Date().toISOString(),
      weekNumber: state!.weekNumber,
      dayNumber: state!.dayNumber,
      plannedDurationMinutes: state!.plannedDurationMinutes,
      actualDurationMinutes: state!.actualDurationMinutes,
      difficultyFeedback: feedback,
      dailyEnergy: state!.dailyEnergy,
      painArea: state!.painArea,
      exerciseIds: state!.exerciseIds,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <PageContainer className="flex flex-col items-center justify-center text-center">
        <p className="text-4xl">🌿</p>
        <h1 className="mt-4 text-2xl font-semibold text-warmgray-900">Belle séance.</h1>
        <p className="mt-2 text-warmgray-600">
          {state.actualDurationMinutes} minute{state.actualDurationMinutes > 1 ? "s" : ""} rien
          que pour toi. Chaque séance compte.
        </p>
        <div className="mt-8 w-full space-y-3">
          <Button onClick={() => navigate("/progress")}>Voir ma progression</Button>
          <Button variant="secondary" onClick={() => navigate("/today")}>
            Retour à aujourd'hui
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold text-warmgray-900">Comment était cette séance ?</h1>
      <p className="mt-2 text-warmgray-600">Ton ressenti aide à ajuster les prochaines séances.</p>

      <div className="mt-6 space-y-3">
        {FEEDBACK_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleFeedback(option)}
            className={cn(
              "min-h-16 w-full rounded-2xl border-2 border-warmgray-200 bg-white px-4 text-left text-lg font-medium text-warmgray-900",
              "hover:border-sage-400",
            )}
          >
            {DIFFICULTY_FEEDBACK_LABELS[option]}
          </button>
        ))}
      </div>
    </PageContainer>
  );
}
