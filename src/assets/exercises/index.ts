import type { ExerciseIllustrationAsset } from "./types";

export type { ExerciseIllustrationAsset, IllustrationStep } from "./types";

/**
 * Future home for real exercise illustrations. Each `MoveExercise.illustrationKey`
 * (e.g. "sit-to-stand") maps to an asset here — either one hero image
 * (`{ kind: "single", src }`) or an ordered sequence of steps
 * (`{ kind: "steps", steps: [...] }`) for a movement where showing the
 * positions in order helps (see `docs/ILLUSTRATIONS.md`).
 *
 * No real illustrations exist yet, so this always returns undefined and the
 * single caller (`ExerciseIllustration`, in `shared/components`) falls back
 * to a calm, category-colored placeholder. Swapping in real art later only
 * means adding entries to this map — no screen or engine code changes.
 *
 * Example once art lands:
 *   import sitToStandStart from "./sit-to-stand/start.webp";
 *   import sitToStandRise from "./sit-to-stand/rise.webp";
 *   import sitToStandStanding from "./sit-to-stand/standing.webp";
 *
 *   const ILLUSTRATION_ASSETS: Partial<Record<string, ExerciseIllustrationAsset>> = {
 *     "sit-to-stand": {
 *       kind: "steps",
 *       steps: [
 *         { src: sitToStandStart, label: "Position assise" },
 *         { src: sitToStandRise, label: "Poussée dans les jambes" },
 *         { src: sitToStandStanding, label: "Debout" },
 *       ],
 *     },
 *     "chest-opening-stretch": { kind: "single", src: chestOpenerWebp },
 *   };
 */
const ILLUSTRATION_ASSETS: Partial<Record<string, ExerciseIllustrationAsset>> = {};

export function getIllustrationAsset(illustrationKey: string): ExerciseIllustrationAsset | undefined {
  return ILLUSTRATION_ASSETS[illustrationKey];
}
