import { RedirectIfAuthenticatedRoute } from "@/shared/routes";
import SignupForm from "./SignupForm";

export default function Page() {
  return (
    <RedirectIfAuthenticatedRoute>
      <SignupForm />
    </RedirectIfAuthenticatedRoute>
  );
}
