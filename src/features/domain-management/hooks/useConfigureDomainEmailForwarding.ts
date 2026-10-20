import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  configureDomainEmailForwarding,
  type ConfigureDomainEmailForwardingInput,
} from "../api/configureDomainEmailForwarding";

interface ConfigureEmailForwardingVariables {
  domainId: string;
  data: ConfigureDomainEmailForwardingInput;
}

export const useConfigureDomainEmailForwarding = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, data, isPending, error, isSuccess, reset } =
    useMutation({
      mutationFn: ({ domainId, data }: ConfigureEmailForwardingVariables) =>
        configureDomainEmailForwarding(domainId, data),

      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["domain-email-forwarding", variables.domainId],
        });
      },
    });

  return {
    configureEmailForwarding: mutate,
    configureEmailForwardingAsync: mutateAsync,
    forwardingData: data,
    isConfiguring: isPending,
    error,
    isSuccess,
    reset,
  };
};
