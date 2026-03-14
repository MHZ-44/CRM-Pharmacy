import { patch } from "@/api/mutator";
import type { Cart } from "@/entities/Cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    Pick<Cart, "warehouse_id"> & Pick<Cart["items"], "barcode" | "quantity">
  >({
    mutationFn: (
      data: Pick<Cart, "warehouse_id"> &
        Pick<Cart["items"], "barcode" | "quantity">,
    ) =>
      patch(`/api/pharmacy/order-cart/items/${data.barcode}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return mutation;
};
