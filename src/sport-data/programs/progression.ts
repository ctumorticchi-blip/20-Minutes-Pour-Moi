import type { ProgramPhase } from "../../shared/types";

/**
 * Conservative, phase-based progression guidelines. These are deliberately
 * modest constants (not per-exercise tuning) so the whole program stays
 * predictable and easy to reason about.
 */
export interface PhaseProgression {
  /** Typical repetition count for rep-based exercises in this phase. */
  repetitions: number;
  /** Typical hold/work duration (seconds) for timed exercises in this phase. */
  durationSeconds: number;
  /** Sets for main-slot strength/balance work. Warmup and cooldown always use 1 set. */
  mainSets: number;
  restSeconds: number;
}

const PROGRESSION_BY_PHASE_ID: Record<string, PhaseProgression> = {
  "phase-1": { repetitions: 7, durationSeconds: 25, mainSets: 1, restSeconds: 25 },
  "phase-2": { repetitions: 9, durationSeconds: 30, mainSets: 1, restSeconds: 22 },
  "phase-3": { repetitions: 11, durationSeconds: 35, mainSets: 2, restSeconds: 20 },
  "phase-4": { repetitions: 13, durationSeconds: 40, mainSets: 2, restSeconds: 18 },
};

const FALLBACK_PROGRESSION: PhaseProgression = PROGRESSION_BY_PHASE_ID["phase-1"]!;

export function getProgressionForPhase(phase: ProgramPhase): PhaseProgression {
  return PROGRESSION_BY_PHASE_ID[phase.id] ?? FALLBACK_PROGRESSION;
}
