import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type CreateMedicinePayload = {
  barcode: string;
  name: string;
  strength: string;
  company_name: string;
  form: string;
  cost_price: number;
  default_sell_price: number;
  quantity: number;
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    CreateMedicinePayload
  >({
    mutationFn: (data: CreateMedicinePayload) =>
      post(`/api/pharmacy/products`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] });
    },
  });
  return mutation;
};
