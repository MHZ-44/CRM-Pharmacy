import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetOnePendingOrder } from "@/hooks/warehouse/useGetOnePendingOrder";

const formatDate = (value: string | null | undefined) =>
  value ? dayjs(value).format("YYYY-MM-DD") : "—";

export default function WarehouseOrderDetails() {
  const { invoiceId } = useParams();
  const numericOrderId = Number(invoiceId);
  const orderId = Number.isFinite(numericOrderId) ? numericOrderId : null;
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetOnePendingOrder(orderId);
  const items = order?.items ?? [];

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Order #{invoiceId}
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Warehouse order details
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pharmacy
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {order?.pharmacyName ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {order?.status ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Quantity
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {items.reduce((sum, item) => sum + item.quantity, 0) || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <p>
          <span className="font-semibold">Created:</span>{" "}
          {formatDate(order?.createdAt)}
        </p>
        <p>
          <span className="font-semibold">Approved:</span>{" "}
          {formatDate(order?.approvedAt)}
        </p>
        <p>
          <span className="font-semibold">Rejected:</span>{" "}
          {formatDate(order?.rejectedAt)}
        </p>
        <p>
          <span className="font-semibold">Received:</span>{" "}
          {formatDate(order?.receivedAt)}
        </p>
        <p>
          <span className="font-semibold">Issue:</span>{" "}
          {formatDate(order?.issueAt)}
        </p>
        <p>
          <span className="font-semibold">Region:</span>{" "}
          {order?.regionName ?? "—"}
        </p>
        <p className="md:col-span-2">
          <span className="font-semibold">Issue Note:</span>{" "}
          {order?.issueNote ?? "—"}
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
            ) : !order ? (
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
                      {item.medicineName}
                    </TableCell>
                    <TableCell className="p-4">{item.strength}</TableCell>
                    <TableCell className="p-4">{item.companyName}</TableCell>
                    <TableCell className="p-4">{item.form}</TableCell>
                    <TableCell className="p-4">{item.quantity}</TableCell>
                    <TableCell className="p-4">{item.unitCost}</TableCell>
                    <TableCell className="p-4">{item.lineTotal}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-blue-50 font-semibold dark:bg-slate-800/60">
                  <TableCell className="p-4" colSpan={6}>
                    Total Cost
                  </TableCell>
                  <TableCell className="p-4">{order.totalCost}</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
