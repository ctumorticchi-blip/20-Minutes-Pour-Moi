import { useEffect, useRef, useState } from "react";

export type CountdownStatus = "idle" | "running" | "paused";

interface UseCountdownResult {
  remainingSeconds: number;
  status: CountdownStatus;
  /** True once the countdown has run all the way down to 0. */
  isDone: boolean;
  /** Begins the countdown from the full duration. No-op once already started. */
  start: () => void;
  pause: () => void;
  resume: () => void;
  /** Resets to the full duration and starts again immediately. */
  restart: () => void;
}

/**
 * A pausable, restartable countdown that never starts on its own.
 *
 * It never starts by itself: it always begins `idle`, waiting for `start()`,
 * so the displayed time only ever moves because the user asked it to. It
 * resets to `idle` whenever `durationSeconds` changes (a new exercise),
 * and only ever runs one interval at a time — the interval is owned by a
 * single effect keyed on `status`, so switching exercises, pausing, or
 * unmounting always tears down the previous interval before anything new
 * can start (guarded further by `intervalRef` against any double-start).
 */
export function useCountdown(durationSeconds: number): UseCountdownResult {
  const [trackedDuration, setTrackedDuration] = useState(durationSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [status, setStatus] = useState<CountdownStatus>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Adjust state during render when the exercise (and its duration) changes,
  // rather than syncing it back via an effect — see "you might not need an
  // effect" in the React docs for this exact reset-on-prop-change pattern.
  // Crucially this resets to "idle", not "running": a new exercise never
  // starts its timer on its own.
  if (durationSeconds !== trackedDuration) {
    setTrackedDuration(durationSeconds);
    setRemainingSeconds(durationSeconds);
    setStatus("idle");
  }

  useEffect(() => {
    if (status !== "running") return;

    // Defensive guard: never let two intervals run at once.
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [status]);

  return {
    remainingSeconds,
    status,
    isDone: remainingSeconds <= 0,
    start: () => setStatus((s) => (s === "idle" ? "running" : s)),
    pause: () => setStatus((s) => (s === "running" ? "paused" : s)),
    resume: () => setStatus((s) => (s === "paused" ? "running" : s)),
    restart: () => {
      setRemainingSeconds(trackedDuration);
      setStatus("running");
    },
  };
}
