import SessionLockClient from "./SessionLockClient";

export const metadata = {
  title: "Session Locked — Veritas",
  description: "Your session has been locked due to inactivity.",
};

export default function SessionLockPage() {
  return <SessionLockClient />;
}
