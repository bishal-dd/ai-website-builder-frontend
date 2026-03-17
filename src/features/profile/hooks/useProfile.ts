"use client";

import { useSession } from "@/shared/session/useSession";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { toast } from "sonner";
import posthog from "posthog-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

// Validation schema for the combined form
const profileSchema = z
  .object({
    // Profile fields
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),

    // Password fields (optional for profile update)
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If any password field is filled, validate all password fields
      const hasPasswordFields =
        data.currentPassword || data.newPassword || data.confirmPassword;

      if (hasPasswordFields) {
        if (!data.currentPassword) return false;
        if (!data.newPassword) return false;
        if (!data.confirmPassword) return false;
        if (data.newPassword !== data.confirmPassword) return false;
      }

      return true;
    },
    {
      message: "All password fields are required and must match",
      path: ["confirmPassword"],
    },
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfileLogic() {
  const { user } = useSession();
  const { updateName, changeEmail, changePassword } = useAuthActions();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  // Handle profile updates (name + email)
  const onProfileUpdate = async (data: ProfileFormValues) => {
    try {
      // Update name if changed
      if (data.name !== user?.name) {
        await toast.promise(updateName(data.name), {
          loading: "Updating name...",
          success: "Name updated successfully!",
          error: "Failed to update name",
        });
      }

      // Update email if changed
      if (data.email !== user?.email) {
        await toast.promise(changeEmail(data.email), {
          loading: "Sending verification email...",
          success: "Check your inbox to verify the new email!",
          error: "Failed to update email",
        });
      }

      // Capture profile updated event
      posthog.capture("profile_updated", {
        name_changed: data.name !== user?.name,
        email_changed: data.email !== user?.email,
      });

      // Reset form with new values
      form.reset({
        name: data.name,
        email: data.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("Something went wrong while updating profile.");
      console.error(err);
      posthog.captureException(err);
    }
  };

  // Handle password updates
  const onPasswordUpdate = async (data: ProfileFormValues) => {
    // Ensure password fields are present
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    try {
      await toast.promise(
        changePassword(data.currentPassword, data.newPassword),
        {
          loading: "Updating password...",
          success: "Password updated successfully!",
          error: "Failed to update password",
        },
      );

      // Capture password changed event
      posthog.capture("password_changed");

      // Clear password fields
      form.reset({
        ...form.getValues(),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      posthog.captureException(err);
    }
  };

  return {
    user,
    form,
    onProfileUpdate,
    onPasswordUpdate,
  };
}
