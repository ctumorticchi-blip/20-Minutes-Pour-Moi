/** One frame of a multi-step illustration sequence (e.g. seated → mid-rise → standing). */
export interface IllustrationStep {
  src: string;
  /** Short label for this step, e.g. "Position assise". Used in alt text and as a caption. */
  label: string;
}

/**
 * What `illustrationKey` resolves to. A single hero image for most exercises,
 * or an ordered sequence of steps for ones where the movement itself is the
 * point (e.g. sit-to-stand). Never both — a resolver picks one shape per key.
 */
export type ExerciseIllustrationAsset =
  | { kind: "single"; src: string }
  | { kind: "steps"; steps: IllustrationStep[] };
