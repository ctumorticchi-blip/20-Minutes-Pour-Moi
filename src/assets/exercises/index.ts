/**
 * Future home for real exercise illustrations. Each `MoveExercise.illustrationKey`
 * (e.g. "sit-to-stand") will map to an actual asset here — import a real
 * SVG/WebP/PNG file and reference it by that key. No real illustrations
 * exist yet, so this always returns undefined and the single caller
 * (`ExerciseIllustration`, in `shared/components`) falls back to a
 * category-based placeholder. Swapping in real art later only means adding
 * entries to this map; no screen or engine code needs to change.
 *
 * Example once art lands:
 *   import sitToStandSvg from "./sit-to-stand.svg";
 *   const ILLUSTRATION_ASSETS: Record<string, string> = {
 *     "sit-to-stand": sitToStandSvg,
 *   };
 */
const ILLUSTRATION_ASSETS: Record<string, string> = {
  // "sit-to-stand": sitToStandSvg,
};

export function getIllustrationAsset(illustrationKey: string): string | undefined {
  return ILLUSTRATION_ASSETS[illustrationKey];
}
