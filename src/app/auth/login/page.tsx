import LoginForm from "@/features/auth/ui/LoginForm";
import { RedirectIfAuthenticatedRoute } from "@/shared/routes";

export default function Page() {
  return (
    <RedirectIfAuthenticatedRoute>
      <LoginForm />
    </RedirectIfAuthenticatedRoute>
  );
}
