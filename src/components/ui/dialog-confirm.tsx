import type { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  title: string;
  description: string;
  confirmBtnLabel: string;
  confirmBtnClassName: string;
  onConfirm: () => void;
}

export const DialogConfirm = ({
  isOpen = false,
  setOpen,
  isLoading,
  title,
  description,
  confirmBtnLabel,
  confirmBtnClassName,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <Button
            className={cn(confirmBtnClassName, "cursor-pointer")}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmBtnLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
