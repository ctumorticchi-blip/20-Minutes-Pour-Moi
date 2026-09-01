import { useAppData } from "../../app/providers/AppDataProvider";
import { useTrainingContext } from "../../shared/hooks/useTrainingContext";
import { weekTemplate } from "../../sport-data/programs/weekTemplate";
import { Card } from "../../shared/components/Card";
import { PageContainer } from "../../shared/components/PageContainer";
import { CATEGORY_LABELS } from "../../sport-data/content/editorial";
import { cn } from "../../shared/utils/cn";

const WEEKDAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function ProgramPage() {
  const { programStartDate, completions, checkIns } = useAppData();
  const context = useTrainingContext(programStartDate, completions, checkIns);

  const completedDayNumbers = new Set(
    completions
      .filter((c) => c.weekNumber === context.position.weekNumber)
      .map((c) => c.dayNumber),
  );

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold text-warmgray-900">Mon programme</h1>
      <p className="mt-1 text-warmgray-600">
        Semaine {context.position.weekNumber} / 12 · {context.phase.name}
      </p>

      <div className="mt-6 space-y-3">
        {WEEKDAY_LABELS.map((label, i) => {
          const dayNumber = i + 1;
          const template = weekTemplate.find((d) => d.dayNumber === dayNumber);
          const isToday = context.position.dayNumber === dayNumber;
          const isDone = template ? completedDayNumbers.has(dayNumber) : false;
          const isPast = !isToday && dayNumber < (context.position.dayNumber ?? 8);

          return (
            <Card
              key={label}
              className={cn(
                "flex items-center justify-between",
                isToday && "border-2 border-sage-600",
                !template && "bg-warmgray-50/60 shadow-none",
              )}
            >
              <div>
                <p className="text-sm font-semibold text-warmgray-500">{label}</p>
                <p
                  className={cn(
                    "text-lg font-medium",
                    template ? "text-warmgray-900" : "text-warmgray-500",
                  )}
                >
                  {template ? template.title : "Repos ou marche libre"}
                </p>
                {template && (
                  <p className="mt-0.5 text-xs text-warmgray-400">
                    {template.focus.map((c) => CATEGORY_LABELS[c]).join(" · ")}
                  </p>
                )}
              </div>
              <div className="text-right">
                {isDone ? (
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700">
                    Faite ✓
                  </span>
                ) : isToday ? (
                  <span className="rounded-full bg-terracotta-100 px-3 py-1 text-sm font-medium text-terracotta-700">
                    Aujourd'hui
                  </span>
                ) : template && isPast ? (
                  <span className="text-sm text-warmgray-400">Passée</span>
                ) : template ? (
                  <span className="text-sm text-warmgray-400">À venir</span>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
