"use client";

import { useState } from "react";
import { useSession } from "@/shared/session/useSession";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { toast } from "sonner";
import posthog from "posthog-js";

export function useProfileLogic() {
  const { user } = useSession();
  const { updateName, changeEmail, changePassword } = useAuthActions();

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Update name & email ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update name if changed
      if (name !== user?.name) {
        await toast.promise(updateName(name), {
          loading: "Updating name...",
          success: "Name updated successfully!",
          error: "Failed to update name",
        });
      }

      // Update email if changed
      if (email !== user?.email) {
        await toast.promise(changeEmail(email), {
          loading: "Sending verification email...",
          success: "Check your inbox to verify the new email!",
          error: "Failed to update email",
        });
      }

      // Capture profile updated event
      posthog.capture("profile_updated", {
        name_changed: name !== user?.name,
        email_changed: email !== user?.email,
      });
    } catch (err) {
      toast.error("Something went wrong while updating profile.");
      console.error(err);
      posthog.captureException(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Update password ---
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await toast.promise(changePassword(currentPassword, newPassword), {
        loading: "Updating password...",
        success: "Password updated successfully!",
        error: "Failed to update password",
      });

      // Capture password changed event
      posthog.capture("password_changed");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      posthog.captureException(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    name,
    setName,
    email,
    setEmail,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleProfileUpdate,
    handlePasswordUpdate,
  };
}
