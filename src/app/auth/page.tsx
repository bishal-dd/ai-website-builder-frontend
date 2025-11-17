import AuthenticationPage from "../../features/auth/AuthenticationPage";
import { RedirectIfAuthenticatedRoute } from "@/shared/routes";

export default function AuthPage() {
  return (
    <RedirectIfAuthenticatedRoute>
      <AuthenticationPage />
    </RedirectIfAuthenticatedRoute>
  );
}
