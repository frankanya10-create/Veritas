"use server";

import { cookies } from "next/headers";
import { createAuthActions } from "@insforge/sdk/ssr";

export async function signIn(formData: FormData) {
  const auth = createAuthActions({ cookies: await cookies() });
  const { data, error } = await auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  return { user: data?.user ?? null, error: error ? { message: error.message, statusCode: error.statusCode } : null };
}

export async function signUp(formData: FormData) {
  const auth = createAuthActions({ cookies: await cookies() });
  const { data, error } = await auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    name: String(formData.get("name") ?? ""),
    redirectTo: new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL).toString(),
  });
  return {
    data: data ?? null,
    error: error ? { message: error.message, statusCode: error.statusCode } : null,
  };
}

export async function verifyEmail(formData: FormData) {
  const auth = createAuthActions({ cookies: await cookies() });
  const { data, error } = await auth.verifyEmail({
    email: String(formData.get("email")),
    otp: String(formData.get("otp")),
  });

  if (error) {
    return { error: { message: error.message, statusCode: error.statusCode } };
  }

  const onboardingComplete = await checkOnboardingStatus(data?.user?.id ?? "");
  if (onboardingComplete) {
    return { redirect: "/dashboard", user: data?.user };
  }
  return { redirect: "/onboarding", user: data?.user };
}

export async function signOut() {
  const auth = createAuthActions({ cookies: await cookies() });
  return auth.signOut();
}

export async function initiateOAuth(provider: string) {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });
  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo: new URL("/api/auth/callback", process.env.NEXT_PUBLIC_APP_URL).toString(),
    skipBrowserRedirect: true,
  });

  if (error || !data.url || !data.codeVerifier) {
    throw new Error(error?.message ?? "OAuth init failed");
  }

  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return data.url;
}

async function checkOnboardingStatus(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const { createInsForgeServerClient } = await import("@/lib/insforge/server");
    const insforge = await createInsForgeServerClient();
    const { data } = await insforge.database
      .from("user_profiles")
      .select("onboarding_complete")
      .eq("id", userId)
      .single();
    return data?.onboarding_complete === true;
  } catch {
    return false;
  }
}

export async function completeOnboarding(formData: FormData) {
  const { createInsForgeServerClient } = await import("@/lib/insforge/server");
  const insforge = await createInsForgeServerClient();
  const { data: { user } } = await insforge.auth.getCurrentUser();
  if (!user) return { error: { message: "Not authenticated" } };

  const { error } = await insforge.database.from("user_profiles").update({
    role: formData.get("role") ?? "",
    frameworks: formData.get("frameworks") ?? "",
    use_case: formData.get("useCase") ?? "",
    transaction_volume: formData.get("volume") ?? "",
    onboarding_complete: true,
  }).eq("id", user.id);

  if (error) {
    return { error: { message: error.message } };
  }

  return { redirect: "/dashboard" };
}
