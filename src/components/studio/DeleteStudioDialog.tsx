
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { apiJson } from "@/lib/api";
import { notify } from "@/lib/notify";

type Props = {
  id: string;
  title: string;
  onDeleted: (id: string) => void;
};

const DeleteStudioDialog = ({ id, title, onDeleted }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDeleteStudio = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await apiJson<{
        success?: boolean;
        message?: string;
        deletedCount?: number;
      }>(`/studio/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (result?.success === false) {
        throw new Error(result.message || "Could not delete this studio.");
      }

      if (
        typeof result?.deletedCount === "number" &&
        result.deletedCount === 0
      ) {
        throw new Error("This studio no longer exists.");
      }

      notify.success("Studio deleted successfully!");

      onDeleted(id);
      setOpen(false);
    } catch (error) {
      console.error("Delete Studio Error:", error);
      notify.apiError(error, "Could not delete studio. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          setOpen(nextOpen);
        }
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 border-red-200 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </Button>
        }
      >
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent className="border-brand-border bg-brand-ivory">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-brand-charcoal">
            Delete this studio?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-brand-stone">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-brand-charcoal">
              {title}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-brand-border text-brand-charcoal"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDeleteStudio();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Spinner className="mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Studio
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStudioDialog;
