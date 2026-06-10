import { Package, AlertTriangle, Clock, ShoppingCart } from "lucide-react";
import { useGetMedicineW } from "@/hooks/warehouse/useGetMedicineW";
import { useGetOrders } from "@/hooks/warehouse/useGetOrdes";
import { useGetPendingOrders } from "@/hooks/warehouse/useGetPendingOdreds";
import type { ReactNode } from "react";

export default function WarehouseHomePage() {
  const {
    data: medicines = [],
    isLoading: medicinesLoading,
    isError: medicinesError,
    error: medicinesFetchError,
  } = useGetMedicineW();
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersFetchError,
  } = useGetOrders();
  const { data: pendingOrders = [], isLoading: pendingOrdersLoading } =
    useGetPendingOrders();
  const lowStockCount = medicines.filter(
    (medicine) => medicine.quantity > 0 && medicine.quantity < 5,
  ).length;
  const recentOrders = orders.slice(0, 8);
  const hasDashboardError = medicinesError || ordersError;
  const dashboardErrorMessage =
    ordersFetchError?.message ||
    medicinesFetchError?.message ||
    "Failed to load dashboard data.";

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white via-slate-200 to-blue-100 text-gray-900 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
          Warehouse Dashboard
        </h1>
        <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
          Overview of your warehouse activity
        </p>
      </div>

      {hasDashboardError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {dashboardErrorMessage}
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Medicines"
          value={medicinesLoading ? "..." : medicines.length.toString()}
          icon={<Package className="w-6 h-6 text-blue-600" />}
        />

        <StatCard
          title="Low Stock Items"
          value={medicinesLoading ? "..." : lowStockCount.toString()}
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrdersLoading ? "..." : pendingOrders.length.toString()}
          icon={<Clock className="w-6 h-6 text-yellow-500" />}
        />

        <StatCard
          title="Total Orders"
          value={ordersLoading ? "..." : orders.length.toString()}
          icon={<ShoppingCart className="w-6 h-6 text-green-600" />}
        />
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <h2 className="text-2xl font-semibold text-slate-900 mb-5 dark:text-slate-100">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-base border-collapse">
            <thead>
              <tr className="bg-blue-100 text-slate-700 text-base dark:bg-slate-800 dark:text-slate-100">
                <th className="p-5">Pharmacy</th>
                <th className="p-5">Created Date</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>

            <tbody className="text-base">
              {ordersLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-5 text-center text-slate-500 dark:text-slate-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-5 text-center text-slate-500 dark:text-slate-400"
                  >
                    No recent orders.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-200 transition hover:bg-[rgba(15,143,139,0.08)] dark:border-slate-800 dark:hover:bg-slate-800/70"
                  >
                    <td className="p-5 font-semibold">
                      {order.pharmacy_name}
                    </td>
                    <td className="p-5">{order.created_date}</td>
                    <td className="p-5">
                      <span
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${getStatusClasses(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const getStatusClasses = (status: string) => {
  const normalized = status.toLowerCase();

  if (["approved", "accepted", "received"].includes(normalized)) {
    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300";
  }

  if (normalized === "rejected") {
    return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
  }

  if (normalized === "issue" || normalized === "reported") {
    return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300";
  }

  return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300";
};

/* ---------------- STAT CARD COMPONENT ---------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center justify-between hover:shadow-2xl transition border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1 dark:text-slate-100">
          {value}
        </p>
      </div>

      <div className="bg-blue-100 p-3 rounded-xl dark:bg-blue-500/10">
        {icon}
      </div>
    </div>
  );
}
