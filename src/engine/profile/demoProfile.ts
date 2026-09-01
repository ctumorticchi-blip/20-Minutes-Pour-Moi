import type { UserProfile } from "../../shared/types";

/** Marie: the primary M0 persona, loadable in one tap from onboarding. */
export const demoProfile: UserProfile = {
  firstName: "Marie",
  age: 68,
  fitnessLevel: "returning",
  goals: ["energy", "strength", "mobility", "balance"],
  sensitiveAreas: [],
  equipment: ["chair", "mat"],
  onboardingCompleted: true,
};
