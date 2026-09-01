import type { DailyEnergy } from "../../../shared/types";
import { ENERGY_LABELS } from "../../../sport-data/content/editorial";
import { cn } from "../../../shared/utils/cn";

const OPTIONS: DailyEnergy[] = ["tired", "good", "energetic"];

interface EnergyPickerProps {
  value: DailyEnergy | null;
  onChange: (value: DailyEnergy) => void;
}

export function EnergyPicker({ value, onChange }: EnergyPickerProps) {
  return (
    <div role="radiogroup" aria-label="Comment te sens-tu aujourd'hui" className="grid grid-cols-3 gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "min-h-16 rounded-2xl border-2 px-2 py-2 text-sm font-medium transition-colors",
            value === option
              ? "border-sage-600 bg-sage-50 text-sage-900"
              : "border-warmgray-200 bg-white text-warmgray-700 hover:border-sage-300",
          )}
        >
          {ENERGY_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
