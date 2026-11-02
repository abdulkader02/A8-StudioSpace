
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
import { notify } from "@/lib/notify";
import { getTokenFromClient } from "@/lib/getTokenFromClient";


type Props = {
  id: string;
  title: string;
  onDeleted: (id: string) => void;
};

const DeleteStudioDialog = ({ id, title, onDeleted }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

 const handleDeleteStudio = async () => {

  const token = await getTokenFromClient()

  if (isDeleting) {
    return;
  }

  setIsDeleting(true);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studio/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const result = (await response.json()) as {
      deletedCount?: number;
      message?: string;
    };

    if (!response.ok) {
      throw new Error(result.message || "Could not delete this studio.");
    }

    if (result?.deletedCount === 0) {
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
            className="h-10 border-red-200 bg-card px-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </Button>
        }
      >
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent className="border-border bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Delete this studio?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {title}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-border text-foreground"
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
