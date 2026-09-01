import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { testExercises } from "../../../test/fixtures";
import { ExerciseCard } from "./ExerciseCard";

const repsExercise = testExercises.find((e) => e.id === "strength-b")!;
const timedExercise = testExercises.find((e) => e.id === "cardio-a")!;

describe("ExerciseCard", () => {
  it("shows the repetitions count and a 'J'ai terminé' CTA for a reps-based exercise", () => {
    const onComplete = vi.fn();
    render(
      <ExerciseCard
        exercise={repsExercise}
        workoutExercise={{ exerciseId: repsExercise.id, repetitions: 8, sets: 1 }}
        onComplete={onComplete}
      />,
    );

    expect(screen.getByText("8 répétitions")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Démarrer" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "J'ai terminé" }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("shows 'sets × reps' when the exercise has more than one set", () => {
    render(
      <ExerciseCard
        exercise={repsExercise}
        workoutExercise={{ exerciseId: repsExercise.id, repetitions: 10, sets: 2 }}
        onComplete={() => {}}
      />,
    );
    expect(screen.getByText("2 × 10 répétitions")).toBeInTheDocument();
  });

  it("shows the countdown's idle state (Démarrer) instead of a reps readout for a timed exercise", () => {
    render(
      <ExerciseCard
        exercise={timedExercise}
        workoutExercise={{ exerciseId: timedExercise.id, durationSeconds: 30, sets: 1 }}
        onComplete={() => {}}
        countdown={{
          remainingSeconds: 30,
          status: "idle",
          isDone: false,
          start: vi.fn(),
          pause: vi.fn(),
          resume: vi.fn(),
          restart: vi.fn(),
        }}
      />,
    );

    expect(screen.getByText("00:30")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Démarrer" })).toBeInTheDocument();
    expect(screen.queryByText(/répétitions/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "J'ai terminé" })).not.toBeInTheDocument();
  });
});
