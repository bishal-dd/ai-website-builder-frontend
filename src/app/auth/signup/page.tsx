import SignupForm from "@/features/auth/ui/SignupForm";
import { RedirectIfAuthenticatedRoute } from "@/shared/routes";

export default function Page() {
  return (
    <RedirectIfAuthenticatedRoute>
      <SignupForm />
    </RedirectIfAuthenticatedRoute>
  );
}
