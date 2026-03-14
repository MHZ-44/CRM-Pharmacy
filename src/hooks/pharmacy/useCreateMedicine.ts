import { post } from "@/api/mutator";
import type { Medicine } from "@/entities/Medicine";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    Medicine & {
      barcode: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
    }
  >({
    mutationFn: (
      data: Medicine & {
        barcode: string;
        name: string;
        strength: string;
        company_name: string;
        form: string;
      },
    ) =>
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
