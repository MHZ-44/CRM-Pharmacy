import { fetcher } from "@/api/fetcher";
import type { Warehouse } from "@/entities/Warehouse";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

export const useGetWarehouses = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/warehouses?${paramsString}`
    : "/api/warehouses";

  const query = useQuery<
    Warehouse[],
    Error,
    {
      id: number;
      warehouseName: string;
      ownerName: string;
      email: string;
      phone: string;
      adminAddIt: string;
      regionName: string;
      addedDate: string;
    }[]
  >({
    queryKey: ["warehouses", paramsString],
    queryFn: () => fetcher<Warehouse[]>(url),
    select: (response) => {
      const warehouses = Array.isArray(response) ? response : (response ?? []);

      return warehouses.map((warehouse) => ({
        id: warehouse.id,
        warehouseName: warehouse.warehouse_name,
        ownerName: warehouse.owner_name,
        email: warehouse.owner_email,
        phone: warehouse.owner_phone,
        adminAddIt: warehouse.admin.name,
        regionName: warehouse.region.name,
        addedDate: dayjs(warehouse.activated_at).format("YYYY-MM-DD"),
      }));
    },
  });

  return query;
};
