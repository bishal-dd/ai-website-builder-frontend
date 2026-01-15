import ResetPasswordForm from "@/features/auth/ui/ResetPasswordForm";
import { RedirectIfAuthenticatedRoute } from "@/shared/routes";

export default function Page() {
  return (
    <RedirectIfAuthenticatedRoute>
      <ResetPasswordForm />
    </RedirectIfAuthenticatedRoute>
  );
}
