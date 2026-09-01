import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MoveExercise } from "../../../shared/types";
import { testExercises } from "../../../test/fixtures";
import { HowToAccordion } from "./HowToAccordion";

const fullExercise: MoveExercise = {
  ...testExercises[0]!,
  id: "full-exercise",
  startingPosition: "Debout, pieds écartés de la largeur des hanches.",
  instructions: ["Première étape du mouvement.", "Deuxième étape du mouvement."],
  breathingCue: "Expire en montant, inspire en descendant.",
  cues: ["Garde le dos droit", "Regarde devant toi"],
  easierVariation: "Prends appui sur une chaise.",
  harderVariation: "Ralentis le mouvement.",
};

describe("HowToAccordion", () => {
  it("stays collapsed until the user opens it", () => {
    render(<HowToAccordion exercise={fullExercise} />);
    expect(screen.queryByText("Position de départ")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Comment faire cet exercice/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("shows every section once opened, when the exercise has full data", () => {
    render(<HowToAccordion exercise={fullExercise} />);

    fireEvent.click(screen.getByRole("button", { name: /Comment faire cet exercice/ }));

    expect(screen.getByText("Position de départ")).toBeInTheDocument();
    expect(screen.getByText(fullExercise.startingPosition)).toBeInTheDocument();
    expect(screen.getByText("Première étape du mouvement.")).toBeInTheDocument();
    expect(screen.getByText("Deuxième étape du mouvement.")).toBeInTheDocument();
    expect(screen.getByText("Respiration")).toBeInTheDocument();
    expect(screen.getByText("À retenir")).toBeInTheDocument();
    expect(screen.getByText("Version plus facile")).toBeInTheDocument();
    expect(screen.getByText("Version plus difficile")).toBeInTheDocument();
  });

  it("omits optional sections the exercise doesn't have data for", () => {
    // testExercises[0] has no breathingCue, cues, or variations.
    render(<HowToAccordion exercise={testExercises[0]!} />);

    fireEvent.click(screen.getByRole("button", { name: /Comment faire cet exercice/ }));

    expect(screen.getByText("Position de départ")).toBeInTheDocument();
    expect(screen.queryByText("Respiration")).not.toBeInTheDocument();
    expect(screen.queryByText("À retenir")).not.toBeInTheDocument();
    expect(screen.queryByText("Version plus facile")).not.toBeInTheDocument();
    expect(screen.queryByText("Version plus difficile")).not.toBeInTheDocument();
  });
});
