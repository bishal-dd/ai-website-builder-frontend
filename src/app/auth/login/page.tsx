import LoginForm from "@/features/auth/ui/LoginForm";
import { RedirectIfAuthenticatedRoute } from "@/shared/routes";
import { PostLoginRedirect } from "@/shared/routes/PostLoginRedirect";

export default function Page() {
  return (
    <RedirectIfAuthenticatedRoute>
      <PostLoginRedirect />
      <LoginForm />
    </RedirectIfAuthenticatedRoute>
  );
}
