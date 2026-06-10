import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetMedicineW } from "@/hooks/warehouse/useGetMedicineW";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WarehouseInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, error } = useGetMedicineW();
  const products = useMemo(() => data ?? [], [data]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      [product.name, product.company_name, product.strength, product.form]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [products, searchTerm]);

  const lowStockProducts = useMemo(
    () =>
      products.filter((product) => product.quantity > 0 && product.quantity < 5),
    [products],
  );

  const outOfStockProducts = useMemo(
    () => products.filter((product) => product.quantity === 0),
    [products],
  );

  return (
    <div className="min-h-screen p-8 space-y-8 text-[18px] bg-gradient-to-br from-white via-slate-200 to-blue-100 text-slate-900 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Warehouse Inventory
          </h1>

          <p className="text-slate-600 text-sm mt-1 dark:text-slate-300">
            Live stock levels across the warehouse
          </p>
        </div>

        <Link to="/warehouse/add-medicine">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Add Medicine
          </Button>
        </Link>
      </div>

      {/* STOCK CARDS */}
      <div className="grid grid-cols-2 gap-6">
        <Link to="/warehouse/low-stock">
          <div className="cursor-pointer bg-yellow-100 hover:bg-yellow-200 transition p-6 rounded-2xl shadow-md dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20">
            <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-300">
              Low Stock
            </h2>
            <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100">
              {lowStockProducts.length}
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Medicines below 5 items
            </p>
          </div>
        </Link>

        <Link to="/warehouse/out-of-stock">
          <div className="cursor-pointer bg-red-100 hover:bg-red-200 transition p-6 rounded-2xl shadow-md dark:bg-red-500/10 dark:hover:bg-red-500/20">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
              Out of Stock
            </h2>
            <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-slate-100">
              {outOfStockProducts.length}
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              Medicines finished
            </p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl dark:text-slate-400" />

        <input
          type="text"
          placeholder="Search medicine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Table */}
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
                <TableCell colSpan={7} className="p-8 text-center text-gray-500 dark:text-slate-400">
                  Loading medicines...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="p-8 text-center text-red-500 dark:text-red-400">
                  {error?.message || "Failed to load medicines."}
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-8 text-center text-gray-500 dark:text-slate-400">
                  No medicines found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <TableRow
                  key={product.id}
                  className={`transition hover:bg-[rgba(15,143,139,0.08)] dark:hover:bg-slate-800/70 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-gray-100 dark:bg-slate-900/60"
                  }`}
                >
                  <TableCell className="p-4 font-semibold">
                    {product.name}
                  </TableCell>
                  <TableCell className="p-4 font-medium text-blue-700 dark:text-blue-300">
                    {product.strength}
                  </TableCell>
                  <TableCell className="p-4 font-semibold">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="p-4">{product.company_name}</TableCell>
                  <TableCell className="p-4">{product.cost_price}</TableCell>
                  <TableCell className="p-4">
                    {product.default_sell_price}
                  </TableCell>
                  <TableCell className="p-4">{product.form}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
