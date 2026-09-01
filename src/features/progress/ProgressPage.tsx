import { useMemo } from "react";
import { useAppData } from "../../app/providers/AppDataProvider";
import { computeProgressStats } from "../../engine/progress/progressStats";
import { Card } from "../../shared/components/Card";
import { PageContainer } from "../../shared/components/PageContainer";
import { ProgressDots } from "../../shared/components/ProgressDots";
import { CONSISTENCY_MESSAGES } from "../../sport-data/content/editorial";
import { todayIsoDate } from "../../shared/utils/date";

export function ProgressPage() {
  const { programStartDate, completions } = useAppData();

  const stats = useMemo(
    () => computeProgressStats(completions, programStartDate ?? todayIsoDate()),
    [completions, programStartDate],
  );

  const message =
    stats.completedThisWeek >= stats.weeklyGoal
      ? CONSISTENCY_MESSAGES[0]
      : stats.totalCompleted === 0
        ? CONSISTENCY_MESSAGES[2]
        : CONSISTENCY_MESSAGES[1];

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold text-warmgray-900">Progrès</h1>

      <Card className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-warmgray-500">
          Cette semaine
        </p>
        <div className="mt-2">
          <ProgressDots done={stats.completedThisWeek} total={stats.weeklyGoal} />
        </div>
        <p className="mt-3 text-warmgray-600">{message}</p>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm text-warmgray-500">Programme</p>
          <p className="mt-1 text-xl font-semibold text-warmgray-900">
            Semaine {stats.currentWeek} / 12
          </p>
          <p className="mt-1 text-sm text-warmgray-500">{stats.currentPhase.name}</p>
        </Card>
        <Card>
          <p className="text-sm text-warmgray-500">Total</p>
          <p className="mt-1 text-xl font-semibold text-warmgray-900">
            {stats.totalCompleted} séance{stats.totalCompleted > 1 ? "s" : ""}
          </p>
        </Card>
        <Card className="col-span-2">
          <p className="text-sm text-warmgray-500">Régularité</p>
          <p className="mt-1 text-xl font-semibold text-warmgray-900">
            {stats.activeWeeksCount} semaine{stats.activeWeeksCount > 1 ? "s" : ""} active
            {stats.activeWeeksCount > 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-sm text-warmgray-500">
            Meilleure série : {stats.bestActiveWeekStreak} semaine
            {stats.bestActiveWeekStreak > 1 ? "s" : ""} d'affilée
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
