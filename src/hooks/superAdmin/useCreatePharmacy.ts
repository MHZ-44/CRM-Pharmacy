import { post } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type CreatePharmacyPayload = {
  pharmacy_name: string;
  doctor_name: string;
  doctor_phone: string;
  doctor_email: string;
  password: string;
  region_id: number;
};

export const useCreatePharmacy = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    CreatePharmacyPayload
  >({
    mutationFn: (data: CreatePharmacyPayload) =>
      post(`/api/pharmacies`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
    },
  });
  return mutation;
};
