import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeletePharmacy } from "@/hooks/superAdmin/useDeletePharmacy";
import { useGetPharmacies } from "@/hooks/superAdmin/useGetPharmacies";
import { Link } from "react-router-dom";

function SuperAdminPharmacies() {
  const { data, isLoading, isError, error } = useGetPharmacies();
  const { mutate: deletePharmacy, isPending: isDeleting } = useDeletePharmacy();
  const pharmacies = data ?? [];

  return (
    <div
      className="min-h-full w-full 
        bg-gradient-to-br from-white via-slate-200 to-blue-100
        dark:from-gray-900 dark:via-slate-900 dark:to-blue-950
        transition-colors duration-500"
    >
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* العنوان + زر الإضافة */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-800 dark:text-blue-300">
            Pharmacies
          </h1>
          <Link to={"create"}>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
            >
              Add Pharmacy
            </Button>
          </Link>
        </div>

        {/* الجدول */}
        <div className="w-full rounded-lg border bg-white dark:bg-gray-900 shadow-lg">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left text-blue-700 dark:text-blue-300">
              {isLoading
                ? "Loading pharmacies..."
                : isError
                ? "Failed to load pharmacies"
                : pharmacies.length === 0
                ? "No pharmacies found"
                : `Showing ${pharmacies.length} pharmacy${pharmacies.length === 1 ? "" : "ies"}`}
            </TableCaption>
            <TableHeader className="bg-blue-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[240px] px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Pharmacy Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Pharmacist Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Email
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Number
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Location
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Admin Add it
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Added Date
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-base text-blue-800 dark:text-blue-300">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-6 text-base text-muted-foreground">
                    Loading pharmacies...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-6 text-base text-destructive">
                    {error?.message || "Failed to load pharmacies."}
                  </TableCell>
                </TableRow>
              ) : pharmacies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-6 text-base text-muted-foreground">
                    No pharmacies found.
                  </TableCell>
                </TableRow>
              ) : (
                pharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy.id}>
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
                    <TableCell className="px-6 py-4 text-right">
                      <DeleteDialog
                        title="Delete pharmacy ?"
                        description="This action cannot be undone."
                        onConfirm={() => deletePharmacy(pharmacy.id.toString())}
                        isPending={isDeleting}
                        trigger={
                          <Button variant="destructive" size="xs">
                            Delete
                          </Button>
                        }
                      />
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

export default SuperAdminPharmacies;
