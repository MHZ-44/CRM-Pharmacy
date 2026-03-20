import { Package, AlertTriangle, Clock, ShoppingCart } from "lucide-react";

export default function WarehouseHomePage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white via-slate-200 to-blue-100 text-slate-900 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
          Warehouse Dashboard
        </h1>
        <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
          Overview of your warehouse activity
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <StatCard
          title="Total Medicines"
          value="1,240"
          icon={<Package className="w-6 h-6 text-blue-600" />}
        />

        <StatCard
          title="Low Stock Items"
          value="32"
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
        />

        <StatCard
          title="Expiring Soon"
          value="18"
          icon={<Clock className="w-6 h-6 text-yellow-500" />}
        />

        <StatCard
          title="Total Orders"
          value="276"
          icon={<ShoppingCart className="w-6 h-6 text-green-600" />}
        />
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <h2 className="text-xl font-semibold text-blue-800 mb-4 dark:text-blue-200">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-700 text-sm dark:bg-slate-800 dark:text-blue-200">
                <th className="p-3">Order ID</th>
                <th className="p-3">Pharmacy</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              <tr className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70">
                <td className="p-3">#1021</td>
                <td className="p-3">Al Shifa Pharmacy</td>
                <td className="p-3">20 Feb 2026</td>
                <td className="p-3 text-green-600 font-medium dark:text-green-400">
                  Completed
                </td>
              </tr>

              <tr className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70">
                <td className="p-3">#1020</td>
                <td className="p-3">Al Noor Pharmacy</td>
                <td className="p-3">19 Feb 2026</td>
                <td className="p-3 text-yellow-600 font-medium dark:text-yellow-400">
                  Pending
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/70">
                <td className="p-3">#1019</td>
                <td className="p-3">City Care Pharmacy</td>
                <td className="p-3">18 Feb 2026</td>
                <td className="p-3 text-red-600 font-medium dark:text-red-400">
                  Cancelled
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


/* ---------------- STAT CARD COMPONENT ---------------- */

function StatCard({ title, value, icon }) {
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
