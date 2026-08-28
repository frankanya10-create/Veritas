import SSOClient from "./SSOClient";

export const metadata = {
  title: "Enterprise SSO — Veritas",
  description: "Sign in with your corporate identity provider.",
};

export default function SSOPage() {
  return <SSOClient />;
}
