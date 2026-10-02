import { useMutation } from "@tanstack/react-query";
import { exportAdminUserEmails } from "../api/exportAdminUserEmails";

export const useExportAdminUserEmails = () => {
  return useMutation({
    mutationFn: ({
      search = "",
      status = "",
      date,
      startDate,
      endDate,
    }: {
      search?: string;
      status?: string;
      date?: string;
      startDate?: string;
      endDate?: string;
    }) =>
      exportAdminUserEmails({
        search,
        status,
        date,
        startDate,
        endDate,
      }),

    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "user-emails.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
