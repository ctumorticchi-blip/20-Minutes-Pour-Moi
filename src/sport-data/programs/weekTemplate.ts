import type { ExerciseCategory } from "../../shared/types";

export interface MainSlot {
  category: ExerciseCategory;
  count: number;
}

export interface DayTemplate {
  dayNumber: number;
  title: string;
  focus: ExerciseCategory[];
  warmupCategories: ExerciseCategory[];
  warmupCount: number;
  mainSlots: MainSlot[];
  cooldownCategories: ExerciseCategory[];
  cooldownCount: number;
}

/**
 * The five weekly training days. Balance work is woven into every day
 * (not just the dedicated day 1), per the product's "transversal" balance
 * principle. Weekends are rest days and have no template.
 */
export const weekTemplate: DayTemplate[] = [
  {
    dayNumber: 1,
    title: "Renforcement & équilibre",
    focus: ["strength", "balance"],
    warmupCategories: ["mobility", "cardio"],
    warmupCount: 2,
    mainSlots: [
      { category: "strength", count: 4 },
      { category: "balance", count: 2 },
    ],
    cooldownCategories: ["mobility"],
    cooldownCount: 2,
  },
  {
    dayNumber: 2,
    title: "Mobilité & Pilates",
    focus: ["mobility", "pilates"],
    warmupCategories: ["mobility"],
    warmupCount: 2,
    mainSlots: [
      { category: "mobility", count: 2 },
      { category: "pilates", count: 3 },
      { category: "balance", count: 1 },
    ],
    cooldownCategories: ["pilates", "mobility"],
    cooldownCount: 2,
  },
  {
    dayNumber: 3,
    title: "Cardio doux",
    focus: ["cardio"],
    warmupCategories: ["mobility"],
    warmupCount: 2,
    mainSlots: [
      { category: "cardio", count: 5 },
      { category: "balance", count: 1 },
    ],
    cooldownCategories: ["mobility"],
    cooldownCount: 2,
  },
  {
    dayNumber: 4,
    title: "Renforcement & posture",
    focus: ["strength", "mobility"],
    warmupCategories: ["mobility", "cardio"],
    warmupCount: 2,
    mainSlots: [
      { category: "strength", count: 4 },
      { category: "mobility", count: 1 },
      { category: "balance", count: 1 },
    ],
    cooldownCategories: ["mobility"],
    cooldownCount: 2,
  },
  {
    dayNumber: 5,
    title: "Pilates & mobilité",
    focus: ["pilates", "mobility"],
    warmupCategories: ["mobility"],
    warmupCount: 2,
    mainSlots: [
      { category: "pilates", count: 2 },
      { category: "mobility", count: 3 },
      { category: "balance", count: 1 },
    ],
    cooldownCategories: ["pilates", "mobility"],
    cooldownCount: 2,
  },
];

export function getDayTemplate(dayNumber: number): DayTemplate | undefined {
  return weekTemplate.find((d) => d.dayNumber === dayNumber);
}

export const TRAINING_DAYS_PER_WEEK = weekTemplate.length;
