import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetFeedbackInvoices } from "@/hooks/pharmacy/useGetFeedbackInvoices";

export default function PharmacyFeedbackInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetFeedbackInvoices();
  const invoices = useMemo(() => data ?? [], [data]);

  const filteredInvoices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return invoices;
    const dateTerm = normalizeDateSearch(term);

    return invoices.filter((invoice) => {
      const haystack = [
        invoice.id,
        invoice.created_date,
        invoice.total_price,
        invoice.paid_total,
        invoice.discount_percent,
        invoice.feedback,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        haystack.includes(term) ||
        (dateTerm ? haystack.includes(dateTerm) : false)
      );
    });
  }, [invoices, searchTerm]);

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Feedback Invoices
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Invoices that include customer feedback
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-2xl border bg-white py-3 pl-12 pr-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Invoice #</TableHead>
              <TableHead className="p-4 text-left">Date</TableHead>
              <TableHead className="p-4 text-left">Total</TableHead>
              <TableHead className="p-4 text-left">Paid</TableHead>
              <TableHead className="p-4 text-left">Discount %</TableHead>
              <TableHead className="p-4 text-left">Feedback</TableHead>
              <TableHead className="p-4 text-left">Items Qty</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading feedback invoices...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load feedback invoices."}
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No feedback invoices yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice, index) => (
                <TableRow
                  key={index}
                  onClick={() => {
                    setSelectedInvoiceId(invoice.id);
                    navigate(`/pharmacy/invoices/feedback/${invoice.id}`);
                  }}
                  className={`transition hover:bg-blue-50 dark:hover:bg-slate-800/70 ${
                    selectedInvoiceId === invoice.id
                      ? "bg-blue-100 dark:bg-slate-800"
                      : index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-100 dark:bg-slate-900/60"
                  }`}
                >
                  <TableCell className="p-4 font-semibold">
                    {invoice.id ?? "—"}
                  </TableCell>
                  <TableCell className="p-4">
                    {invoice.created_date ?? "—"}
                  </TableCell>
                  <TableCell className="p-4">
                    {invoice.total_price ?? "—"}
                  </TableCell>
                  <TableCell className="p-4">
                    {invoice.paid_total ?? "—"}
                  </TableCell>
                  <TableCell className="p-4">
                    {invoice.discount_percent ?? "—"}%
                  </TableCell>
                  <TableCell className="p-4">
                    {invoice.feedback ?? "—"}
                  </TableCell>
                  <TableCell className="p-4 font-semibold">
                    {invoice.quantity ?? 0}
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

const normalizeDateSearch = (term: string) => {
  const dashMatch = term.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (dashMatch) {
    const [, year, month, day] = dashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const slashMatch = term.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return "";
};
