import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  Equipment,
  FitnessLevel,
  Goal,
  SensitiveArea,
  UserProfile,
} from "../../shared/types";
import { useAppData } from "../../app/providers/AppDataProvider";
import { demoProfile } from "../../engine/profile/demoProfile";
import { Card } from "../../shared/components/Card";
import { Disclaimer } from "../../shared/components/Disclaimer";
import { SelectableCard } from "../../shared/components/SelectableCard";
import { CREATE_PROGRAM_CTA } from "../../sport-data/content/editorial";
import {
  EQUIPMENT_OPTIONS,
  FITNESS_LEVEL_OPTIONS,
  GOAL_OPTIONS,
  SENSITIVE_AREA_OPTIONS,
} from "./onboardingOptions";
import { StepShell } from "./components/StepShell";

interface Draft {
  firstName: string;
  age: string;
  fitnessLevel: FitnessLevel | null;
  goals: Goal[];
  sensitiveAreas: SensitiveArea[];
  equipment: Equipment[];
}

const EMPTY_DRAFT: Draft = {
  firstName: "",
  age: "",
  fitnessLevel: null,
  goals: [],
  sensitiveAreas: [],
  equipment: [],
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const TOTAL_STEPS = 6;

export function OnboardingPage() {
  const { saveProfile } = useAppData();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  function loadDemoProfile() {
    saveProfile(demoProfile);
    navigate("/today", { replace: true });
  }

  function finish() {
    const profile: UserProfile = {
      firstName: draft.firstName.trim() || "Vous",
      age: Number(draft.age) || 65,
      fitnessLevel: draft.fitnessLevel ?? "returning",
      goals: draft.goals,
      sensitiveAreas: draft.sensitiveAreas,
      equipment: draft.equipment,
      onboardingCompleted: true,
    };
    saveProfile(profile);
    navigate("/today", { replace: true });
  }

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  if (step === 0) {
    return (
      <StepShell
        step={1}
        totalSteps={TOTAL_STEPS}
        title="Comment veux-tu qu'on t'appelle ?"
        subtitle="On reprend le sport à ton rythme, tout simplement."
        onNext={next}
        nextDisabled={draft.firstName.trim().length === 0}
      >
        <label htmlFor="firstName" className="sr-only">
          Prénom
        </label>
        <input
          id="firstName"
          type="text"
          autoFocus
          value={draft.firstName}
          onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
          placeholder="Ton prénom"
          className="min-h-14 w-full rounded-2xl border-2 border-warmgray-200 px-4 text-lg focus:border-sage-600"
        />
        <button
          type="button"
          onClick={loadDemoProfile}
          className="mt-4 text-sm text-sage-700 underline underline-offset-2"
        >
          Essayer avec le profil de démonstration (Marie, 68 ans)
        </button>
      </StepShell>
    );
  }

  if (step === 1) {
    return (
      <StepShell
        step={2}
        totalSteps={TOTAL_STEPS}
        title="Quel âge as-tu ?"
        onBack={back}
        onNext={next}
        nextDisabled={!draft.age || Number(draft.age) <= 0}
      >
        <label htmlFor="age" className="sr-only">
          Âge
        </label>
        <input
          id="age"
          type="number"
          inputMode="numeric"
          autoFocus
          min={18}
          max={110}
          value={draft.age}
          onChange={(e) => setDraft({ ...draft, age: e.target.value })}
          placeholder="Ton âge"
          className="min-h-14 w-full rounded-2xl border-2 border-warmgray-200 px-4 text-lg focus:border-sage-600"
        />
      </StepShell>
    );
  }

  if (step === 2) {
    return (
      <StepShell
        step={3}
        totalSteps={TOTAL_STEPS}
        title="Où en es-tu aujourd'hui ?"
        onBack={back}
        onNext={next}
        nextDisabled={!draft.fitnessLevel}
      >
        {FITNESS_LEVEL_OPTIONS.map((opt) => (
          <SelectableCard
            key={opt.value}
            role="radio"
            label={opt.label}
            description={opt.description}
            selected={draft.fitnessLevel === opt.value}
            onClick={() => setDraft({ ...draft, fitnessLevel: opt.value })}
          />
        ))}
      </StepShell>
    );
  }

  if (step === 3) {
    return (
      <StepShell
        step={4}
        totalSteps={TOTAL_STEPS}
        title="Qu'est-ce qui te ferait du bien ?"
        subtitle="Choisis autant d'objectifs que tu veux."
        onBack={back}
        onNext={next}
        nextDisabled={draft.goals.length === 0}
      >
        {GOAL_OPTIONS.map((opt) => (
          <SelectableCard
            key={opt.value}
            role="checkbox"
            label={opt.label}
            icon={opt.icon}
            selected={draft.goals.includes(opt.value)}
            onClick={() => setDraft({ ...draft, goals: toggle(draft.goals, opt.value) })}
          />
        ))}
      </StepShell>
    );
  }

  if (step === 4) {
    return (
      <StepShell
        step={5}
        totalSteps={TOTAL_STEPS}
        title="Une zone à ménager ?"
        subtitle="On adaptera les exercices en conséquence. Tu peux laisser vide si rien ne te gêne."
        onBack={back}
        onNext={next}
      >
        {SENSITIVE_AREA_OPTIONS.map((opt) => (
          <SelectableCard
            key={opt.value}
            role="checkbox"
            label={opt.label}
            selected={draft.sensitiveAreas.includes(opt.value)}
            onClick={() =>
              setDraft({ ...draft, sensitiveAreas: toggle(draft.sensitiveAreas, opt.value) })
            }
          />
        ))}
      </StepShell>
    );
  }

  if (step === 5) {
    return (
      <StepShell
        step={6}
        totalSteps={TOTAL_STEPS}
        title="Qu'as-tu sous la main ?"
        subtitle="On construit ton programme avec ce que tu as déjà."
        onBack={back}
        onNext={finish}
        nextLabel={CREATE_PROGRAM_CTA}
      >
        {EQUIPMENT_OPTIONS.map((opt) => (
          <SelectableCard
            key={opt.value}
            role="checkbox"
            label={opt.label}
            icon={opt.icon}
            selected={draft.equipment.includes(opt.value)}
            onClick={() => setDraft({ ...draft, equipment: toggle(draft.equipment, opt.value) })}
          />
        ))}
        <Card className="mt-4 bg-cream-dark">
          <Disclaimer />
        </Card>
      </StepShell>
    );
  }

  return null;
}
