import { fetcher } from "@/api/fetcher";
import type { Pharmacy } from "@/entities/Pharmacy";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

export const useGetPharmacies = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/pharmacies?${paramsString}`
    : "/api/pharmacies";
  const query = useQuery<
    Pharmacy[],
    Error,
    {
      id: number;
      pharmacyName: string;
      doctorName: string;
      email: string;
      phone: string;
      adminAddIt: string;
      regionName: string;
      addedDate: string;
    }[]
  >({
    queryKey: ["pharmacies", paramsString],
    queryFn: () => fetcher<Pharmacy[]>(url),
    select: (response) => {
      const pharmacies = Array.isArray(response) ? response : (response ?? []);

      return pharmacies.map((pharmacy) => ({
        id: pharmacy.id,
        pharmacyName: pharmacy.pharmacy_name,
        doctorName: pharmacy.doctor_name,
        email: pharmacy.doctor_email,
        phone: pharmacy.doctor_phone,
        adminAddIt: pharmacy.admin.name,
        regionName: pharmacy.region.name,
        addedDate: dayjs(pharmacy.activated_at).format("YYYY-MM-DD"),
      }));
    },
  });

  return query;
};
