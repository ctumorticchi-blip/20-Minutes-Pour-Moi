import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppDataProvider } from "../../app/providers/AppDataProvider";
import { demoProfile } from "../../engine/profile/demoProfile";
import { storage } from "../../shared/storage/storage";
import { WorkoutPlayerPage } from "./WorkoutPlayerPage";

// 2026-01-05 is a Monday, so it's always a training day (never a rest day),
// and fixing the clock makes the generated session deterministic to assert on.
const FAKE_TODAY = new Date("2026-01-05T09:00:00");

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(FAKE_TODAY);

  storage.saveProfile(demoProfile);
  storage.setProgramStartDate("2026-01-05");
  storage.upsertCheckIn({ date: "2026-01-05", energy: "good", painArea: "none" });
});

afterEach(() => {
  vi.useRealTimers();
});

function renderPlayer() {
  return render(
    <MemoryRouter initialEntries={["/workout"]}>
      <AppDataProvider>
        <WorkoutPlayerPage />
      </AppDataProvider>
    </MemoryRouter>,
  );
}

describe("WorkoutPlayerPage progression", () => {
  it("shows which exercise you're on, and advances when you move to the next one", () => {
    renderPlayer();

    expect(screen.getByText(/Exercice 1 sur \d+/)).toBeInTheDocument();

    // "Suivant" always works, whether the current exercise is reps- or
    // timer-based — it's the one navigation control that's never blocked.
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

    expect(screen.getByText(/Exercice 2 sur \d+/)).toBeInTheDocument();
    expect(screen.queryByText(/Exercice 1 sur \d+/)).not.toBeInTheDocument();
  });

  it("disables 'Précédent' on the first exercise and re-enables it after moving forward", () => {
    renderPlayer();

    expect(screen.getByRole("button", { name: "Précédent" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));

    expect(screen.getByRole("button", { name: "Précédent" })).not.toBeDisabled();
  });
});
