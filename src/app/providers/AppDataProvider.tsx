import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DailyCheckIn, UserProfile, WorkoutCompletion } from "../../shared/types";
import { storage } from "../../shared/storage/storage";
import type { AppStorageSchema } from "../../shared/storage/schema";
import { todayIsoDate } from "../../shared/utils/date";

interface AppDataContextValue {
  profile: UserProfile | null;
  programStartDate: string | null;
  checkIns: DailyCheckIn[];
  completions: WorkoutCompletion[];
  saveProfile: (profile: UserProfile) => void;
  upsertCheckIn: (checkIn: DailyCheckIn) => void;
  addCompletion: (completion: WorkoutCompletion) => void;
  resetAll: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

/**
 * Single source of truth for persisted app state. Every mutation goes
 * through the `shared/storage` abstraction first, then refreshes this
 * React state — so the UI is always a live mirror of localStorage and
 * features never touch storage directly.
 */
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppStorageSchema>(() => storage.getAll());

  const saveProfile = useCallback((profile: UserProfile) => {
    storage.saveProfile(profile);
    if (profile.onboardingCompleted && !storage.getProgramStartDate()) {
      storage.setProgramStartDate(todayIsoDate());
    }
    setData(storage.getAll());
  }, []);

  const upsertCheckIn = useCallback((checkIn: DailyCheckIn) => {
    storage.upsertCheckIn(checkIn);
    setData(storage.getAll());
  }, []);

  const addCompletion = useCallback((completion: WorkoutCompletion) => {
    storage.addCompletion(completion);
    setData(storage.getAll());
  }, []);

  const resetAll = useCallback(() => {
    storage.clearAll();
    setData(storage.getAll());
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      profile: data.profile,
      programStartDate: data.programStartDate,
      checkIns: data.checkIns,
      completions: data.completions,
      saveProfile,
      upsertCheckIn,
      addCompletion,
      resetAll,
    }),
    [data, saveProfile, upsertCheckIn, addCompletion, resetAll],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
