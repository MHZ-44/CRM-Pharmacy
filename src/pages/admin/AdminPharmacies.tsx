import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPharmacies } from "@/hooks/superAdmin/useGetPharmacies";
import { Link } from "react-router-dom";

function AdminPharmacies() {
  const { data, isLoading, isError, error } = useGetPharmacies();
  const pharmacies = data ?? [];

  return (
    <div
      className="min-h-full w-full 
        bg-gradient-to-br from-white via-slate-200 to-blue-100
        dark:from-gray-900 dark:via-slate-900 dark:to-blue-950
        transition-colors duration-500"
    >
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-800 dark:text-blue-300">
            Pharmacies
          </h1>
          <Link to={"create"}>
            <Button
              size="sm"
              className="bg-[#0f8f8b] text-white hover:bg-[#0c7d79] dark:bg-[#0f8f8b] dark:hover:bg-[#0c7d79]"
            >
              Add Pharmacy
            </Button>
          </Link>
        </div>

        <div className="w-full overflow-hidden rounded-lg border border-[#0f8f8b]/20 bg-white shadow-lg dark:border-[#0f8f8b]/30 dark:bg-gray-900">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left text-[#0f8f8b] dark:text-[#49c7c2]">
              {isLoading
                ? "Loading pharmacies..."
                : isError
                  ? "Failed to load pharmacies"
                  : pharmacies.length === 0
                    ? "No pharmacies found"
                    : `Showing ${pharmacies.length} pharmacy${pharmacies.length === 1 ? "" : "ies"}`}
            </TableCaption>
            <TableHeader className="bg-[#0f8f8b]/10 dark:bg-[#0f8f8b]/20">
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableHead className="w-[240px] px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Pharmacy Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Pharmacist Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Email
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Number
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Location
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Admin Add it
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Added Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-6 py-6 text-base text-muted-foreground"
                  >
                    Loading pharmacies...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-6 py-6 text-base text-destructive"
                  >
                    {error?.message || "Failed to load pharmacies."}
                  </TableCell>
                </TableRow>
              ) : pharmacies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-6 py-6 text-base text-muted-foreground"
                  >
                    No pharmacies found.
                  </TableCell>
                </TableRow>
              ) : (
                pharmacies.map((pharmacy) => (
                  <TableRow
                    key={pharmacy.id}
                    className="text-slate-800 hover:bg-[#0f8f8b]/5 data-[state=selected]:bg-[#0f8f8b]/10 dark:text-slate-100 dark:hover:bg-[#0f8f8b]/10"
                  >
                    <TableCell className="px-6 py-4 text-base font-medium text-[#0f8f8b] dark:text-[#49c7c2]">
                      {pharmacy.pharmacyName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base font-medium text-slate-900 dark:text-slate-100">
                      {pharmacy.doctorName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-slate-600 dark:text-slate-300">
                      {pharmacy.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {pharmacy.phone}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {pharmacy.regionName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {pharmacy.adminAddIt}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {pharmacy.addedDate}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdminPharmacies;
