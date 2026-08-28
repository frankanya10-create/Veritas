import { generateSecret, verifySync } from "otplib";

const APP_NAME = "Veritas";

export function generateTotpSecret(): string {
  return generateSecret();
}

export function createOtpauthUrl(secret: string, email: string): string {
  return `otpauth://totp/${APP_NAME}:${email}?secret=${secret}&issuer=${APP_NAME}`;
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    const result = verifySync({ token, secret }) as unknown;
    return result === true || (typeof result === "object" && result !== null && "delta" in result);
  } catch {
    return false;
  }
}
