/**
 * All user-facing copy that reflects the product's editorial tone lives here,
 * kept apart from layout so the voice stays consistent and easy to review.
 * Warm, adult, never guilt-inducing — see docs/PRODUCT.md.
 */

export const HEALTH_DISCLAIMER =
  "Ce programme propose des activités générales de remise en forme et ne remplace pas l'avis d'un professionnel de santé. En cas de problème médical, de douleur importante ou de doute sur votre capacité à pratiquer une activité physique, demandez conseil à un professionnel de santé.";

export const PAIN_DURING_SESSION_NOTICE =
  "En cas de douleur importante, inhabituelle ou persistante, arrête l'exercice concerné et demande conseil à un professionnel de santé.";

export function recurringPainNotice(): string {
  return "Cette zone semble encore sensible. Aujourd'hui, nous allons éviter de trop la solliciter.";
}

export function greeting(firstName: string): string {
  return `Bonjour ${firstName} 🌿`;
}

export const RESUME_AFTER_BREAK_MESSAGE = "On reprend tranquillement aujourd'hui.";

export const REST_DAY_MESSAGE =
  "Aujourd'hui c'est repos, ou une marche libre si tu en as envie. Chaque séance compte, le repos aussi.";

export const NO_SESSION_YET_MESSAGE = "Prenons quelques minutes pour bouger, à ton rythme.";

export const WEEKLY_GOAL_LABEL = (done: number, goal: number): string =>
  `${done} / ${goal} séances cette semaine`;

export const CONSISTENCY_MESSAGES = [
  "Belle régularité cette semaine.",
  "Chaque séance compte.",
  "Tu prends soin de toi, un jour à la fois.",
] as const;

export const START_SESSION_CTA = "Commencer ma séance";
export const CREATE_PROGRAM_CTA = "Créer mon programme";

export const ENERGY_LABELS: Record<"tired" | "good" | "energetic", string> = {
  tired: "😴 Fatiguée",
  good: "🙂 Bien",
  energetic: "⚡ En forme",
};

export const DIFFICULTY_FEEDBACK_LABELS: Record<
  "too_hard" | "just_right" | "too_easy",
  string
> = {
  too_hard: "😣 Difficile",
  just_right: "🙂 Parfaite",
  too_easy: "😄 Facile",
};

export const CATEGORY_LABELS: Record<
  "strength" | "cardio" | "mobility" | "pilates" | "balance",
  string
> = {
  strength: "Renforcement",
  cardio: "Cardio doux",
  mobility: "Mobilité",
  pilates: "Pilates",
  balance: "Équilibre",
};

export const PAIN_AREA_LABELS: Record<
  "none" | "knees" | "back" | "hips" | "shoulders" | "ankles" | "other",
  string
> = {
  none: "Aucune",
  knees: "Genoux",
  back: "Dos",
  hips: "Hanches",
  shoulders: "Épaules",
  ankles: "Chevilles",
  other: "Autre",
};
