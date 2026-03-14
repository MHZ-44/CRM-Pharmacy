import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetWarehouses } from "@/hooks/superAdmin/useGetWarehouses";
import { useNavigate } from "react-router-dom";

function PharmacyShowWarehouses() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null,
  );
  const { data, isLoading, isError, error } = useGetWarehouses();
  const warehouses = useMemo(() => data ?? [], [data]);
  const filteredWarehouses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return warehouses;

    return warehouses.filter((warehouse) =>
      [
        warehouse.warehouseName,
        warehouse.ownerName,
        warehouse.email,
        warehouse.phone,
        warehouse.regionName,
        warehouse.adminAddIt,
        warehouse.addedDate,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [searchTerm, warehouses]);

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
          Warehouses
        </h1>
      </div>

      <div className="relative w-full">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-slate-400" />
        <input
          type="text"
          placeholder="Search warehouse..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border bg-white py-3 pl-12 pr-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[1100px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Warehouse Name</TableHead>
              <TableHead className="p-4 text-left">Owner Name</TableHead>
              <TableHead className="p-4 text-left">Email</TableHead>
              <TableHead className="p-4 text-left">Number</TableHead>
              <TableHead className="p-4 text-left">Location</TableHead>
              <TableHead className="p-4 text-left">Admin Add it</TableHead>
              <TableHead className="p-4 text-left">Added Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading warehouses...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load warehouses."}
                </TableCell>
              </TableRow>
            ) : filteredWarehouses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No warehouses found.
                </TableCell>
              </TableRow>
            ) : (
              filteredWarehouses.map((warehouse, index) => (
                <TableRow
                  key={warehouse.id}
                  onClick={() => {
                    setSelectedWarehouseId(warehouse.id);
                    navigate(`/pharmacy/warehouses/${warehouse.id}/medicines`);
                  }}
                  className={`cursor-pointer transition hover:bg-blue-50 dark:hover:bg-slate-800/70 ${
                    selectedWarehouseId === warehouse.id
                      ? "bg-blue-100 dark:bg-slate-800"
                      : index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-100 dark:bg-slate-900/60"
                  }`}
                >
                  <TableCell className="p-4 font-semibold">
                    {warehouse.warehouseName}
                  </TableCell>
                  <TableCell className="p-4 font-semibold">
                    {warehouse.ownerName}
                  </TableCell>
                  <TableCell className="p-4">{warehouse.email}</TableCell>
                  <TableCell className="p-4">{warehouse.phone}</TableCell>
                  <TableCell className="p-4">{warehouse.regionName}</TableCell>
                  <TableCell className="p-4">{warehouse.adminAddIt}</TableCell>
                  <TableCell className="p-4">{warehouse.addedDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default PharmacyShowWarehouses;
