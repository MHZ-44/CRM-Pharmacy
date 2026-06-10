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
import { useGetOrders } from "@/hooks/pharmacy/useGetOrders";
import { normalizeDateSearch } from "@/lib/normalizeDateSearch";

export default function PharmacyOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetOrders();
  const orders = useMemo(() => data ?? [], [data]);
  const statusOptions = useMemo(() => {
    const fixedStatuses = ["approved", "issue", "received", "pending"];
    const statuses = Array.from(
      new Set(
        orders
          .map((order) => order.status?.trim())
          .filter((status): status is string => Boolean(status)),
      ),
    );
    const merged = Array.from(new Set([...fixedStatuses, ...statuses]));
    return merged.sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filteredByStatus =
      statusFilter === "all"
        ? orders
        : orders.filter(
            (order) =>
              order.status.toLowerCase() === statusFilter.toLowerCase(),
          );
    if (!term) return filteredByStatus;
    const dateTerm = normalizeDateSearch(term);

    return filteredByStatus.filter((order) => {
      const haystack = [
        order.id,
        order.warehouse_name,
        order.status,
        order.total_cost,
        order.quantity,
        order.feedback_count,
        order.created_date,
        order.status_date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        haystack.includes(term) ||
        (dateTerm ? haystack.includes(dateTerm) : false)
      );
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Orders
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Pharmacy orders list
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-2xl border bg-white py-3 pl-12 pr-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="min-w-[220px] rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Warehouse</TableHead>
              <TableHead className="p-4 text-left">Status</TableHead>
              <TableHead className="p-4 text-left">Total Cost</TableHead>
              <TableHead className="p-4 text-left">Quantity</TableHead>
              <TableHead className="p-4 text-left">Feedbacks</TableHead>
              <TableHead className="p-4 text-left">Created Date</TableHead>
              <TableHead className="p-4 text-left">Status Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load orders."}
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  onClick={() => navigate(`/pharmacy/orders/${order.id}`)}
                  className={`transition hover:bg-[rgba(15,143,139,0.08)] dark:hover:bg-slate-800/70 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-gray-100 dark:bg-slate-900/60"
                  }`}
                >
                  <TableCell className="p-4">{order.warehouse_name}</TableCell>
                  <TableCell className="p-4">{order.status}</TableCell>
                  <TableCell className="p-4">{order.total_cost}</TableCell>
                  <TableCell className="p-4 font-semibold">
                    {order.quantity}
                  </TableCell>
                  <TableCell className="p-4">{order.feedback_count}</TableCell>
                  <TableCell className="p-4 font-semibold">
                    {order.created_date}
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {order.status_event}
                      </span>
                      <span className="font-semibold">{order.status_date}</span>
                    </div>
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
