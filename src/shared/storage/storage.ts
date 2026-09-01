import type {
  DailyCheckIn,
  FunctionalCheckResult,
  UserProfile,
  WorkoutCompletion,
} from "../types";
import { STORAGE_ROOT_KEY } from "./keys";
import {
  type AppPreferences,
  type AppStorageSchema,
  createEmptySchema,
  migrateSchema,
} from "./schema";

/**
 * Thin, testable abstraction over localStorage. Nothing outside this file
 * should call `localStorage` directly.
 */

function hasLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function readSchema(): AppStorageSchema {
  if (!hasLocalStorage()) return createEmptySchema();
  try {
    const raw = window.localStorage.getItem(STORAGE_ROOT_KEY);
    if (!raw) return createEmptySchema();
    return migrateSchema(JSON.parse(raw));
  } catch {
    return createEmptySchema();
  }
}

function writeSchema(schema: AppStorageSchema): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_ROOT_KEY, JSON.stringify(schema));
  } catch {
    // Storage can fail (quota, private mode). Silently no-op: the app
    // still works in-memory for the current session.
  }
}

function update(mutate: (schema: AppStorageSchema) => AppStorageSchema): void {
  writeSchema(mutate(readSchema()));
}

export const storage = {
  getAll(): AppStorageSchema {
    return readSchema();
  },

  getProfile(): UserProfile | null {
    return readSchema().profile;
  },

  saveProfile(profile: UserProfile): void {
    update((schema) => ({ ...schema, profile }));
  },

  getProgramStartDate(): string | null {
    return readSchema().programStartDate;
  },

  setProgramStartDate(isoDate: string): void {
    update((schema) => ({ ...schema, programStartDate: isoDate }));
  },

  getCheckIns(): DailyCheckIn[] {
    return readSchema().checkIns;
  },

  /** Stores or replaces the check-in for its date (one per calendar day). */
  upsertCheckIn(checkIn: DailyCheckIn): void {
    update((schema) => ({
      ...schema,
      checkIns: [
        ...schema.checkIns.filter((c) => c.date !== checkIn.date),
        checkIn,
      ],
    }));
  },

  getCheckInForDate(isoDate: string): DailyCheckIn | null {
    return readSchema().checkIns.find((c) => c.date === isoDate) ?? null;
  },

  getCompletions(): WorkoutCompletion[] {
    return readSchema().completions;
  },

  addCompletion(completion: WorkoutCompletion): void {
    update((schema) => ({
      ...schema,
      completions: [...schema.completions, completion],
    }));
  },

  getFunctionalChecks(): FunctionalCheckResult[] {
    return readSchema().functionalChecks;
  },

  addFunctionalCheck(result: FunctionalCheckResult): void {
    update((schema) => ({
      ...schema,
      functionalChecks: [...schema.functionalChecks, result],
    }));
  },

  getPreferences(): AppPreferences {
    return readSchema().preferences;
  },

  savePreferences(preferences: Partial<AppPreferences>): void {
    update((schema) => ({
      ...schema,
      preferences: { ...schema.preferences, ...preferences },
    }));
  },

  /** Clears all locally stored progress. Used only from the profile screen, behind confirmation. */
  clearAll(): void {
    writeSchema(createEmptySchema());
  },
};
