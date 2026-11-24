import { useMutation } from "@tanstack/react-query";
import { exportAdminWebsitePhoneNumbers } from "../api/exportAdminWebsitePhoneNumbers";

export const useExportAdminWebsitePhoneNumbers = () => {
  return useMutation({
    mutationFn: ({ type, status = "" }: { type: string; status?: string }) =>
      exportAdminWebsitePhoneNumbers({
        type,
        status,
      }),

    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "website-phone-numbers.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
