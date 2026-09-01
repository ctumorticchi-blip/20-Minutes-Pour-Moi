import type {
  BodyArea,
  BodyAreaLoad,
  MoveExercise,
  WorkoutCompletion,
} from "../../shared/types";
import { diffInDays, todayIsoDate } from "../../shared/utils/date";
import { HISTORY_WINDOW_DAYS } from "../program/constants";

const ALL_BODY_AREAS: BodyArea[] = [
  "legs",
  "glutes",
  "calves",
  "back",
  "chest",
  "shoulders",
  "arms",
  "core",
  "hips",
  "full_body",
];

/**
 * A simple, deterministic recency weight: yesterday counts most, the rest of
 * the last week counts a little, anything older doesn't count. This is only
 * used to sequence the program sensibly — never shown to the user as a
 * physiological or medical measurement.
 */
function recencyWeight(daysAgo: number): number {
  if (daysAgo <= 0) return 0;
  if (daysAgo === 1) return 3;
  if (daysAgo <= 3) return 2;
  if (daysAgo <= HISTORY_WINDOW_DAYS) return 1;
  return 0;
}

/** Pure, deterministic estimate of how much each body area has been worked recently. */
export function computeBodyAreaLoads(
  completions: WorkoutCompletion[],
  exercisesById: Record<string, MoveExercise>,
  referenceDateIso: string = todayIsoDate(),
): BodyAreaLoad[] {
  const load = new Map<BodyArea, number>();
  const lastTrainedAt = new Map<BodyArea, string>();

  for (const completion of completions) {
    const date = completion.completedAt.slice(0, 10);
    const daysAgo = diffInDays(date, referenceDateIso);
    const weight = recencyWeight(daysAgo);
    if (weight === 0) continue;

    for (const exerciseId of completion.exerciseIds) {
      const exercise = exercisesById[exerciseId];
      if (!exercise) continue;
      for (const area of exercise.bodyAreas) {
        load.set(area, (load.get(area) ?? 0) + weight * exercise.difficulty);
        const previous = lastTrainedAt.get(area);
        if (!previous || date > previous) {
          lastTrainedAt.set(area, date);
        }
      }
    }
  }

  return ALL_BODY_AREAS.map((bodyArea) => ({
    bodyArea,
    recentLoad: load.get(bodyArea) ?? 0,
    lastTrainedAt: lastTrainedAt.get(bodyArea),
  }));
}

export function getLoadForArea(loads: BodyAreaLoad[], area: BodyArea): number {
  return loads.find((l) => l.bodyArea === area)?.recentLoad ?? 0;
}

/** A body area is considered "still loaded" above this recentLoad score. */
export const RECOVERY_LOAD_THRESHOLD = 3;

export function isBodyAreaStillRecovering(loads: BodyAreaLoad[], area: BodyArea): boolean {
  return getLoadForArea(loads, area) >= RECOVERY_LOAD_THRESHOLD;
}
