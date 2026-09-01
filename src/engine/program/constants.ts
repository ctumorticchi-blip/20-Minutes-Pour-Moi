/**
 * Core constants for the training program. These are intentionally generic in
 * naming (session length, weekly windows) even though today only one sport
 * (Move / fitness) consumes them — a future sibling product (running, etc.)
 * would reuse the same shape with its own sport-data package.
 */

export const MAX_SESSION_MINUTES = 20;
export const TRAINING_DAYS_PER_WEEK = 5;
export const PROGRAM_TOTAL_WEEKS = 12;

export const HISTORY_WINDOW_DAYS = 7;
export const RECOVERY_LOOKBACK_DAYS = 3;

/** Rough seconds-per-repetition (controlled tempo) used to estimate a session's total duration. */
export const SECONDS_PER_REPETITION_ESTIMATE = 4;
