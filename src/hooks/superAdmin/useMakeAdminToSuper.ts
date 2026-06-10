import { patch } from "@/api/mutator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useMakeAdminToSuper = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: string },
    AxiosError<{ error: string }>,
    number
  >({
    mutationFn: (id: number) =>
      patch(
        `/api/admins/${id}/make-super-admin`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  return mutation;
};
