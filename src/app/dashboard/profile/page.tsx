import ProfileUIPage from "@/features/profile/ProfilePage";
import { ProtectedRoute } from "@/shared/routes";
import React from "react";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileUIPage />
    </ProtectedRoute>
  );
}
