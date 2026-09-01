import type {
  BodyAreaLoad,
  DailyPainArea,
  MoveExercise,
  ProgramPhase,
  SensitiveArea,
  TrainingHistorySummary,
  UserProfile,
} from "../../shared/types";
import type { DayTemplate, MainSlot } from "../../sport-data/programs/weekTemplate";
import { diffInDays, todayIsoDate } from "../../shared/utils/date";
import { isBodyAreaStillRecovering } from "../recovery/bodyAreaLoad";

export interface WorkoutSelection {
  warmupIds: string[];
  mainIds: string[];
  cooldownIds: string[];
}

export interface SelectExercisesInput {
  dayTemplate: DayTemplate;
  profile: UserProfile;
  painArea: DailyPainArea;
  phase: ProgramPhase;
  history: TrainingHistorySummary;
  bodyAreaLoads: BodyAreaLoad[];
  availableExercises: MoveExercise[];
  referenceDateIso?: string;
}

const KNOWN_SENSITIVE_AREAS: SensitiveArea[] = ["knees", "back", "hips", "shoulders", "ankles"];

function isSensitiveArea(value: DailyPainArea): value is SensitiveArea {
  return (KNOWN_SENSITIVE_AREAS as string[]).includes(value);
}

export function hasRequiredEquipment(exercise: MoveExercise, profile: UserProfile): boolean {
  return exercise.requiredEquipment.every((eq) => profile.equipment.includes(eq));
}

export function isSafeForToday(
  exercise: MoveExercise,
  profile: UserProfile,
  painArea: DailyPainArea,
): boolean {
  if (!exercise.avoidWith || exercise.avoidWith.length === 0) return true;
  if (isSensitiveArea(painArea) && exercise.avoidWith.includes(painArea)) return false;
  return !exercise.avoidWith.some((area) => profile.sensitiveAreas.includes(area));
}

/**
 * Lower is better. Combines recovery load, immediate repetition, and general
 * recent variety into one deterministic score so selection never needs
 * randomness — same inputs always rank candidates the same way.
 */
function scoreCandidate(
  exercise: MoveExercise,
  history: TrainingHistorySummary,
  bodyAreaLoads: BodyAreaLoad[],
  referenceDateIso: string,
): number {
  let score = 0;

  const wasYesterday = history.previousDayExerciseIds.includes(exercise.id);
  if (wasYesterday) {
    if (exercise.repeatability === "recovery_sensitive") score += 20;
    else if (exercise.repeatability === "normal") score += 8;
    else if (exercise.repeatability === "frequent") score += 2;
    // "daily" exercises get no penalty for repeating.
  }

  const lastDate = history.lastPerformedByExercise[exercise.id];
  if (lastDate && exercise.repeatability !== "daily") {
    const daysAgo = diffInDays(lastDate, referenceDateIso);
    score += Math.max(0, 5 - daysAgo);
  }

  for (const area of exercise.bodyAreas) {
    if (isBodyAreaStillRecovering(bodyAreaLoads, area)) {
      score += 4;
    }
  }

  return score;
}

function rankCandidates(
  candidates: MoveExercise[],
  history: TrainingHistorySummary,
  bodyAreaLoads: BodyAreaLoad[],
  referenceDateIso: string,
): MoveExercise[] {
  return candidates
    .map((exercise) => ({
      exercise,
      score: scoreCandidate(exercise, history, bodyAreaLoads, referenceDateIso),
    }))
    .sort((a, b) => a.score - b.score || a.exercise.id.localeCompare(b.exercise.id))
    .map((entry) => entry.exercise);
}

function pickForCategory(
  category: MoveExercise["category"],
  count: number,
  pool: MoveExercise[],
  alreadyChosen: Set<string>,
  history: TrainingHistorySummary,
  bodyAreaLoads: BodyAreaLoad[],
  referenceDateIso: string,
): string[] {
  const candidates = pool.filter(
    (exercise) => exercise.category === category && !alreadyChosen.has(exercise.id),
  );
  const ranked = rankCandidates(candidates, history, bodyAreaLoads, referenceDateIso);
  const picked = ranked.slice(0, count).map((exercise) => exercise.id);
  for (const id of picked) alreadyChosen.add(id);
  return picked;
}

function pickFromCategories(
  categories: MoveExercise["category"][],
  count: number,
  pool: MoveExercise[],
  alreadyChosen: Set<string>,
  history: TrainingHistorySummary,
  bodyAreaLoads: BodyAreaLoad[],
  referenceDateIso: string,
): string[] {
  const candidates = pool.filter(
    (exercise) => categories.includes(exercise.category) && !alreadyChosen.has(exercise.id),
  );
  const ranked = rankCandidates(candidates, history, bodyAreaLoads, referenceDateIso);
  const picked = ranked.slice(0, count).map((exercise) => exercise.id);
  for (const id of picked) alreadyChosen.add(id);
  return picked;
}

/**
 * Chooses which exercises fill a day's warmup / main / cooldown slots.
 * Deterministic by construction: given the same catalog, profile, phase,
 * pain, and history, it always returns the same selection.
 */
export function selectExercisesForWorkout(input: SelectExercisesInput): WorkoutSelection {
  const {
    dayTemplate,
    profile,
    painArea,
    phase,
    history,
    bodyAreaLoads,
    availableExercises,
    referenceDateIso = todayIsoDate(),
  } = input;

  const safePool = availableExercises.filter(
    (exercise) =>
      hasRequiredEquipment(exercise, profile) &&
      isSafeForToday(exercise, profile, painArea) &&
      exercise.difficulty <= phase.difficultyCap,
  );

  const alreadyChosen = new Set<string>();

  const warmupIds = pickFromCategories(
    dayTemplate.warmupCategories,
    dayTemplate.warmupCount,
    safePool,
    alreadyChosen,
    history,
    bodyAreaLoads,
    referenceDateIso,
  );

  const mainIds = dayTemplate.mainSlots.flatMap((slot: MainSlot) =>
    pickForCategory(
      slot.category,
      slot.count,
      safePool,
      alreadyChosen,
      history,
      bodyAreaLoads,
      referenceDateIso,
    ),
  );

  const cooldownIds = pickFromCategories(
    dayTemplate.cooldownCategories,
    dayTemplate.cooldownCount,
    safePool,
    alreadyChosen,
    history,
    bodyAreaLoads,
    referenceDateIso,
  );

  return { warmupIds, mainIds, cooldownIds };
}
