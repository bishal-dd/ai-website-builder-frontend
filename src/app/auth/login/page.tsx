import { RedirectIfAuthenticatedRoute } from "@/shared/routes";
import SignInPage from "./LoginForm";

export default function Page() {
  return (
    <RedirectIfAuthenticatedRoute>
      <SignInPage />
    </RedirectIfAuthenticatedRoute>
  );
}
