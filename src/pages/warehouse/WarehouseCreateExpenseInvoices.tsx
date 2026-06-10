import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateExpenseInvoicesW } from "@/hooks/warehouse/useCreateExpenseInvoicesW";
import { useGetExpenseInvoicesW } from "@/hooks/warehouse/useGetExpenseInvoicesW";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WarehouseCreateExpenseInvoice() {
  const navigate = useNavigate();
  const { mutate: createExpenseInvoice, isPending } =
    useCreateExpenseInvoicesW();
  const {
    data: invoices = [],
    isLoading,
    isError,
    error,
  } = useGetExpenseInvoicesW();
  const [amount, setAmount] = useState("");
  const [createdByName, setCreatedByName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!amount.trim() || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Amount must be a valid positive number.");
      return;
    }

    if (!createdByName.trim()) {
      toast.error("Created by name is required.");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    createExpenseInvoice(
      {
        amount,
        created_by_name: createdByName.trim(),
        description: description.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Expense invoice created successfully.");
          setAmount("");
          setCreatedByName("");
          setDescription("");
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, "Failed to create expense invoice."),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-slate-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
        Create Expense Invoice
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="rounded-xl border bg-white p-3 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <input
          placeholder="Created By Name"
          value={createdByName}
          onChange={(event) => setCreatedByName(event.target.value)}
          className="rounded-xl border bg-white p-3 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-xl border bg-white p-3 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save Invoice"}
      </button>

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
                  Loading expense invoices...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-8 text-center text-red-600 dark:text-red-400"
                >
                  {error?.message || "Failed to load expense invoices."}
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="p-8 text-center text-slate-500 dark:text-slate-400"
                >
                  No expense invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice, index) => (
                <TableRow
                  key={invoice.id}
                  onClick={() =>
                    navigate(`/warehouse/invoices/expenses/${invoice.id}`)
                  }
                  className={`cursor-pointer transition hover:bg-[rgba(15,143,139,0.08)] dark:hover:bg-slate-800/70 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-gray-100 dark:bg-slate-900/60"
                  }`}
                >
                  <TableCell className="p-4">
                    {invoice.created_by_name}
                  </TableCell>
                  <TableCell className="p-4">{invoice.description}</TableCell>
                  <TableCell className="p-4 font-semibold">
                    {invoice.amount}
                  </TableCell>
                  <TableCell className="p-4">{invoice.created_at}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
