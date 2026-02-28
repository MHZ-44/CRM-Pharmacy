import { fetcher } from "@/api/fetcher";
import type { Medicine } from "@/entities/Medicine";
import { useQuery } from "@tanstack/react-query";

export const useGetOneMedicine = (barcode: string | null | undefined) => {
  const query = useQuery<
    Medicine,
    Error,
    {
      id: number;
      barcode: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
    } | null
  >({
    queryKey: ["medicines", barcode],
    queryFn: () => fetcher<Medicine>(`/api/products/barcode/${barcode}`),
    enabled: Boolean(barcode),
    select: (response) => {
      const medicine = Array.isArray(response) ? response[0] : response;

      if (!medicine) return null;

      return {
        id: medicine.id,
        barcode: medicine.barcode,
        name: medicine.name,
        strength: medicine.strength,
        company_name: medicine.company_name,
        form: medicine.form,
      };
    },
  });

  return query;
};
