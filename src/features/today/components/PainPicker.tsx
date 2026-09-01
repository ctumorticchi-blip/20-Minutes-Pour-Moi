import type { DailyPainArea } from "../../../shared/types";
import { PAIN_AREA_LABELS } from "../../../sport-data/content/editorial";
import { cn } from "../../../shared/utils/cn";

const OPTIONS: DailyPainArea[] = ["none", "knees", "back", "hips", "shoulders", "ankles", "other"];

interface PainPickerProps {
  value: DailyPainArea | null;
  onChange: (value: DailyPainArea) => void;
}

export function PainPicker({ value, onChange }: PainPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Une zone douloureuse aujourd'hui"
      className="flex flex-wrap gap-2"
    >
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "min-h-11 rounded-full border-2 px-4 text-sm font-medium transition-colors",
            value === option
              ? "border-terracotta-500 bg-terracotta-100 text-terracotta-700"
              : "border-warmgray-200 bg-white text-warmgray-700 hover:border-terracotta-300",
          )}
        >
          {PAIN_AREA_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
