"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface UseSessionLockOptions {
  /** Inactivity timeout in milliseconds. Default: 5 minutes */
  timeout?: number;
  /** Whether to enable the lock. Default: true */
  enabled?: boolean;
  /** Callback before locking */
  onLock?: () => void;
}

export function useSessionLock({
  timeout = 5 * 60 * 1000,
  enabled = true,
  onLock,
}: UseSessionLockOptions = {}) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const lock = useCallback(() => {
    onLock?.();
    router.push("/session-lock");
  }, [router, onLock]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (enabled) {
      timerRef.current = setTimeout(lock, timeout);
    }
  }, [enabled, lock, timeout]);

  useEffect(() => {
    if (!enabled) return;

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [enabled, resetTimer]);

  return { lock, resetTimer };
}
