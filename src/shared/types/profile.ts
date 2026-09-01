export type FitnessLevel = "beginner" | "returning" | "active";

export type Goal =
  | "energy"
  | "strength"
  | "mobility"
  | "balance"
  | "return_to_sport"
  | "general_wellbeing";

export type SensitiveArea = "knees" | "back" | "hips" | "shoulders" | "ankles";

export type Equipment = "chair" | "mat" | "resistance_band" | "light_dumbbells";

export interface UserProfile {
  firstName: string;
  age: number;
  fitnessLevel: FitnessLevel;
  goals: Goal[];
  sensitiveAreas: SensitiveArea[];
  equipment: Equipment[];
  onboardingCompleted: boolean;
}
