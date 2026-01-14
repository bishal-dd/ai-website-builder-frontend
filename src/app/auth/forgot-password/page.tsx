import ForgotPasswordForm from "@/features/auth/ui/ForgotPasswordForm";
import { RedirectIfAuthenticatedRoute } from "@/shared/routes";

export default function Page() {
  return (
    <RedirectIfAuthenticatedRoute>
      <ForgotPasswordForm />
    </RedirectIfAuthenticatedRoute>
  );
}
