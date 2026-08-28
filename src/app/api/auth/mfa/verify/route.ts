import { NextRequest, NextResponse } from "next/server";
import { verifyTotp } from "@/lib/totp";

export async function POST(req: NextRequest) {
  try {
    const { token, secret } = await req.json();

    if (!token || !secret) {
      return NextResponse.json({ error: "Token and secret are required" }, { status: 400 });
    }

    if (typeof token !== "string" || token.length !== 6) {
      return NextResponse.json({ error: "Token must be a 6-digit code" }, { status: 400 });
    }

    const valid = verifyTotp(token, secret);

    if (valid) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json({ verified: false, error: "Invalid verification code" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
