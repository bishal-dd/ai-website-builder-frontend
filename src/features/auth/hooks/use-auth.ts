"use client";

import { useState } from "react";
import { signIn, signInSocial, signUp } from "@/lib/actions/auth-actions";

export function useAuth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSocialAuth = async (provider: "google") => {
    setIsLoading(true);
    setError("");

    try {
      await signInSocial(provider);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Social authentication failed");
      }
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let result;

      if (isSignIn) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, name);
      }

      if (result.success) {
        console.log("✅ Authentication successful");
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Authentication failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setError("");
    setName("");
  };

  return {
    isSignIn,
    email,
    password,
    name,
    isLoading,
    error,
    setEmail,
    setPassword,
    setName,
    handleSocialAuth,
    handleEmailAuth,
    toggleAuthMode,
  };
}
