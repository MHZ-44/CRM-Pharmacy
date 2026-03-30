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

type Product = {
  id: number;
  name: string;
  quantity: number;
  company: string;
  price: number;
  expiryDate: string;
  strength?: string;
};

export default function WarehouseOutOfStockMedicine() {
  const [searchTerm, setSearchTerm] = useState("");

  const medicines: Product[] = [
    { id: 1, name: "Paracetamol", quantity: 3, company: "Pfizer", price: 2.5, expiryDate: "2026-05-01", strength: "500mg" },
    { id: 2, name: "Amoxicillin", quantity: 0, company: "Novartis", price: 4, expiryDate: "2025-08-10", strength: "250mg" },
    { id: 3, name: "Ibuprofen", quantity: 2, company: "Bayer", price: 3.2, expiryDate: "2026-02-15", strength: "400mg" },
    { id: 4, name: "Ciprofloxacin", quantity: 18, company: "Roche", price: 5.5, expiryDate: "2025-11-20", strength: "500mg" },
    { id: 5, name: "Vitamin C", quantity: 0, company: "Jamieson", price: 6, expiryDate: "2027-01-10", strength: "1000mg" },
    { id: 6, name: "Metformin", quantity: 4, company: "Sanofi", price: 7, expiryDate: "2026-07-07", strength: "850mg" },
  ];

  const outOfStockMedicines = useMemo(
    () => medicines.filter((medicine) => medicine.quantity === 0),
    [medicines]
  );

  const filteredMedicines = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return outOfStockMedicines;

    return outOfStockMedicines.filter((medicine) =>
      [medicine.name, medicine.company, medicine.strength]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [outOfStockMedicines, searchTerm]);

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-slate-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
            Out of Stock Medicines
          </h1>

          <p className="text-red-600 text-sm mt-1 dark:text-red-400">
            Medicines finished in the warehouse
          </p>
        </div>

        <Link
          to="/warehouse/inventory"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back to Inventory
        </Link>
      </div>

      {/* Search */}

      <div className="relative w-full">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-slate-400" />

        <input
          type="text"
          placeholder="Search medicine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border bg-white py-3 pl-12 pr-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">

        <Table className="min-w-[900px] border-collapse text-base">

        <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Name</TableHead>
              <TableHead className="p-4 text-left">Strength</TableHead>
              <TableHead className="p-4 text-left">Quantity</TableHead>
              <TableHead className="p-4 text-left">Company</TableHead>
              <TableHead className="p-4 text-left">Price</TableHead>
              <TableHead className="p-4 text-left">Expiry</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No out of stock medicines found
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

                  <TableCell className="p-4 font-semibold text-red-700">
                    {medicine.quantity}
                  </TableCell>

                  <TableCell className="p-4">
                    {medicine.company}
                  </TableCell>

                  <TableCell className="p-4">
                    {medicine.price}
                  </TableCell>

                  <TableCell className="p-4">
                    {medicine.expiryDate}
                  </TableCell>

                </TableRow>
              ))
            )}

          </TableBody>

        </Table>

      </div>
    </div>
  );
}
