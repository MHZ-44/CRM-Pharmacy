import { del } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useDeletePharmacy = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    string
  >({
    mutationFn: (id: string) =>
      del(`/api/pharmacies/${id}`, {
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
