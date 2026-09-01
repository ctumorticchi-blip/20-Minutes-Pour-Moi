import type { ProgramPhase } from "../../shared/types";

export const programPhases: ProgramPhase[] = [
  {
    id: "phase-1",
    name: "Je reprends confiance",
    startWeek: 1,
    endWeek: 2,
    description:
      "On apprend les mouvements et on installe une routine simple, avec un volume léger.",
    volumeMultiplier: 0.85,
    difficultyCap: 2,
  },
  {
    id: "phase-2",
    name: "Je retrouve ma mobilité",
    startWeek: 3,
    endWeek: 4,
    description:
      "On augmente légèrement l'amplitude des mouvements et on gagne en fluidité, tout en gardant un renforcement doux.",
    volumeMultiplier: 0.95,
    difficultyCap: 2,
  },
  {
    id: "phase-3",
    name: "Je deviens plus forte",
    startWeek: 5,
    endWeek: 8,
    description:
      "Le volume progresse, la résistance revient plus régulièrement, et l'équilibre comme le cardio doux se renforcent.",
    volumeMultiplier: 1.05,
    difficultyCap: 3,
  },
  {
    id: "phase-4",
    name: "Je me sens en forme",
    startWeek: 9,
    endWeek: 12,
    description:
      "Les séances deviennent plus fluides, la coordination s'améliore et le volume est légèrement supérieur.",
    volumeMultiplier: 1.15,
    difficultyCap: 3,
  },
];

export const PROGRAM_TOTAL_WEEKS = 12;

export function getPhaseForWeek(weekNumber: number): ProgramPhase {
  const clampedWeek = Math.min(Math.max(weekNumber, 1), PROGRAM_TOTAL_WEEKS);
  const phase = programPhases.find(
    (p) => clampedWeek >= p.startWeek && clampedWeek <= p.endWeek,
  );
  // Weeks beyond 12 (M0 keeps the program running) stay on the last phase's rules.
  return phase ?? programPhases[programPhases.length - 1]!;
}
