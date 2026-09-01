import { describe, expect, it } from "vitest";
import { getIllustrationAsset } from "./index";

describe("getIllustrationAsset", () => {
  it("returns undefined for any illustrationKey until real art is registered", () => {
    // Documents the current M1 contract: no real assets exist yet, so every
    // exercise (real catalog key or not) falls back to the placeholder.
    expect(getIllustrationAsset("sit-to-stand")).toBeUndefined();
    expect(getIllustrationAsset("some-made-up-key")).toBeUndefined();
  });
});
