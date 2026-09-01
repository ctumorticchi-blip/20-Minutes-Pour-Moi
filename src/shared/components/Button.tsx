import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-sage-600 text-white hover:bg-sage-700 active:bg-sage-700",
  secondary:
    "bg-white text-warmgray-900 border border-warmgray-300 hover:bg-warmgray-50",
  ghost: "bg-transparent text-warmgray-700 hover:bg-warmgray-100",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "min-h-11 px-4 text-base",
  lg: "min-h-14 px-6 text-lg",
};

export function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-2xl font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
