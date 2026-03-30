import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetOneFeedbackInvoices } from "@/hooks/pharmacy/useGetOneFeedbackInvoices";

export default function PharmacyFeedbackInvoiceDetails() {
  const { invoiceId } = useParams();
  const { data, isLoading, isError, error } =
    useGetOneFeedbackInvoices(invoiceId);
  const items = data ?? [];
  const summary = items[0];

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Feedback Invoice #{invoiceId}
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Invoice details
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Created Date
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {summary?.created_date ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Discount
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {summary?.discount_percent ?? "—"}%
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Quantity
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {summary?.totalQuantity ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-blue-50/60 p-5 text-lg font-medium leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
        <span className="font-semibold text-blue-800 dark:text-blue-200">
          Feedback:
        </span>{" "}
        {summary?.feedback ?? "—"}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Name</TableHead>
              <TableHead className="p-4 text-left">Strength</TableHead>
              <TableHead className="p-4 text-left">Company</TableHead>
              <TableHead className="p-4 text-left">Form</TableHead>
              <TableHead className="p-4 text-left">Quantity</TableHead>
              <TableHead className="p-4 text-left">Unit Price</TableHead>
              <TableHead className="p-4 text-left">Line Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading invoice...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load invoice."}
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No items found.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {items.map((item, index) => (
                  <TableRow
                    key={`${item.id}-${index}`}
                    className={`transition hover:bg-blue-50 dark:hover:bg-slate-800/70 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-100 dark:bg-slate-900/60"
                    }`}
                  >
                    <TableCell className="p-4 font-semibold">
                      {item.name}
                    </TableCell>
                    <TableCell className="p-4">{item.strength}</TableCell>
                    <TableCell className="p-4">{item.company_name}</TableCell>
                    <TableCell className="p-4">{item.form}</TableCell>
                    <TableCell className="p-4">{item.quantity}</TableCell>
                    <TableCell className="p-4">{item.unit_price}</TableCell>
                    <TableCell className="p-4">{item.line_total}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-blue-50 font-semibold dark:bg-slate-800/60">
                  <TableCell className="p-4" colSpan={6}>
                    Total
                  </TableCell>
                  <TableCell className="p-4">
                    {summary?.total_price ?? "—"}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-blue-50/60 font-semibold dark:bg-slate-800/40">
                  <TableCell className="p-4" colSpan={6}>
                    Paid Total
                  </TableCell>
                  <TableCell className="p-4">
                    {summary?.paid_total ?? "—"}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
