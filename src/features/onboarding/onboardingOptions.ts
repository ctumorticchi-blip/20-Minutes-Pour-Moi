import type { Equipment, FitnessLevel, Goal, SensitiveArea } from "../../shared/types";

export const FITNESS_LEVEL_OPTIONS: { value: FitnessLevel; label: string; description: string }[] = [
  { value: "beginner", label: "Je débute", description: "Le sport n'a jamais été une habitude." },
  {
    value: "returning",
    label: "Je reprends",
    description: "J'ai fait une pause et je m'y remets doucement.",
  },
  { value: "active", label: "Je suis déjà active", description: "Je bouge déjà régulièrement." },
];

export const GOAL_OPTIONS: { value: Goal; label: string; icon: string }[] = [
  { value: "energy", label: "Retrouver de l'énergie", icon: "⚡" },
  { value: "strength", label: "Être plus forte", icon: "💪" },
  { value: "mobility", label: "Être plus souple", icon: "🤸" },
  { value: "balance", label: "Améliorer mon équilibre", icon: "🧘" },
  { value: "return_to_sport", label: "Me remettre au sport", icon: "🌿" },
  { value: "general_wellbeing", label: "Me sentir mieux", icon: "🙂" },
];

export const SENSITIVE_AREA_OPTIONS: { value: SensitiveArea; label: string }[] = [
  { value: "knees", label: "Genoux" },
  { value: "back", label: "Dos" },
  { value: "hips", label: "Hanches" },
  { value: "shoulders", label: "Épaules" },
  { value: "ankles", label: "Chevilles" },
];

export const EQUIPMENT_OPTIONS: { value: Equipment; label: string; icon: string }[] = [
  { value: "chair", label: "Une chaise", icon: "🪑" },
  { value: "mat", label: "Un tapis", icon: "🧘" },
  { value: "resistance_band", label: "Un élastique", icon: "➰" },
  { value: "light_dumbbells", label: "De petits poids", icon: "🏋️" },
];
