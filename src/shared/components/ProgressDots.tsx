interface ProgressDotsProps {
  done: number;
  total: number;
  label?: string;
}

/** Visual + textual weekly progress (never color-only: the label carries the same info). */
export function ProgressDots({ done, total, label }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={
              i < done
                ? "h-2.5 w-2.5 rounded-full bg-sage-600"
                : "h-2.5 w-2.5 rounded-full border border-warmgray-300 bg-white"
            }
          />
        ))}
      </div>
      <span className="text-sm text-warmgray-600">{label ?? `${done} / ${total}`}</span>
    </div>
  );
}
