"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteName: string;
  onConfirm: () => void;
  loading: boolean;
}

export function CreateTemplateDialog({
  open,
  onOpenChange,
  websiteName,
  onConfirm,
  loading,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Create template?</AlertDialogTitle>

          <AlertDialogDescription>
            This will save{" "}
            <span className="font-medium text-foreground">{websiteName}</span>{" "}
            as a reusable website template. You can use this template to create
            new websites later.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {loading ? "Creating..." : "Create Template"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
