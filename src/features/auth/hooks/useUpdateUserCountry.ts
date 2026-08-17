import { useMutation } from "@tanstack/react-query";
import { updateUserCountry } from "../api/updateUserCountry";

export const useUpdateUserCountry = () => {
  return useMutation({
    mutationFn: updateUserCountry,
  });
};
