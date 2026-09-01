import { useState } from "react";
import type { MoveExercise } from "../../../shared/types";
import { cn } from "../../../shared/utils/cn";

interface HowToAccordionProps {
  exercise: MoveExercise;
}

/**
 * Full how-to detail, collapsed by default so the main screen during a
 * session stays uncluttered. Everything here is also reachable without
 * leaving the workout — opening it never navigates away.
 */
export function HowToAccordion({ exercise }: HowToAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-5 rounded-2xl border border-warmgray-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-warmgray-900"
      >
        Comment faire cet exercice ?
        <span aria-hidden="true" className={cn("transition-transform", open && "rotate-180")}>
          ⌄
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-warmgray-200 px-4 py-4 text-warmgray-700">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-warmgray-500">
              Position de départ
            </h2>
            <p className="mt-1">{exercise.startingPosition}</p>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-warmgray-500">
              Étapes du mouvement
            </h2>
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              {exercise.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {exercise.breathingCue && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-warmgray-500">
                Respiration
              </h2>
              <p className="mt-1">{exercise.breathingCue}</p>
            </section>
          )}

          {exercise.cues && exercise.cues.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-warmgray-500">
                À retenir
              </h2>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {exercise.cues.map((cue, i) => (
                  <li key={i}>{cue}</li>
                ))}
              </ul>
            </section>
          )}

          {exercise.easierVariation && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-warmgray-500">
                Version plus facile
              </h2>
              <p className="mt-1">{exercise.easierVariation}</p>
            </section>
          )}

          {exercise.harderVariation && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-warmgray-500">
                Version plus difficile
              </h2>
              <p className="mt-1">{exercise.harderVariation}</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
