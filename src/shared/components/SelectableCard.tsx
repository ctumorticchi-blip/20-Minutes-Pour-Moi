import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface SelectableCardProps {
  label: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
  /** "radio" for single-choice groups, "checkbox" for multi-select groups. */
  role?: "radio" | "checkbox" | "button";
}

export function SelectableCard({
  label,
  description,
  icon,
  selected,
  onClick,
  role = "button",
}: SelectableCardProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role !== "button" ? selected : undefined}
      aria-pressed={role === "button" ? selected : undefined}
      onClick={onClick}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors",
        selected
          ? "border-sage-600 bg-sage-50 text-sage-900"
          : "border-warmgray-200 bg-white text-warmgray-900 hover:border-sage-300",
      )}
    >
      {icon && <span className="text-2xl" aria-hidden="true">{icon}</span>}
      <span className="flex-1">
        <span className="block text-base font-medium">{label}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-warmgray-500">{description}</span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-sage-600 bg-sage-600" : "border-warmgray-300",
        )}
      >
        {selected && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white">
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
