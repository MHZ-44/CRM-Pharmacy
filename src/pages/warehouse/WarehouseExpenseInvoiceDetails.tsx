import { Link, useParams } from "react-router-dom";
import { useGetOneExpenseInvoiceW } from "@/hooks/warehouse/useGetOneExpenseInvoicesW";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WarehouseExpenseInvoiceDetails() {
  const { invoiceId } = useParams();
  const numericInvoiceId = Number(invoiceId);
  const {
    data: invoice,
    isLoading,
    isError,
    error,
  } = useGetOneExpenseInvoiceW(
    Number.isFinite(numericInvoiceId) ? numericInvoiceId : null,
  );

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Expense Invoice Details
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Warehouse expense invoice details
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/warehouse/invoices/expenses"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back to Invoices
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Created Date
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {invoice?.created_at ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Created By</TableHead>
              <TableHead className="p-4 text-left">Description</TableHead>
              <TableHead className="p-4 text-left">Amount</TableHead>
              <TableHead className="p-4 text-left">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-8 text-center text-slate-500 dark:text-slate-400"
                >
                  Loading expense invoice...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-8 text-center text-red-600 dark:text-red-400"
                >
                  {error?.message || "Failed to load expense invoice."}
                </TableCell>
              </TableRow>
            ) : !invoice ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-8 text-center text-slate-500 dark:text-slate-400"
                >
                  Expense invoice not found.
                </TableCell>
              </TableRow>
            ) : (
              <TableRow className="transition hover:bg-[rgba(15,143,139,0.08)] dark:hover:bg-slate-800/70">
                <TableCell className="p-4">{invoice.created_by_name}</TableCell>
                <TableCell className="p-4">{invoice.description}</TableCell>
                <TableCell className="p-4 font-semibold">
                  {invoice.amount}
                </TableCell>
                <TableCell className="p-4">{invoice.created_at}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
