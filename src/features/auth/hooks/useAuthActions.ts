import { authClient } from "@/shared/helper/auth/authClient";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { AuthFormValues } from "@/features/auth/utils/form";

export const useAuthActions = () => {
  const router = useRouter();

  const { isSignIn, setLoading, setError } = useAuthStore();

  const handleEmailAuth = async (data: AuthFormValues) => {
    setLoading(true);
    setError(null);

    const result = isSignIn
      ? await authClient.signIn.email({
          email: data.email,
          password: data.password,
        })
      : await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: "user",
        });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/wizard");
  };

  const handleSocialAuth = async (provider: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "http://localhost:3000/wizard",
      });

      if (result?.error) {
        setError(result.error.message);
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
