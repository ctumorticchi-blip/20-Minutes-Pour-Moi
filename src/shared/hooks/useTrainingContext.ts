import { useMemo } from "react";
import { analyzeTrainingHistory } from "../../engine/history/analyzeTrainingHistory";
import { computeBodyAreaLoads } from "../../engine/recovery/bodyAreaLoad";
import { getPhaseForWeek } from "../../sport-data/programs/phases";
import { getProgramPosition } from "../../engine/program/position";
import { getDayTemplate } from "../../sport-data/programs/weekTemplate";
import { allExercises, exercisesById } from "../../sport-data/exercises";
import type { DailyCheckIn, WorkoutCompletion } from "../types";
import { todayIsoDate } from "../utils/date";

/**
 * Wires together the pure engine functions with today's stored data
 * (program start date, completions, check-ins) so features don't each
 * re-derive the same program position / history / recovery inputs.
 */
export function useTrainingContext(
  programStartDate: string | null,
  completions: WorkoutCompletion[],
  checkIns: DailyCheckIn[],
) {
  return useMemo(() => {
    const todayIso = todayIsoDate();
    const effectiveStartDate = programStartDate ?? todayIso;

    const position = getProgramPosition(effectiveStartDate, todayIso);
    const phase = getPhaseForWeek(position.weekNumber);
    const dayTemplate = position.dayNumber ? getDayTemplate(position.dayNumber) : undefined;

    const history = analyzeTrainingHistory(completions, checkIns, exercisesById, todayIso);
    const bodyAreaLoads = computeBodyAreaLoads(completions, exercisesById, todayIso);
    const todaysCheckIn = checkIns.find((c) => c.date === todayIso) ?? null;

    return {
      todayIso,
      position,
      phase,
      dayTemplate,
      history,
      bodyAreaLoads,
      todaysCheckIn,
      availableExercises: allExercises,
    };
  }, [programStartDate, completions, checkIns]);
}
