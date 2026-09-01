import { useState } from "react";
import { useAppData } from "../../app/providers/AppDataProvider";
import type { UserProfile } from "../../shared/types";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { Disclaimer } from "../../shared/components/Disclaimer";
import { PageContainer } from "../../shared/components/PageContainer";
import { SelectableCard } from "../../shared/components/SelectableCard";
import {
  EQUIPMENT_OPTIONS,
  FITNESS_LEVEL_OPTIONS,
  GOAL_OPTIONS,
  SENSITIVE_AREA_OPTIONS,
} from "../onboarding/onboardingOptions";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function ProfilePage() {
  const { profile, saveProfile, resetAll } = useAppData();
  const [draft, setDraft] = useState<UserProfile | null>(profile);
  const [saved, setSaved] = useState(false);

  if (!draft) return null;

  function update(patch: Partial<UserProfile>) {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setSaved(false);
  }

  function handleSave() {
    if (!draft) return;
    saveProfile(draft);
    setSaved(true);
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold text-warmgray-900">Mon profil</h1>

      <Card className="mt-6 space-y-4">
        <div>
          <label htmlFor="firstName" className="text-sm font-semibold text-warmgray-700">
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            value={draft.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-warmgray-200 px-3 focus:border-sage-600"
          />
        </div>
        <div>
          <label htmlFor="age" className="text-sm font-semibold text-warmgray-700">
            Âge
          </label>
          <input
            id="age"
            type="number"
            value={draft.age}
            onChange={(e) => update({ age: Number(e.target.value) || draft.age })}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-warmgray-200 px-3 focus:border-sage-600"
          />
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-warmgray-900">Niveau</h2>
        <div className="mt-3 space-y-2">
          {FITNESS_LEVEL_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              role="radio"
              label={opt.label}
              description={opt.description}
              selected={draft.fitnessLevel === opt.value}
              onClick={() => update({ fitnessLevel: opt.value })}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-warmgray-900">Objectifs</h2>
        <div className="mt-3 space-y-2">
          {GOAL_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              role="checkbox"
              label={opt.label}
              icon={opt.icon}
              selected={draft.goals.includes(opt.value)}
              onClick={() => update({ goals: toggle(draft.goals, opt.value) })}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-warmgray-900">Zones sensibles</h2>
        <div className="mt-3 space-y-2">
          {SENSITIVE_AREA_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              role="checkbox"
              label={opt.label}
              selected={draft.sensitiveAreas.includes(opt.value)}
              onClick={() => update({ sensitiveAreas: toggle(draft.sensitiveAreas, opt.value) })}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-warmgray-900">Matériel</h2>
        <div className="mt-3 space-y-2">
          {EQUIPMENT_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              role="checkbox"
              label={opt.label}
              icon={opt.icon}
              selected={draft.equipment.includes(opt.value)}
              onClick={() => update({ equipment: toggle(draft.equipment, opt.value) })}
            />
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Button onClick={handleSave}>Enregistrer</Button>
        {saved && <p className="mt-2 text-center text-sm text-sage-700">Profil enregistré.</p>}
      </div>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-warmgray-900">À propos du programme</h2>
        <Card className="mt-3">
          <Disclaimer />
        </Card>
      </section>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => {
            if (confirm("Effacer toutes tes données enregistrées sur cet appareil ?")) {
              resetAll();
            }
          }}
          className="text-sm text-warmgray-400 underline underline-offset-2"
        >
          Réinitialiser mes données
        </button>
      </div>
    </PageContainer>
  );
}
