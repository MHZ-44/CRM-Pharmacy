import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetOrders } from "@/hooks/pharmacy/useGetOrders";
import { useReceiveOrder } from "@/hooks/pharmacy/useReceiveOrder";
import { useCreateIssue } from "@/hooks/pharmacy/useCreateIssue";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PharmacyOrderDetails() {
  const { orderId } = useParams();
  const { data, isLoading, isError, error } = useGetOrders();
  const { mutate: receiveOrder, isPending: isReceiving } = useReceiveOrder(
    orderId ?? "",
  );
  const { mutate: createIssue, isPending: isCreatingIssue } = useCreateIssue(
    orderId ?? "",
  );
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issueContent, setIssueContent] = useState("");

  const numericOrderId = Number(orderId);
  const summary = useMemo(
    () => (data ?? []).find((order) => order.id === numericOrderId),
    [data, numericOrderId],
  );

  const items = summary?.items ?? [];
  const normalizedStatus = (summary?.status ?? "").toLowerCase();
  const canReceiveOrder =
    normalizedStatus !== "pending" &&
    normalizedStatus !== "received" &&
    normalizedStatus !== "rejected";

  const handleReceiveOrder = () => {
    if (!orderId || !canReceiveOrder) return;

    receiveOrder(undefined, {
      onSuccess: () => {
        toast.success("Order received successfully.");
      },
      onError: (mutationError) => {
        toast.error(
          getApiErrorMessage(mutationError, "Failed to receive order."),
        );
      },
    });
  };

  const handleCreateIssue = () => {
    if (!canReceiveOrder) return;

    const content = issueContent.trim();
    if (!content) {
      toast.error("Please write feedback message first.");
      return;
    }

    createIssue(
      { content },
      {
        onSuccess: () => {
          toast.success("Feedback sent successfully.");
          setIssueContent("");
          setIssueDialogOpen(false);
        },
        onError: (mutationError) => {
          toast.error(
            getApiErrorMessage(mutationError, "Failed to send feedback."),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Order #{orderId}
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Order details
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Warehouse
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {summary?.warehouse_name ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {summary?.status ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Quantity
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {summary?.quantity ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <p>
          <span className="font-semibold">Created:</span>{" "}
          {summary?.created_date ?? "—"}
        </p>
        <p>
          <span className="font-semibold">Approved:</span>{" "}
          {summary?.approved_date ?? "—"}
        </p>
        <p>
          <span className="font-semibold">Received:</span>{" "}
          {summary?.received_date ?? "—"}
        </p>
        <p>
          <span className="font-semibold">Issue:</span>{" "}
          {summary?.issue_date ?? "—"}
        </p>
        <p className="md:col-span-2">
          <span className="font-semibold">Issue Note:</span>{" "}
          {summary?.issue_note ?? "—"}
        </p>
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
              <TableHead className="p-4 text-left">Unit Cost</TableHead>
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
                  Loading order...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load order."}
                </TableCell>
              </TableRow>
            ) : !summary ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Order not found.
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
                    className={`transition hover:bg-[rgba(15,143,139,0.08)] dark:hover:bg-slate-800/70 ${
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
                    <TableCell className="p-4">{item.unit_cost}</TableCell>
                    <TableCell className="p-4">{item.line_total}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-blue-50 font-semibold dark:bg-slate-800/60">
                  <TableCell className="p-4" colSpan={6}>
                    Total Cost
                  </TableCell>
                  <TableCell className="p-4">
                    {summary?.total_cost ?? "—"}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          onClick={handleReceiveOrder}
          disabled={!canReceiveOrder || isReceiving}
          className="bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-green-500 dark:hover:bg-green-600"
        >
          {isReceiving ? "Receiving..." : "Receive Order"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={!canReceiveOrder || isCreatingIssue}
          onClick={() => setIssueDialogOpen(true)}
        >
          Feedback
        </Button>
      </div>

      <AlertDialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send feedback for this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Write your issue/feedback message and send it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            value={issueContent}
            onChange={(event) => setIssueContent(event.target.value)}
            rows={4}
            placeholder="Write feedback..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={isCreatingIssue}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleCreateIssue();
              }}
              disabled={!canReceiveOrder || isCreatingIssue}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isCreatingIssue ? "Sending..." : "Send Feedback"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
