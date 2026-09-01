import { useEffect, useState } from "react";

interface UseCountdownResult {
  remainingSeconds: number;
  isRunning: boolean;
  isDone: boolean;
  pause: () => void;
  resume: () => void;
}

/** A simple, pausable countdown. Resets whenever `durationSeconds` (a new exercise) changes. */
export function useCountdown(durationSeconds: number): UseCountdownResult {
  const [trackedDuration, setTrackedDuration] = useState(durationSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(true);

  // Adjust state during render when the exercise (and its duration) changes,
  // rather than syncing it back via an effect — see "you might not need an
  // effect" in the React docs for this exact reset-on-prop-change pattern.
  if (durationSeconds !== trackedDuration) {
    setTrackedDuration(durationSeconds);
    setRemainingSeconds(durationSeconds);
    setIsRunning(true);
  }

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemainingSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  return {
    remainingSeconds,
    isRunning,
    isDone: remainingSeconds <= 0,
    pause: () => setIsRunning(false),
    resume: () => setIsRunning(true),
  };
}
