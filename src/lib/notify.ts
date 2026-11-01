import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils";

/** Shared toast helpers so every workflow uses the same Sonner setup. */
export const notify = {
  success(message: string) {
    toast.success(message);
  },

  error(message: string) {
    toast.error(message);
  },

  apiError(error: unknown, fallback: string) {
    toast.error(getErrorMessage(error, fallback));
  },
};
