"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import translations, { type Locale, type TranslationSet } from "./translations";
export type { Locale } from "./translations";

interface I18nContextValue {
  locale: Locale;
  t: TranslationSet;
  setLocale: (locale: Locale) => void;
  availableLocales: Locale[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const value: I18nContextValue = {
    locale,
    t: translations[locale],
    setLocale,
    availableLocales: Object.keys(translations) as Locale[],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for components rendered outside provider
    return {
      locale: "en",
      t: translations.en,
      setLocale: () => {},
      availableLocales: Object.keys(translations) as Locale[],
    };
  }
  return ctx;
}

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
  ar: "العربية",
  pt: "Português",
};
