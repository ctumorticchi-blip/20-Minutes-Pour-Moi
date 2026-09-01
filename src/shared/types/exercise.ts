import type { Equipment, SensitiveArea } from "./profile";

export type ExerciseCategory =
  | "strength"
  | "cardio"
  | "mobility"
  | "pilates"
  | "balance";

export type ExercisePosition = "standing" | "seated" | "floor" | "supported";

/** 1 = gentle, 2 = moderate, 3 = more demanding (still low-impact / senior-appropriate). */
export type ExerciseIntensity = 1 | 2 | 3;

export type BodyArea =
  | "legs"
  | "glutes"
  | "calves"
  | "back"
  | "chest"
  | "shoulders"
  | "arms"
  | "core"
  | "hips"
  | "full_body";

/**
 * How often an exercise can reasonably reappear without feeling repetitive
 * or overloading the same structures.
 * - daily: fine to repeat every session (breathing, gentle warmups)
 * - frequent: can repeat often, short cooldown between repeats is enough
 * - normal: default, the engine tries to space it out over a few days
 * - recovery_sensitive: avoid repeating on consecutive days
 */
export type Repeatability = "daily" | "frequent" | "normal" | "recovery_sensitive";

export interface MoveExercise {
  id: string;
  name: string;
  category: ExerciseCategory;

  description: string;

  /** Where and how to set up before starting, e.g. "Debout derrière une chaise, pieds écartés..." */
  startingPosition: string;
  /** The movement itself, broken into clear, ordered steps. */
  instructions: string[];

  durationSeconds?: number;
  repetitions?: number;

  position: ExercisePosition;

  requiredEquipment: Equipment[];

  difficulty: ExerciseIntensity;

  lowImpact: boolean;

  avoidWith?: SensitiveArea[];

  easierVariation?: string;
  harderVariation?: string;

  /** Key used to look up a (future) illustration asset. Always present, even as a placeholder. */
  illustrationKey: string;

  primaryBenefits: string[];

  /** 1-3 short "points d'attention" (form cues / safety reminders shown in the how-to). */
  cues?: string[];

  /** How to breathe through the movement, e.g. "Expire en montant. Inspire en redescendant." */
  breathingCue?: string;

  bodyAreas: BodyArea[];

  repeatability: Repeatability;
}
