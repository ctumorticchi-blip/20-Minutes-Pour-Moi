import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/** Consistent mobile-first page padding, capped width on larger screens, room for the bottom nav. */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-xl flex-1 px-5 pb-28 pt-8 sm:pb-10",
        className,
      )}
    >
      {children}
    </main>
  );
}
