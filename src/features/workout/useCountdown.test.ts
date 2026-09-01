import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCountdown } from "./useCountdown";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useCountdown", () => {
  it("never starts on its own: it stays idle at the full duration until start() is called", () => {
    const { result } = renderHook(() => useCountdown(30));

    expect(result.current.status).toBe("idle");
    expect(result.current.remainingSeconds).toBe(30);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.remainingSeconds).toBe(30);
  });

  it("counts down once per second after start()", () => {
    const { result } = renderHook(() => useCountdown(30));

    act(() => result.current.start());
    expect(result.current.status).toBe("running");

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.remainingSeconds).toBe(29);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.remainingSeconds).toBe(28);
  });

  it("stops decrementing while paused, and resumes from the same value", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.remainingSeconds).toBe(7);

    act(() => result.current.pause());
    expect(result.current.status).toBe("paused");

    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.remainingSeconds).toBe(7); // unchanged while paused

    act(() => result.current.resume());
    expect(result.current.status).toBe("running");

    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.remainingSeconds).toBe(5);
  });

  it("restarts from the full duration and runs immediately", () => {
    const { result } = renderHook(() => useCountdown(10));

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(4000));
    expect(result.current.remainingSeconds).toBe(6);

    act(() => result.current.restart());
    expect(result.current.remainingSeconds).toBe(10);
    expect(result.current.status).toBe("running");

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.remainingSeconds).toBe(9);
  });

  it("stops exactly at 0, never goes negative, and reports isDone", () => {
    const { result } = renderHook(() => useCountdown(2));

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000)); // well past the 2s duration

    expect(result.current.remainingSeconds).toBe(0);
    expect(result.current.isDone).toBe(true);
  });

  it("resets to idle at the new duration when the exercise changes", () => {
    const { result, rerender } = renderHook(({ duration }) => useCountdown(duration), {
      initialProps: { duration: 20 },
    });

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.remainingSeconds).toBe(15);

    rerender({ duration: 12 });

    expect(result.current.status).toBe("idle");
    expect(result.current.remainingSeconds).toBe(12);

    // Still idle: no tick happens until start() is pressed again.
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.remainingSeconds).toBe(12);
  });

  it("clears its interval on unmount instead of leaking a running timer", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
    const { result, unmount } = renderHook(() => useCountdown(30));

    act(() => result.current.start());
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
