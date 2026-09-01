import type { ProgramPhase, WorkoutCompletion } from "../../shared/types";
import { getPhaseForWeek } from "../../sport-data/programs/phases";
import { TRAINING_DAYS_PER_WEEK } from "../program/constants";
import { getProgramPosition } from "../program/position";
import { todayIsoDate } from "../../shared/utils/date";

export interface ProgressStats {
  completedThisWeek: number;
  weeklyGoal: number;
  totalCompleted: number;
  currentWeek: number;
  currentPhase: ProgramPhase;
  /** Longest run of consecutive weeks with at least one completed session. */
  bestActiveWeekStreak: number;
  /** Weeks with at least one completion, out of the weeks elapsed so far. */
  activeWeeksCount: number;
}

function longestConsecutiveStreak(weekNumbers: number[]): number {
  if (weekNumbers.length === 0) return 0;
  const sorted = Array.from(new Set(weekNumbers)).sort((a, b) => a - b);

  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!;
    const curr = sorted[i]!;
    if (curr === prev + 1) {
      current += 1;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
  }
  return longest;
}

export function computeProgressStats(
  completions: WorkoutCompletion[],
  programStartDateIso: string,
  todayIsoDateValue: string = todayIsoDate(),
): ProgressStats {
  const position = getProgramPosition(programStartDateIso, todayIsoDateValue);
  const currentPhase = getPhaseForWeek(position.weekNumber);

  const completedThisWeek = completions.filter(
    (c) => c.weekNumber === position.weekNumber,
  ).length;

  const activeWeeks = Array.from(new Set(completions.map((c) => c.weekNumber)));

  return {
    completedThisWeek,
    weeklyGoal: TRAINING_DAYS_PER_WEEK,
    totalCompleted: completions.length,
    currentWeek: position.weekNumber,
    currentPhase,
    bestActiveWeekStreak: longestConsecutiveStreak(activeWeeks),
    activeWeeksCount: activeWeeks.length,
  };
}
