"use client";

import { useState, useEffect, useCallback } from "react";

interface UseWebAuthnOptions {
  rpName?: string;
  rpId?: string;
}

export function useWebAuthn(options: UseWebAuthnOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
      window.PublicKeyCredential !== undefined &&
      typeof window.navigator.credentials !== "undefined"
    );
  }, []);

  const authenticate = useCallback(async () => {
    if (!isSupported) {
      setError("WebAuthn is not supported in this browser");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In production, this would fetch a challenge from your server
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "preferred",
          rpId: options.rpId || window.location.hostname,
        },
      });

      return credential;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Authentication was cancelled");
        } else {
          setError("Authentication failed: " + err.message);
        }
      } else {
        setError("Authentication failed");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, options.rpId]);

  const register = useCallback(async (userId: string, userName: string) => {
    if (!isSupported) {
      setError("WebAuthn is not supported in this browser");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: options.rpName || "Veritas",
            id: options.rpId || window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userName,
            displayName: userName,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "preferred",
          },
          timeout: 60000,
        },
      });

      return credential;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Registration was cancelled");
        } else {
          setError("Registration failed: " + err.message);
        }
      } else {
        setError("Registration failed");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, options.rpName, options.rpId]);

  return {
    isSupported,
    isLoading,
    error,
    authenticate,
    register,
  };
}
