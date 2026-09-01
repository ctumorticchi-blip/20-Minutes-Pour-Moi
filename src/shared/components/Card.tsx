import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-warmgray-100 bg-white p-5 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
