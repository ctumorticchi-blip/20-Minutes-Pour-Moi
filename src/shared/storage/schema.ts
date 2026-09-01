import type {
  DailyCheckIn,
  FunctionalCheckResult,
  UserProfile,
  WorkoutCompletion,
} from "../types";

export const CURRENT_SCHEMA_VERSION = 1;

export interface AppPreferences {
  /** Reserved for future settings (units, reminders, etc.). Empty in M0. */
  hasSeenIntro: boolean;
}

export interface AppStorageSchema {
  schemaVersion: number;
  profile: UserProfile | null;
  /** ISO date the user's 12-week program started (set when onboarding completes). */
  programStartDate: string | null;
  checkIns: DailyCheckIn[];
  completions: WorkoutCompletion[];
  functionalChecks: FunctionalCheckResult[];
  preferences: AppPreferences;
}

export function createEmptySchema(): AppStorageSchema {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profile: null,
    programStartDate: null,
    checkIns: [],
    completions: [],
    functionalChecks: [],
    preferences: { hasSeenIntro: false },
  };
}

/**
 * Upgrades older persisted payloads to the current shape. For M0 there is only
 * version 1, so this just fills in any missing fields defensively.
 */
export function migrateSchema(data: unknown): AppStorageSchema {
  const empty = createEmptySchema();
  if (typeof data !== "object" || data === null) return empty;
  const partial = data as Partial<AppStorageSchema>;
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profile: partial.profile ?? empty.profile,
    programStartDate: partial.programStartDate ?? empty.programStartDate,
    checkIns: partial.checkIns ?? empty.checkIns,
    completions: partial.completions ?? empty.completions,
    functionalChecks: partial.functionalChecks ?? empty.functionalChecks,
    preferences: { ...empty.preferences, ...partial.preferences },
  };
}
