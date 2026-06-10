import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetOrders } from "@/hooks/warehouse/useGetOrdes";
import { normalizeDateSearch } from "@/lib/normalizeDateSearch";

const fixedStatuses = ["pending", "approved", "rejected", "received", "issue"];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-600",
  accepted: "bg-green-600",
  received: "bg-green-600",
  rejected: "bg-red-600",
  issue: "bg-orange-600",
  reported: "bg-orange-600",
};

const getStatusColor = (status: string) =>
  statusColor[status.toLowerCase()] ?? "bg-slate-500";

export default function WarehouseInvoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetOrders();
  const orders = useMemo(() => data ?? [], [data]);

  const statusOptions = useMemo(() => {
    const fromOrders = orders
      .map((order) => order.status?.trim().toLowerCase())
      .filter(Boolean);

    return Array.from(new Set([...fixedStatuses, ...fromOrders]));
  }, [orders]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const dateTerm = normalizeDateSearch(term);
    const filteredByStatus =
      statusFilter === "all"
        ? orders
        : orders.filter(
            (order) =>
              order.status.toLowerCase() === statusFilter.toLowerCase(),
          );

    if (!term) return filteredByStatus;

    return filteredByStatus.filter((order) => {
      const haystack = [
        order.pharmacy_name,
        order.status,
        order.total_cost,
        order.quantity,
        order.feedback_count,
        order.issue_note,
        order.feedback_content,
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
  }, [orders, search, statusFilter]);

  return (
    <div className="min-h-screen space-y-6 p-8 text-[18px] text-slate-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
        Warehouse Invoices
      </h1>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-xl bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border rounded-xl bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="all">All</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-slate-600 dark:text-slate-400">
            Loading invoices...
          </p>
        ) : isError ? (
          <p className="text-red-600 dark:text-red-400">
            {error?.message || "Failed to load invoices."}
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">
            No invoices found
          </p>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(`/warehouse/invoices/feedback/${order.id}`)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/warehouse/invoices/feedback/${order.id}`);
                }
              }}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              {/* الحالة */}
              <div
                className={`text-white px-3 py-1 rounded-full w-fit mb-3 ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status}
              </div>

              {/* المعلومات */}
              <p>
                <b>Pharmacy:</b> {order.pharmacy_name}
              </p>
              <p>
                <b>Total Cost:</b> {order.total_cost}
              </p>
              <p>
                <b>Quantity:</b> {order.quantity}
              </p>
              <p>
                <b>Created:</b> {order.created_date}
              </p>
              <p>
                <b>{order.status_event}:</b> {order.status_date}
              </p>
              <p>
                <b>Feedbacks:</b> {order.feedback_count}
              </p>

              {order.issue_note !== "—" && (
                <p>
                  <b>Issue:</b> {order.issue_note}
                </p>
              )}

              {/* أيقونات */}
              {["approved", "accepted", "received"].includes(
                order.status.toLowerCase(),
              ) && <span className="text-green-600 text-xl">✔</span>}
              {order.status.toLowerCase() === "rejected" && (
                <span className="text-red-600 text-xl">✖</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
