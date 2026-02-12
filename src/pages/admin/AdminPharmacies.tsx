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
    <div className="min-h-full w-full bg-muted/30">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Pharmacies</h1>
          <Link to={"create"}>
            <Button size="sm">Add Pharmacy</Button>
          </Link>
        </div>

        <div className="w-full rounded-lg border bg-card shadow-sm">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left">
              {isLoading
                ? "Loading pharmacies..."
                : isError
                  ? "Failed to load pharmacies"
                  : pharmacies.length === 0
                    ? "No pharmacies found"
                    : `Showing ${pharmacies.length} pharmacy${pharmacies.length === 1 ? "" : "ies"}`}
            </TableCaption>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableHead className="w-[240px] px-6 py-4 text-base">
                  Pharmacy Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base">
                  Pharmacist Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base">Email</TableHead>
                <TableHead className="px-6 py-4 text-base">Number</TableHead>
                <TableHead className="px-6 py-4 text-base">Location</TableHead>
                <TableHead className="px-6 py-4 text-base">
                  Admin Add it
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-base">
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
                    className="hover:bg-transparent data-[state=selected]:bg-transparent"
                  >
                    <TableCell className="px-6 py-4 text-base font-medium">
                      {pharmacy.pharmacyName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base font-medium">
                      {pharmacy.doctorName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-muted-foreground">
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
