import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PharmacyExpenseInvoiceDetails() {
  const { invoiceId } = useParams();
  const items = useMemo(
    () => [
      {
        id: 1,
        name: "Shelf labels",
        quantity: 10,
        unit_price: 1.5,
        line_total: 15,
      },
      {
        id: 2,
        name: "Packaging bags",
        quantity: 50,
        unit_price: 0.2,
        line_total: 10,
      },
    ],
    [],
  );

  const total = items.reduce((sum, item) => sum + item.line_total, 0);
  const createdAt = "2026-03-12";

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Expense Invoice #{invoiceId}
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Invoice details
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Created Date
          </p>
          <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
            {createdAt}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Item</TableHead>
              <TableHead className="p-4 text-left">Quantity</TableHead>
              <TableHead className="p-4 text-left">Unit Price</TableHead>
              <TableHead className="p-4 text-left">Line Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={item.id}
                className={`transition hover:bg-blue-50 dark:hover:bg-slate-800/70 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-900"
                    : "bg-gray-100 dark:bg-slate-900/60"
                }`}
              >
                <TableCell className="p-4 font-semibold">
                  {item.name}
                </TableCell>
                <TableCell className="p-4">{item.quantity}</TableCell>
                <TableCell className="p-4">{item.unit_price}</TableCell>
                <TableCell className="p-4">{item.line_total}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-blue-50 font-semibold dark:bg-slate-800/60">
              <TableCell className="p-4" colSpan={3}>
                Total
              </TableCell>
              <TableCell className="p-4">{total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
