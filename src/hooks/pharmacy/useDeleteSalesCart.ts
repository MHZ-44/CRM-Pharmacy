import { del } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useDeleteSalesCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    void
  >({
    mutationFn: () =>
      del(`/api/pharmacy/sales-cart`, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sCart"] });
    },
  });

  return mutation;
};
