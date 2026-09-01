import type { ProgramPosition } from "../../shared/types";
import { diffInDays, isoWeekday, parseIsoDate } from "../../shared/utils/date";
import { TRAINING_DAYS_PER_WEEK } from "./constants";

/**
 * Pure function: derives where the user sits in the program purely from the
 * program's start date and "today", so it is trivially testable and never
 * depends on stored session state.
 */
export function getProgramPosition(
  programStartDateIso: string,
  todayIso: string,
): ProgramPosition {
  const daysSinceStart = Math.max(diffInDays(programStartDateIso, todayIso), 0);
  const weekNumber = Math.floor(daysSinceStart / 7) + 1;

  const weekday = isoWeekday(parseIsoDate(todayIso));
  const isRestDay = weekday > TRAINING_DAYS_PER_WEEK;

  return {
    weekNumber,
    isoWeekday: weekday,
    dayNumber: isRestDay ? null : weekday,
    isRestDay,
  };
}
