import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMedicine } from "@/hooks/pharmacy/useGetMedicine";

export default function PharmacyOutOfStockMedicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, error } = useGetMedicine();
  const medicines = useMemo(() => data ?? [], [data]);

  const outOfStockMedicines = useMemo(
    () => medicines.filter((medicine) => medicine.quantity === 0),
    [medicines],
  );

  const filteredMedicines = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return outOfStockMedicines;

    return outOfStockMedicines.filter((medicine) =>
      [medicine.name, medicine.company_name, medicine.strength, medicine.form]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [outOfStockMedicines, searchTerm]);

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Out of Stock Medicines
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Items with zero quantity available
          </p>
        </div>

        <Link
          to="/"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back to Medicines
        </Link>
      </div>

      <div className="relative w-full">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-slate-400" />
        <input
          type="text"
          placeholder="Search medicine..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border bg-white py-3 pl-12 pr-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Name</TableHead>
              <TableHead className="p-4 text-left">Strength</TableHead>
              <TableHead className="p-4 text-left">Quantity</TableHead>
              <TableHead className="p-4 text-left">Company</TableHead>
              <TableHead className="p-4 text-left">Cost Price</TableHead>
              <TableHead className="p-4 text-left">Sell Price</TableHead>
              <TableHead className="p-4 text-left">Form</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading medicines...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load medicines."}
                </TableCell>
              </TableRow>
            ) : filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No out of stock medicines found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((medicine, index) => (
                <TableRow
                  key={medicine.id}
                  className={`transition hover:bg-blue-50 dark:hover:bg-slate-800/70 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-gray-100 dark:bg-slate-900/60"
                  }`}
                >
                  <TableCell className="p-4 font-semibold">
                    {medicine.name}
                  </TableCell>
                  <TableCell className="p-4 font-medium text-blue-700 dark:text-blue-300">
                    {medicine.strength}
                  </TableCell>
                  <TableCell className="p-4 font-semibold text-red-700 dark:text-red-300">
                    {medicine.quantity}
                  </TableCell>
                  <TableCell className="p-4">{medicine.company_name}</TableCell>
                  <TableCell className="p-4">{medicine.cost_price}</TableCell>
                  <TableCell className="p-4">
                    {medicine.default_sell_price}
                  </TableCell>
                  <TableCell className="p-4">{medicine.form}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
