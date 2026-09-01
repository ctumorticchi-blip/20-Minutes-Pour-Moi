/**
 * Structure for future light functional check-ins (not a medical diagnostic tool).
 * The M0 only defines the shape and a placeholder screen; no scoring logic yet.
 */
export type FunctionalCheckType =
  | "sit_to_stand"
  | "assisted_balance"
  | "shoulder_mobility"
  | "perceived_energy";

export interface FunctionalCheckResult {
  type: FunctionalCheckType;
  recordedAt: string;
  /** Free-form value: repetitions, seconds held, or a 1-5 self-rating depending on `type`. */
  value: number;
  note?: string;
}
