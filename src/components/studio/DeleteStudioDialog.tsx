
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

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

type Props = {
  id: string;
  title: string;
  onDeleted: (id: string) => void;
};

const DeleteStudioDialog = ({ id, title, onDeleted }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDeleteStudio = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/studio/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete studio");
      }

      toast.success("Studio deleted successfully!");

      onDeleted(id);
      setOpen(false);
    } catch (error) {
      console.error("Delete Studio Error:", error);
      toast.error("Could not delete studio. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
