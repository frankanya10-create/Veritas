import OnboardingShell from "@/components/onboarding/OnboardingShell";

export const metadata = {
  title: "Onboarding — Veritas",
  description: "Set up your enterprise compliance command center.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
