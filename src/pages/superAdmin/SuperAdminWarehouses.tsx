import DeleteDialog from "@/components/DeleteDialog";
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
import { useDeleteWarehouses } from "@/hooks/superAdmin/useDeleteWarehouses";
import { useGetWarehouses } from "@/hooks/superAdmin/useGetWarehouses";
import { Link } from "react-router-dom";

function SuperAdminWarehouses() {
  const { data, isLoading, isError, error } = useGetWarehouses();
  const { mutate: deleteWarehouse, isPending: isDeleting } = useDeleteWarehouses();
  const warehouses = data ?? [];

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
            Warehouses
          </h1>
          <Link to={"create"}>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
            >
              Add Warehouse
            </Button>
          </Link>
        </div>

        {/* الجدول */}
        <div className="w-full rounded-lg border bg-white dark:bg-gray-900 shadow-lg">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left text-blue-700 dark:text-blue-300">
              {isLoading
                ? "Loading warehouses..."
                : isError
                ? "Failed to load warehouses"
                : warehouses.length === 0
                ? "No warehouses found"
                : `Showing ${warehouses.length} warehouse${warehouses.length === 1 ? "" : "s"}`}
            </TableCaption>
            <TableHeader className="bg-blue-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[240px] px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Warehouse Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Owner Name
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
                    Loading warehouses...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-6 text-base text-destructive">
                    {error?.message || "Failed to load warehouses."}
                  </TableCell>
                </TableRow>
              ) : warehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-6 text-base text-muted-foreground">
                    No warehouses found.
                  </TableCell>
                </TableRow>
              ) : (
                warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="px-6 py-4 text-base font-medium">
                      {warehouse.warehouseName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base font-medium">
                      {warehouse.ownerName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-muted-foreground">
                      {warehouse.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {warehouse.phone}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {warehouse.regionName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {warehouse.adminAddIt}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {warehouse.addedDate}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DeleteDialog
                        title="Delete warehouse ?"
                        description="This action cannot be undone."
                        onConfirm={() => deleteWarehouse(warehouse.id.toString())}
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

export default SuperAdminWarehouses;
