"use client";

import { useSession } from "@/shared/session/useSession";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { toast } from "sonner";
import posthog from "posthog-js";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef } from "react";

const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),

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

  const initializedUserId = useRef<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [watchedName, watchedEmail] = useWatch({
    control: form.control,
    name: ["name", "email"],
  });

  useEffect(() => {
    if (!user) return;

    const userId = user.id ?? user.email;

    if (initializedUserId.current === userId) return;

    initializedUserId.current = userId;

    form.reset({
      name: user.name || "",
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user?.id, user?.email, user?.name, form]);

  const hasProfileChanges =
    watchedName?.trim() !== (user?.name || "").trim() ||
    watchedEmail?.trim() !== (user?.email || "").trim();

  const onProfileUpdate = async (data: ProfileFormValues) => {
    try {
      const nameChanged = data.name.trim() !== (user?.name || "").trim();
      const emailChanged = data.email.trim() !== (user?.email || "").trim();

      if (!nameChanged && !emailChanged) {
        toast.info("No profile changes to save.");
        return;
      }

      if (nameChanged) {
        await toast.promise(updateName(data.name.trim()), {
          loading: "Updating name...",
          success: "Name updated successfully!",
          error: "Failed to update name",
        });
      }

      if (emailChanged) {
        await toast.promise(changeEmail(data.email.trim()), {
          loading: "Sending verification email...",
          success: "Check your inbox to verify the new email!",
          error: "Failed to update email",
        });
      }

      posthog.capture("profile_updated", {
        name_changed: nameChanged,
        email_changed: emailChanged,
      });

      form.reset({
        name: data.name.trim(),
        email: data.email.trim(),
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

  const onPasswordUpdate = async (data: ProfileFormValues) => {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
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

      posthog.capture("password_changed");

      form.reset({
        ...form.getValues(),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("Failed to update password");
      console.error(err);
      posthog.captureException(err);
    }
  };

  return {
    user,
    form,
    hasProfileChanges,
    onProfileUpdate,
    onPasswordUpdate,
  };
}
