import { authClient } from "@/shared/helper/auth/authClient";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { SignInFormValues, SignUpFormValues } from "@/features/auth/utils/form";

export const useAuthActions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading, setError } = useAuthStore();

  const isSignInPage = pathname === "/auth/login";

  const handleEmailAuth = async (data: SignInFormValues | SignUpFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const result = isSignInPage
        ? await authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: "/dashboard",
          })
        : await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: (data as SignUpFormValues).name,
            callbackURL: "/dashboard",
          });

      if (result.error) {
        setError(result.error.message || "Authentication failed");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (result?.error) {
        setError(result.error.message || "Social authentication failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Social authentication failed");
      console.error(err);
      setLoading(false);
    }
  };

  return {
    handleEmailAuth,
    handleSocialAuth,
  };
};
