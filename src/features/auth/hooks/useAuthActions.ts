import { authClient } from "@/shared/helper/auth/authClient";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { SignInFormValues, SignUpFormValues } from "@/features/auth/utils/form";
import { useSessionStore } from "@/shared/session";
import posthog from "posthog-js";

export const useAuthActions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading, setError } = useAuthStore();
  const { fetchSession } = useSessionStore();
  const isSignInPage = pathname === "/auth/login";

  const handleEmailAuth = async (data: SignInFormValues | SignUpFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const result = isSignInPage
        ? await authClient.signIn.email({
            email: data.email,
            password: data.password,
          })
        : await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: (data as SignUpFormValues).name,
          });

      if (result.error) {
        setError(result.error.message || "Authentication failed");
        setLoading(false);
        return;
      }

      // Identify user in PostHog after successful auth
      if (result.data?.user) {
        const user = result.data.user;
        posthog.identify(user.id, {
          email: user.email,
          name: user.name,
        });

        // Capture appropriate auth event
        if (isSignInPage) {
          posthog.capture("user_logged_in", {
            email: user.email,
            auth_method: "email",
          });
        } else {
          posthog.capture("user_signed_up", {
            email: user.email,
            auth_method: "email",
          });
        }
      }

      await fetchSession();
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      posthog.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setLoading(true);
    setError(null);

    // Capture social auth click event
    posthog.capture("social_auth_clicked", {
      provider: provider,
    });

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (result?.error) {
        setError(result.error.message || "Social authentication failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Social authentication failed");
      console.error(err);
      posthog.captureException(err);
      setLoading(false);
    }
  };

  const updateName = async (name: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.updateUser({ name });

      if (result.error) {
        setError(result.error.message || "Failed to update name");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        setError(result.error.message || "Password update failed");
      }
    } catch (err) {
      console.error(err);
      setError("Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (newEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.changeEmail({
        newEmail,
        callbackURL: `${window.location.origin}/email-verified`,
      });

      if (result.error) {
        setError(result.error.message || "Email update failed");
      }
    } catch (err) {
      console.error(err);
      setError("Email update failed");
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (result?.error) {
        setError(result.error.message || "Failed to send reset email");
      } else {
        // Capture password reset requested event
        posthog.capture("password_reset_requested", {
          email: email,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email");
      posthog.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.resetPassword({
        token,
        newPassword,
      });

      if (result?.error) {
        setError(result.error.message || "Password reset failed");
        return;
      }

      // Optional but good UX
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleEmailAuth,
    handleSocialAuth,
    updateName,
    changePassword,
    changeEmail,
    requestPasswordReset,
    resetPassword,
  };
};
