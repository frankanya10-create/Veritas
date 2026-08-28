"use client";

import { useState, useEffect, useCallback } from "react";

interface UsePasswordStrengthOptions {
  minLength?: number;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  percentage: number;
}

export function usePasswordStrength(options: UsePasswordStrengthOptions = {}) {
  const { minLength = 6 } = options;
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: "",
    color: "bg-zinc-800",
    percentage: 0,
  });

  const calculateStrength = useCallback((pw: string): PasswordStrength => {
    let score = 0;
    if (pw.length >= minLength) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500", percentage: 20 };
    if (score <= 2) return { score, label: "Fair", color: "bg-orange-500", percentage: 40 };
    if (score <= 3) return { score, label: "Good", color: "bg-yellow-500", percentage: 60 };
    if (score <= 4) return { score, label: "Strong", color: "bg-green-500", percentage: 80 };
    return { score, label: "Very Strong", color: "bg-emerald-500", percentage: 100 };
  }, [minLength]);

  useEffect(() => {
    if (password.length === 0) {
      setStrength({ score: 0, label: "", color: "bg-zinc-800", percentage: 0 });
    } else {
      setStrength(calculateStrength(password));
    }
  }, [password, calculateStrength]);

  return { password, setPassword, strength };
}
