import { useMemo, useState } from "react";
import { BarcodeFormat } from "@zxing/browser";
import { FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import BarcodeScanner from "@/components/BarcodeScanner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateSalesCart } from "@/hooks/pharmacy/useCreateSalesCart";
import { useGetSalesCart } from "@/hooks/pharmacy/useGetSalesCart";
import { useUpdateQuantitySales } from "@/hooks/pharmacy/useUpdateQuantitySales";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const PRODUCT_BARCODE_LENGTHS = [13];
const PRODUCT_BARCODE_FORMATS = [BarcodeFormat.EAN_13];

export default function PharmacySales() {
  const [showScanner, setShowScanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const { mutate: createSalesCart, isPending } = useCreateSalesCart();
  const { mutate: updateQuantitySales, isPending: isUpdating } =
    useUpdateQuantitySales();
  const { data, isLoading, isError, error } = useGetSalesCart();
  const rows = useMemo(() => data ?? [], [data]);

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      [row.barcode, row.name, row.company_name, row.strength, row.form]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [rows, searchTerm]);

  const totals = useMemo(() => {
    const totalQuantity = rows.reduce(
      (sum, item) => sum + (item.quantity ?? 0),
      0,
    );
    const totalAmount = rows.reduce(
      (sum, item) => sum + (item.line_total ?? 0),
      0,
    );
    return {
      totalQuantity,
      totalAmount,
      totalItems: rows.length,
    };
  }, [rows]);

  const addBarcode = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const existing = rows.find((row) => row.barcode === trimmed);
    if (existing) {
      updateQuantitySales(
        { barcode: trimmed, quantity: existing.quantity + 1 },
        {
          onSuccess: () => {
            setBarcodeInput("");
          },
          onError: (mutationError) => {
            toast.error(
              getApiErrorMessage(
                mutationError,
                "Failed to update quantity.",
              ),
            );
          },
        },
      );
      return;
    }

    createSalesCart(
      { barcode: trimmed },
      {
        onSuccess: () => {
          setBarcodeInput("");
        },
        onError: (mutationError) => {
          toast.error(
            getApiErrorMessage(mutationError, "Failed to add barcode."),
          );
        },
      },
    );
  };

  const handleScan = (value: string) => {
    addBarcode(value);
    setShowScanner(false);
  };

  const handleManualAdd = () => {
    addBarcode(barcodeInput);
  };

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Pharmacy Sales
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Scan barcodes to build the sales cart
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search scanned items..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-2xl border bg-white py-3 pl-12 pr-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Items</p>
          <p className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
            {totals.totalItems}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Quantity
          </p>
          <p className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
            {totals.totalQuantity}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Amount
          </p>
          <p className="text-2xl font-semibold text-blue-800 dark:text-blue-200">
            {totals.totalAmount}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[260px]">
          <label className="text-sm text-blue-700 dark:text-blue-300">
            Barcode
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            <input
              type="text"
              value={barcodeInput}
              onChange={(event) => setBarcodeInput(event.target.value)}
              placeholder="Scan or enter barcode"
              className="w-full flex-1 rounded-2xl border bg-white py-3 px-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <Button
              type="button"
              variant={showScanner ? "secondary" : "outline"}
              onClick={() => setShowScanner((value) => !value)}
            >
              {showScanner ? "Close Scanner" : "Scan Barcode"}
            </Button>
            <Button
              type="button"
              onClick={handleManualAdd}
              disabled={!barcodeInput.trim() || isPending || isUpdating}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
            >
              {isPending || isUpdating ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </div>

      {showScanner && (
        <div className="w-full max-w-xs rounded-md border bg-background p-3">
          <BarcodeScanner
            requireNumeric
            minLength={8}
            confirmReads={2}
            stabilizeMs={800}
            allowedLengths={PRODUCT_BARCODE_LENGTHS}
            possibleFormats={PRODUCT_BARCODE_FORMATS}
            onScan={handleScan}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Name</TableHead>
              <TableHead className="p-4 text-left">Strength</TableHead>
              <TableHead className="p-4 text-left">Quantity</TableHead>
              <TableHead className="p-4 text-left">Unit Price</TableHead>
              <TableHead className="p-4 text-left">Line Total</TableHead>
              <TableHead className="p-4 text-left">Form</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading medicines...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load medicines."}
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Scan a barcode to add items.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filteredRows.map((row, index) => (
                  <TableRow
                    key={`${row.cart_id}-${row.name}-${index}`}
                    className={`transition hover:bg-blue-50 dark:hover:bg-slate-800/70 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-100 dark:bg-slate-900/60"
                    }`}
                  >
                    <TableCell className="p-4 font-semibold">
                      {row.name}
                    </TableCell>
                    <TableCell className="p-4 font-medium text-blue-700 dark:text-blue-300">
                      {row.strength}
                    </TableCell>
                    <TableCell className="p-4 font-semibold">
                      {row.quantity}
                    </TableCell>
                    <TableCell className="p-4">
                      {row.default_unit_price}
                    </TableCell>
                    <TableCell className="p-4">{row.line_total}</TableCell>
                    <TableCell className="p-4">{row.form}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-blue-50 font-semibold dark:bg-slate-800/60">
                  <TableCell className="p-4" colSpan={4}>
                    Total
                  </TableCell>
                  <TableCell className="p-4">{totals.totalAmount}</TableCell>
                  <TableCell className="p-4" />
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
