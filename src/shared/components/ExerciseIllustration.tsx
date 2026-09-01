import type { ExerciseCategory } from "../types";
import { getIllustrationAsset } from "../../assets/exercises";
import type { ExerciseIllustrationAsset } from "../../assets/exercises";
import { CATEGORY_LABELS } from "../../sport-data/content/editorial";
import { cn } from "../utils/cn";

interface ExerciseIllustrationProps {
  illustrationKey: string;
  category: ExerciseCategory;
  /** Exercise name, used to build meaningful alt text for real images. */
  name: string;
  className?: string;
  /** Test-only override: skips the internal lookup so the render paths below are unit-testable. */
  asset?: ExerciseIllustrationAsset;
}

const CATEGORY_STYLES: Record<ExerciseCategory, { bg: string; fg: string }> = {
  strength: { bg: "bg-terracotta-100", fg: "text-terracotta-700" },
  cardio: { bg: "bg-sage-100", fg: "text-sage-700" },
  mobility: { bg: "bg-warmgray-100", fg: "text-warmgray-600" },
  pilates: { bg: "bg-sage-50", fg: "text-sage-700" },
  balance: { bg: "bg-terracotta-100", fg: "text-terracotta-700" },
};

const FRAME_CLASSES = "aspect-[4/3] w-full overflow-hidden rounded-3xl";

function PlaceholderFrame({ category, className }: { category: ExerciseCategory; className?: string }) {
  const style = CATEGORY_STYLES[category];
  return (
    <div
      className={cn(FRAME_CLASSES, "flex flex-col items-center justify-center gap-2", style.bg, className)}
      // Decorative: the exercise name is already the on-screen heading, this
      // silhouette adds no information a screen reader user would be missing.
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className={cn("h-20 w-20", style.fg)} fill="none">
        <circle cx="32" cy="12" r="7" fill="currentColor" />
        <path
          d="M32 20v16m0 0-11 14m11-14 11 14M32 30l-13 7M32 30l13 7"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cn("text-sm font-medium", style.fg)}>{CATEGORY_LABELS[category]}</span>
    </div>
  );
}

/**
 * The single place that resolves `illustrationKey` → visual, and the only
 * component that should ever import an exercise image. Three render paths:
 *
 * - no asset yet → a calm, category-colored placeholder (today, always).
 * - a single hero image → shown full-bleed in the frame.
 * - a step sequence → a simple, non-interactive horizontal filmstrip, so the
 *   whole movement (e.g. seated → rising → standing) reads at a glance
 *   without a carousel or any gesture to learn.
 *
 * Once real art lands for a given key, `getIllustrationAsset` starts
 * returning it and this component swaps automatically — no screen changes.
 */
export function ExerciseIllustration({
  illustrationKey,
  category,
  name,
  className,
  asset,
}: ExerciseIllustrationProps) {
  const resolved = asset ?? getIllustrationAsset(illustrationKey);

  if (!resolved) {
    return <PlaceholderFrame category={category} className={className} />;
  }

  if (resolved.kind === "single") {
    return (
      <div className={cn(FRAME_CLASSES, CATEGORY_STYLES[category].bg, className)}>
        <img
          src={resolved.src}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // Multi-step sequence: an ordered filmstrip, each frame the same size.
  return (
    <ol className={cn("flex w-full gap-1.5", className)} aria-label={`Étapes du mouvement : ${name}`}>
      {resolved.steps.map((step, i) => (
        <li
          key={i}
          className={cn(
            "aspect-[3/4] flex-1 overflow-hidden rounded-2xl",
            CATEGORY_STYLES[category].bg,
          )}
        >
          <img
            src={step.src}
            alt={`${name} — étape ${i + 1} : ${step.label}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </li>
      ))}
    </ol>
  );
}
