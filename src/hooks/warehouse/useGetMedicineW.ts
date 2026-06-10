import { fetcher } from "@/api/fetcher";
import type { Medicine } from "@/entities/Medicine";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export const useGetMedicineW = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/warehouse/products?${paramsString}`
    : "/api/warehouse/products";

  const query = useQuery<
    Medicine[],
    Error,
    {
      id: number;
      quantity: number;
      cost_price: string;
      default_sell_price: string;
      barcode: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
    }[]
  >({
    queryKey: ["warehouse", paramsString],
    queryFn: () => fetcher<Medicine[]>(url),
    select: (response) => {
      const pharmacyMedicine = Array.isArray(response)
        ? response
        : (response ?? []);

      return pharmacyMedicine.map((medicine) => ({
        id: medicine.id,
        quantity: medicine.quantity,
        cost_price: medicine.cost_price,
        default_sell_price: medicine.default_sell_price,
        barcode: medicine.product.barcode,
        name: medicine.product.name,
        strength: medicine.product.strength,
        company_name: medicine.product.company_name,
        form: medicine.product.form,
      }));
    },
  });

  return query;
};
