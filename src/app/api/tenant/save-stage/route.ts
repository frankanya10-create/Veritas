import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { tenantId, stageData, currentStage } = await req.json();

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 });
    }

    const { createInsForgeServerClient } = await import("@/lib/insforge/server");
    const insforge = await createInsForgeServerClient();

    const updatePayload: Record<string, unknown> = {
      ...stageData,
      current_stage: currentStage,
      updated_at: new Date().toISOString(),
    };

    const { error } = await insforge.database
      .from("onboarding_state")
      .upsert(
        { tenant_id: tenantId, ...updatePayload },
        { onConflict: "tenant_id" }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
