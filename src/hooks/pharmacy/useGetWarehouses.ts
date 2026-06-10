import { fetcher } from "@/api/fetcher";
import type { Warehouse } from "@/entities/Warehouse";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const useGetWarehouses = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/pharmacy/warehouses?${paramsString}`
    : "/api/pharmacy/warehouses";

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
      averageRating: number;
      ratingsCount: number;
      hasRated: boolean;
      userRating: number;
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
        adminAddIt: warehouse.admin?.name ?? "",
        regionName: warehouse.region?.name ?? "",
        addedDate: dayjs(warehouse.activated_at).format("YYYY-MM-DD"),
        averageRating: toNumber(
          warehouse.average_rating ?? warehouse.avg_rating ?? warehouse.rating,
        ),
        ratingsCount: toNumber(
          warehouse.ratings_count ??
            warehouse.rating_count ??
            warehouse.raters_count,
        ),
        hasRated: Boolean(warehouse.has_rated),
        userRating: toNumber(warehouse.user_rating ?? warehouse.my_rating),
      }));
    },
  });

  return query;
};
