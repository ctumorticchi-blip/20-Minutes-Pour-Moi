import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAppData } from "./providers/AppDataProvider";
import { BottomNav } from "../shared/components/BottomNav";
import { OnboardingPage } from "../features/onboarding/OnboardingPage";
import { TodayPage } from "../features/today/TodayPage";
import { WorkoutPlayerPage } from "../features/workout/WorkoutPlayerPage";
import { WorkoutCompletePage } from "../features/feedback/WorkoutCompletePage";
import { ProgramPage } from "../features/program/ProgramPage";
import { ProgressPage } from "../features/progress/ProgressPage";
import { ProfilePage } from "../features/profile/ProfilePage";

function TabsLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}

/** Sends the user to onboarding until a profile exists, keeping the tab pages behind it. */
function RequireProfile() {
  const { profile } = useAppData();
  if (!profile || !profile.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}

function HomeRedirect() {
  const { profile } = useAppData();
  return <Navigate to={profile?.onboardingCompleted ? "/today" : "/onboarding"} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route element={<RequireProfile />}>
        <Route path="/workout" element={<WorkoutPlayerPage />} />
        <Route path="/workout/complete" element={<WorkoutCompletePage />} />

        <Route element={<TabsLayout />}>
          <Route path="/today" element={<TodayPage />} />
          <Route path="/program" element={<ProgramPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
