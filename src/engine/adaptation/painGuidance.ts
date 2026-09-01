import type { DailyPainArea, TrainingHistorySummary } from "../../shared/types";

const REPEATED_PAIN_THRESHOLD = 2;

/**
 * True when today's reported pain area has also shown up repeatedly in the
 * last 7 days, which is the signal for showing a gentle, non-diagnostic
 * "we'll go easy on this area today" notice.
 */
export function isRecurringPainArea(
  history: TrainingHistorySummary,
  painArea: DailyPainArea,
): boolean {
  if (painArea === "none") return false;
  const occurrences = history.recentPainAreas.filter((area) => area === painArea).length;
  return occurrences >= REPEATED_PAIN_THRESHOLD;
}
