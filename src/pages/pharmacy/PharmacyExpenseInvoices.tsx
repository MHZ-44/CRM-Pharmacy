import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteDialog from "@/components/DeleteDialog";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useGetExpenseInvoices } from "@/hooks/pharmacy/useGetExpenseInvoices";
import { useCreateExpenseInvoices } from "@/hooks/pharmacy/useCreateExpenseInvoices";
import { useUpdateExpenseInvoices } from "@/hooks/pharmacy/useUpdateExpenseInvoices";
import { useDeleteExpenseInvoices } from "@/hooks/pharmacy/useDeleteExpenseInvoices";
import { normalizeDateSearch } from "@/lib/normalizeDateSearch";

export default function PharmacyExpenseInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState({
    amount: "",
    created_by_name: "",
    description: "",
  });
  const [updateForm, setUpdateForm] = useState({
    amount: "",
    description: "",
  });
  const { data, isLoading, isError, error } = useGetExpenseInvoices();
  const invoices = useMemo(() => data ?? [], [data]);
  const { mutate: createInvoice, isPending: isCreating } =
    useCreateExpenseInvoices();
  const { mutate: updateInvoice, isPending: isUpdating } =
    useUpdateExpenseInvoices();
  const { mutate: deleteInvoice, isPending: isDeleting } =
    useDeleteExpenseInvoices();

  const filteredInvoices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return invoices;
    const dateTerm = normalizeDateSearch(term);

    return invoices.filter((invoice) => {
      const haystack = [
        invoice.id,
        invoice.created_by_name,
        invoice.description,
        invoice.amount,
        invoice.created_at,
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

  const handleOpenUpdate = (invoice: (typeof invoices)[number]) => {
    setUpdateId(invoice.id);
    setUpdateForm({
      amount: invoice.amount ?? "",
      description: invoice.description ?? "",
    });
    setIsUpdateOpen(true);
  };

  const handleCreate = () => {
    if (!createForm.amount.trim()) {
      toast.error("Amount is required.");
      return;
    }
    if (!createForm.created_by_name.trim()) {
      toast.error("Created by name is required.");
      return;
    }
    if (!createForm.description.trim()) {
      toast.error("Description is required.");
      return;
    }

    createInvoice(
      {
        amount: createForm.amount,
        created_by_name: createForm.created_by_name,
        description: createForm.description,
      },
      {
        onSuccess: () => {
          toast.success("Expense invoice created.");
          setIsCreateOpen(false);
          setCreateForm({ amount: "", created_by_name: "", description: "" });
        },
        onError: (err) => {
          toast.error(
            getApiErrorMessage(err, "Failed to create expense invoice."),
          );
        },
      },
    );
  };

  const handleUpdate = () => {
    if (!updateId) return;
    if (!updateForm.amount.trim()) {
      toast.error("Amount is required.");
      return;
    }
    if (!updateForm.description.trim()) {
      toast.error("Description is required.");
      return;
    }

    updateInvoice(
      {
        id: String(updateId),
        amount: updateForm.amount,
        description: updateForm.description,
      },
      {
        onSuccess: () => {
          toast.success("Expense invoice updated.");
          setIsUpdateOpen(false);
        },
        onError: (err) => {
          toast.error(
            getApiErrorMessage(err, "Failed to update expense invoice."),
          );
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteInvoice(String(id), {
      onSuccess: () => {
        toast.success("Expense invoice deleted.");
      },
      onError: (err) => {
        toast.error(
          getApiErrorMessage(err, "Failed to delete expense invoice."),
        );
      },
    });
  };

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Expense Invoices
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            All pharmacy expense invoices
          </p>
        </div>
        <Button
          type="button"
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-[rgba(15,143,139,0.08)]0"
          onClick={() => setIsCreateOpen(true)}
        >
          Create Invoice
        </Button>
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
              <TableHead className="p-4 text-left">Created By</TableHead>
              <TableHead className="p-4 text-left">Description</TableHead>
              <TableHead className="p-4 text-left">Amount</TableHead>
              <TableHead className="p-4 text-left">Created Date</TableHead>
              <TableHead className="p-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading expense invoices...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load expense invoices."}
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No expense invoices yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice, index) => (
                <TableRow
                  key={index}
                  className={`transition hover:bg-[rgba(15,143,139,0.08)] dark:hover:bg-slate-800/70 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-gray-100 dark:bg-slate-900/60"
                  }`}
                >
                  <TableCell className="p-4">
                    {invoice.created_by_name}
                  </TableCell>
                  <TableCell className="p-4">{invoice.description}</TableCell>
                  <TableCell className="p-4">{invoice.amount}</TableCell>
                  <TableCell className="p-4">{invoice.created_at}</TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenUpdate(invoice)}
                      >
                        Update
                      </Button>
                      <DeleteDialog
                        title="Delete expense invoice?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(invoice.id)}
                        isPending={isDeleting}
                        confirmLabel="Delete Invoice"
                        trigger={
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                          >
                            Delete
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <DialogHeader>
            <DialogTitle className="text-blue-800 dark:text-blue-300">
              Create Expense Invoice
            </DialogTitle>
            <DialogDescription className="text-blue-600 dark:text-blue-300">
              Fill in the expense invoice details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Amount
              </label>
              <Input
                type="number"
                value={createForm.amount}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    amount: event.target.value,
                  }))
                }
                placeholder="0"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Created By Name
              </label>
              <Input
                type="text"
                value={createForm.created_by_name}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    created_by_name: event.target.value,
                  }))
                }
                placeholder="Name"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Description
              </label>
              <Input
                type="text"
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Description"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCreate} disabled={isCreating}>
              {isCreating ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <DialogHeader>
            <DialogTitle className="text-blue-800 dark:text-blue-300">
              Update Expense Invoice
            </DialogTitle>
            <DialogDescription className="text-blue-600 dark:text-blue-300">
              Update amount and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Amount
              </label>
              <Input
                type="number"
                value={updateForm.amount}
                onChange={(event) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    amount: event.target.value,
                  }))
                }
                placeholder="0"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Description
              </label>
              <Input
                type="text"
                value={updateForm.description}
                onChange={(event) =>
                  setUpdateForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Description"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUpdateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
