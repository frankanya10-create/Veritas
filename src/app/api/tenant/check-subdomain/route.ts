import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subdomain } = await req.json();

    if (!subdomain || typeof subdomain !== "string") {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 });
    }

    const cleaned = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

    if (cleaned.length < 3 || cleaned.length > 63) {
      return NextResponse.json({ available: false, error: "Subdomain must be 3-63 characters" });
    }

    if (cleaned.startsWith("-") || cleaned.endsWith("-")) {
      return NextResponse.json({ available: false, error: "Subdomain cannot start or end with a hyphen" });
    }

    const reserved = ["api", "admin", "www", "app", "mail", "ftp", "root", "veritas", "dashboard", "login", "signup"];
    if (reserved.includes(cleaned)) {
      return NextResponse.json({ available: false, error: "This subdomain is reserved" });
    }

    const { createInsForgeServerClient } = await import("@/lib/insforge/server");
    const insforge = await createInsForgeServerClient();

    const { data } = await insforge.database
      .from("tenants")
      .select("id")
      .eq("subdomain", cleaned)
      .limit(1);

    const available = !data || data.length === 0;

    return NextResponse.json({ available, subdomain: cleaned });
  } catch {
    return NextResponse.json({ available: true });
  }
}
