import type { ReactNode } from "react";
import { Button } from "../../../shared/components/Button";

interface StepShellProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export function StepShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "Continuer",
  nextDisabled = false,
}: StepShellProps) {
  return (
    <div className="flex min-h-svh flex-col px-5 pb-8 pt-8">
      <div className="mb-6" aria-hidden="true">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-warmgray-100">
          <div
            className="h-full rounded-full bg-sage-600 transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      <p className="text-sm text-warmgray-500">
        Étape {step} sur {totalSteps}
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-warmgray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-base text-warmgray-600">{subtitle}</p>}

      <div className="mt-6 flex-1 space-y-3">{children}</div>

      <div className="mt-8 flex gap-3">
        {onBack && (
          <Button variant="secondary" onClick={onBack} className="w-auto px-6">
            Retour
          </Button>
        )}
        <Button onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
