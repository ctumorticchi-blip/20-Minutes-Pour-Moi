/**
 * Future home for real exercise illustrations. Each `MoveExercise.illustrationKey`
 * (e.g. "sit-to-stand") will map to an actual asset here — an imported SVG or
 * image path. For M0 no real illustrations exist yet, so this always returns
 * undefined and callers (see `IllustrationPlaceholder`) fall back to a
 * category-based placeholder. Swapping in real art later only means filling
 * in this map; no calling code needs to change.
 */
const ILLUSTRATION_ASSETS: Record<string, string> = {
  // "sit-to-stand": sitToStandSvg,
};

export function getIllustrationAsset(illustrationKey: string): string | undefined {
  return ILLUSTRATION_ASSETS[illustrationKey];
}
