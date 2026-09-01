import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExerciseIllustration } from "./ExerciseIllustration";

describe("ExerciseIllustration", () => {
  it("falls back to the category placeholder when no asset is registered for the key", () => {
    render(
      <ExerciseIllustration illustrationKey="unknown-key" category="strength" name="Un exercice" />,
    );
    // No <img> should be rendered — only the decorative, category-labeled placeholder.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Renforcement")).toBeInTheDocument();
  });

  it("renders a single resolved image with meaningful alt text", () => {
    render(
      <ExerciseIllustration
        illustrationKey="sit-to-stand"
        category="strength"
        name="Assis-debout"
        asset={{ kind: "single", src: "/fake/sit-to-stand.webp" }}
      />,
    );
    const img = screen.getByRole("img", { name: "Assis-debout" });
    expect(img).toHaveAttribute("src", "/fake/sit-to-stand.webp");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("renders each step of a multi-step sequence with its own descriptive alt text", () => {
    render(
      <ExerciseIllustration
        illustrationKey="sit-to-stand"
        category="strength"
        name="Assis-debout"
        asset={{
          kind: "steps",
          steps: [
            { src: "/fake/start.webp", label: "Position assise" },
            { src: "/fake/rise.webp", label: "Poussée" },
            { src: "/fake/standing.webp", label: "Debout" },
          ],
        }}
      />,
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    expect(screen.getByRole("img", { name: "Assis-debout — étape 1 : Position assise" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Assis-debout — étape 3 : Debout" })).toBeInTheDocument();
  });
});
