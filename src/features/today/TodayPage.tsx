import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../app/providers/AppDataProvider";
import { useTrainingContext } from "../../shared/hooks/useTrainingContext";
import { generateWorkout } from "../../engine/workout/generateWorkout";
import { isRecurringPainArea } from "../../engine/adaptation/painGuidance";
import { TRAINING_DAYS_PER_WEEK } from "../../engine/program/constants";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { PageContainer } from "../../shared/components/PageContainer";
import { ProgressDots } from "../../shared/components/ProgressDots";
import {
  CATEGORY_LABELS,
  NO_SESSION_YET_MESSAGE,
  REST_DAY_MESSAGE,
  RESUME_AFTER_BREAK_MESSAGE,
  START_SESSION_CTA,
  WEEKLY_GOAL_LABEL,
  greeting,
  recurringPainNotice,
} from "../../sport-data/content/editorial";
import type { DailyEnergy, DailyPainArea } from "../../shared/types";
import { EnergyPicker } from "./components/EnergyPicker";
import { PainPicker } from "./components/PainPicker";

export function TodayPage() {
  const { profile, programStartDate, checkIns, completions, upsertCheckIn } = useAppData();
  const navigate = useNavigate();
  const context = useTrainingContext(programStartDate, completions, checkIns);

  const [energy, setEnergy] = useState<DailyEnergy | null>(context.todaysCheckIn?.energy ?? null);
  const [painArea, setPainArea] = useState<DailyPainArea | null>(
    context.todaysCheckIn?.painArea ?? null,
  );

  const completedThisWeek = completions.filter(
    (c) => c.weekNumber === context.position.weekNumber,
  ).length;

  const preview = useMemo(() => {
    if (!context.dayTemplate || !profile) return null;
    return generateWorkout({
      dayTemplate: context.dayTemplate,
      weekNumber: context.position.weekNumber,
      phase: context.phase,
      profile,
      energy: energy ?? "good",
      painArea: painArea ?? "none",
      history: context.history,
      bodyAreaLoads: context.bodyAreaLoads,
      availableExercises: context.availableExercises,
      referenceDateIso: context.todayIso,
    });
  }, [context, profile, energy, painArea]);

  if (!profile) return null;

  const canStart = energy !== null && painArea !== null;
  const showResumeMessage = (context.history.daysSinceLastWorkout ?? 0) > 7;
  const showPainNotice = painArea && painArea !== "none" && isRecurringPainArea(context.history, painArea);

  function handleStart() {
    if (!energy || !painArea) return;
    upsertCheckIn({ date: context.todayIso, energy, painArea });
    navigate("/workout");
  }

  return (
    <PageContainer>
      <p className="text-2xl font-semibold text-warmgray-900">{greeting(profile.firstName)}</p>

      {context.position.isRestDay ? (
        <Card className="mt-6">
          <p className="text-lg font-medium text-warmgray-900">
            Semaine {context.position.weekNumber} · Repos
          </p>
          <p className="mt-3 text-warmgray-600">{REST_DAY_MESSAGE}</p>
        </Card>
      ) : (
        <>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-sage-700">
            Semaine {context.position.weekNumber} · Jour {context.position.dayNumber}
          </p>
          <p className="text-warmgray-500">{context.phase.name}</p>

          {showResumeMessage && (
            <p className="mt-3 text-sm text-terracotta-700">{RESUME_AFTER_BREAK_MESSAGE}</p>
          )}

          <Card className="mt-5 border-sage-100 bg-sage-50/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">
              Aujourd'hui
              {context.dayTemplate && ` · ${CATEGORY_LABELS[context.dayTemplate.focus[0]]}`}
            </p>
            <p className="mt-1 text-xl font-semibold text-warmgray-900">
              {context.dayTemplate?.title ?? NO_SESSION_YET_MESSAGE}
            </p>
            <p className="mt-1 text-warmgray-600">
              {preview ? `${preview.estimatedDurationMinutes} min` : "—"} · Niveau doux
            </p>
          </Card>

          <div className="mt-6">
            <h2 className="text-base font-semibold text-warmgray-900">Comment te sens-tu ?</h2>
            <div className="mt-3">
              <EnergyPicker value={energy} onChange={setEnergy} />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-base font-semibold text-warmgray-900">
              Une zone douloureuse aujourd'hui ?
            </h2>
            <div className="mt-3">
              <PainPicker value={painArea} onChange={setPainArea} />
            </div>
            {showPainNotice && (
              <p className="mt-2 text-sm text-terracotta-700">{recurringPainNotice()}</p>
            )}
          </div>

          <div className="mt-8">
            <Button onClick={handleStart} disabled={!canStart}>
              {START_SESSION_CTA}
            </Button>
          </div>
        </>
      )}

      <p className="mt-6 text-sm text-warmgray-500">
        {WEEKLY_GOAL_LABEL(completedThisWeek, TRAINING_DAYS_PER_WEEK)}
      </p>
      <div className="mt-2">
        <ProgressDots done={completedThisWeek} total={TRAINING_DAYS_PER_WEEK} />
      </div>
    </PageContainer>
  );
}
