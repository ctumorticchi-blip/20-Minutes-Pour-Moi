import type { ExerciseCategory } from "../types";
import { getIllustrationAsset } from "../../assets/exercises";
import { CATEGORY_LABELS } from "../../sport-data/content/editorial";
import { cn } from "../utils/cn";

interface IllustrationPlaceholderProps {
  illustrationKey: string;
  category: ExerciseCategory;
  className?: string;
}

const CATEGORY_STYLES: Record<ExerciseCategory, { bg: string; fg: string }> = {
  strength: { bg: "bg-terracotta-100", fg: "text-terracotta-700" },
  cardio: { bg: "bg-sage-100", fg: "text-sage-700" },
  mobility: { bg: "bg-warmgray-100", fg: "text-warmgray-700" },
  pilates: { bg: "bg-sage-50", fg: "text-sage-700" },
  balance: { bg: "bg-terracotta-100", fg: "text-terracotta-700" },
};

/**
 * Generic illustration slot. Today it always renders a calm, consistent
 * placeholder (a simple moving figure + category color); once real art
 * exists for a given `illustrationKey`, `getIllustrationAsset` starts
 * returning it and this component swaps to an <img> automatically —
 * no other code needs to change.
 */
export function IllustrationPlaceholder({
  illustrationKey,
  category,
  className,
}: IllustrationPlaceholderProps) {
  const asset = getIllustrationAsset(illustrationKey);
  const style = CATEGORY_STYLES[category];

  if (asset) {
    return (
      <img
        src={asset}
        alt=""
        className={cn("h-40 w-full rounded-2xl object-contain", style.bg, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl",
        style.bg,
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className={cn("h-16 w-16", style.fg)} fill="none">
        <circle cx="32" cy="12" r="7" fill="currentColor" />
        <path
          d="M32 20v16m0 0-11 14m11-14 11 14M32 30l-13 7M32 30l13 7"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cn("text-xs font-medium", style.fg)}>{CATEGORY_LABELS[category]}</span>
    </div>
  );
}
