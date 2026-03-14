import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetMedicineInWarehouse } from "@/hooks/pharmacy/useGetMedicineInWarehouse";
import { useCreateCart } from "@/hooks/pharmacy/useCreateCart";
import { useGetCartStatus } from "@/hooks/pharmacy/useGetCart";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export default function PharmacyWarehouseMedicines() {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const { mutate: addToCart, isPending } = useCreateCart();
  const { data: cartStatus } = useGetCartStatus();
  const { data, isLoading, isError, error } = useGetMedicineInWarehouse(
    warehouseId,
  );
  const medicines = useMemo(() => data ?? [], [data]);
  const hasCart = cartStatus?.cartExists ?? false;
  const cartCount = cartStatus?.hasItems ? 1 : 0;

  const filteredMedicines = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return medicines;

    return medicines.filter((medicine) =>
      [medicine.name, medicine.company_name, medicine.strength, medicine.form]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [medicines, searchTerm]);

  const handleQuantityChange = (medicineId: number, value: string) => {
    setQuantities((prev) => ({ ...prev, [medicineId]: value }));
  };

  const handleAddToCart = (
    medicineId: number,
    barcode: string,
    maxQuantity: number,
  ) => {
    const warehouseIdNumber = Number.parseInt(warehouseId ?? "", 10);
    const selectedQuantity = Number.parseInt(quantities[medicineId] ?? "1", 10);

    if (!warehouseIdNumber || Number.isNaN(warehouseIdNumber)) {
      toast.error("Warehouse id is invalid.");
      return;
    }

    if (Number.isNaN(selectedQuantity) || selectedQuantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (selectedQuantity > maxQuantity) {
      toast.error("Requested quantity is more than available stock.");
      return;
    }

    addToCart(
      {
        warehouse_id: warehouseIdNumber,
        barcode,
        quantity: selectedQuantity,
      },
      {
        onSuccess: () => {
          toast.success("Added to cart.");
        },
        onError: (mutationError) => {
          toast.error(
            getApiErrorMessage(mutationError, "Failed to add to cart."),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
          Warehouse Medicines
        </h1>
        {hasCart && (
          <Button
            type="button"
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
            onClick={() => navigate("/pharmacy/cart")}
          >
            Go to Cart
          </Button>
        )}
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
              <TableHead className="p-4 text-left">Sell Price</TableHead>
              <TableHead className="p-4 text-left">Form</TableHead>
              <TableHead className="p-4 text-left">Choose Quantity</TableHead>
              <TableHead className="p-4 text-left">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading medicines...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load medicines."}
                </TableCell>
              </TableRow>
            ) : filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No medicines found.
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
                  <TableCell className="p-4 font-semibold">
                    {medicine.available_quantity}
                  </TableCell>
                  <TableCell className="p-4">{medicine.company_name}</TableCell>
                  <TableCell className="p-4">
                    {medicine.sell_price_to_pharmacy}
                  </TableCell>
                  <TableCell className="p-4">{medicine.form}</TableCell>
                  <TableCell className="p-4">
                    <input
                      type="number"
                      min={1}
                      max={medicine.available_quantity}
                      value={quantities[medicine.id] ?? "1"}
                      onChange={(event) =>
                        handleQuantityChange(medicine.id, event.target.value)
                      }
                      className="w-24 rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </TableCell>
                  <TableCell className="p-4">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isPending || medicine.available_quantity <= 0}
                      onClick={() =>
                        handleAddToCart(
                          medicine.id,
                          medicine.barcode,
                          medicine.available_quantity,
                        )
                      }
                      className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
                    >
                      Add
                    </Button>
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
