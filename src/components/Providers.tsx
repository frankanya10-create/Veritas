"use client";

import dynamic from "next/dynamic";
import { AuthProvider } from "@/components/AuthProvider";

const I18nProvider = dynamic(
  () => import("@/lib/i18n/useTranslation").then((m) => m.I18nProvider),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>{children}</AuthProvider>
    </I18nProvider>
  );
}
