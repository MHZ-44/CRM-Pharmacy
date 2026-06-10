import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type ConfirmOrderAssistantPayload = {
  warehouse_id: number;
  items: {
    barcode: string;
    quantity: number;
  }[];
};

export const useConfirmOrderAssistant = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    ConfirmOrderAssistantPayload
  >({
    mutationFn: (data) =>
      post(`/api/pharmacy/order-assistant/apply`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "status"] });
      queryClient.invalidateQueries({ queryKey: ["order-assistant"] });
    },
  });
  return mutation;
};
