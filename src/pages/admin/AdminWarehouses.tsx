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
import { useGetWarehouses } from "@/hooks/superAdmin/useGetWarehouses";
import { Link } from "react-router-dom";

function AdminWarehouses() {
  const { data, isLoading, isError, error } = useGetWarehouses();
  const warehouses = data ?? [];

  return (
    <div className="min-h-full w-full bg-muted/30">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Warehouses</h1>
          <Link to={"create"}>
            <Button size="sm">Add Warehouse</Button>
          </Link>
        </div>

        <div className="w-full rounded-lg border bg-card shadow-sm">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left">
              {isLoading
                ? "Loading warehouses..."
                : isError
                  ? "Failed to load warehouses"
                  : warehouses.length === 0
                    ? "No warehouses found"
                    : `Showing ${warehouses.length} warehouse${warehouses.length === 1 ? "" : "s"}`}
            </TableCaption>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableHead className="w-[240px] px-6 py-4 text-base">
                  Warehouse Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base">
                  Owner Name
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
                    Loading warehouses...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-6 py-6 text-base text-destructive"
                  >
                    {error?.message || "Failed to load warehouses."}
                  </TableCell>
                </TableRow>
              ) : warehouses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-6 py-6 text-base text-muted-foreground"
                  >
                    No warehouses found.
                  </TableCell>
                </TableRow>
              ) : (
                warehouses.map((warehouse) => (
                  <TableRow
                    key={warehouse.id}
                    className="hover:bg-transparent data-[state=selected]:bg-transparent"
                  >
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

export default AdminWarehouses;
