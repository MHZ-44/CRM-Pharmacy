import { fetcher } from "@/api/fetcher";
import type { WarehouseMedicines } from "@/entities/Warehouse";
import { useQuery } from "@tanstack/react-query";

export const useGetMedicineInWarehouse = (id: string | null | undefined) => {
  const query = useQuery<
    WarehouseMedicines[],
    Error,
    {
      id: number;
      warehouse_id: number;
      available_quantity: number;
      sell_price_to_pharmacy: string;
      barcode: string;
      name: string;
      strength: string;
      company_name: string;
      form: string;
    }[]
  >({
    queryKey: ["warehouse-medicines", id],
    queryFn: () =>
      fetcher<WarehouseMedicines[]>(`/api/warehouses/${id}/products`),
    enabled: Boolean(id),
    select: (response) => {
      const warehouseMedicines = Array.isArray(response) ? response : [];

      return warehouseMedicines.map((medicine) => ({
        id: medicine.id,
        warehouse_id: medicine.warehouse_id,
        available_quantity: medicine.available_quantity,
        sell_price_to_pharmacy: medicine.sell_price_to_pharmacy,
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
