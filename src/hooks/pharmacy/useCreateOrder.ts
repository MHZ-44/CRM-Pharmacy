import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    void
  >({
    mutationFn: () =>
      post(
        `/api/pharmacy/order-cart/checkout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    onSuccess: () => {
      queryClient.setQueryData(["cart"], []);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return mutation;
};
