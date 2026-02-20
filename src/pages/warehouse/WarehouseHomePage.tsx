import { Package, AlertTriangle, Clock, ShoppingCart } from "lucide-react";

export default function WarehouseHomePage() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white via-slate-100 to-blue-50">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">
          Warehouse Dashboard
        </h1>
        <p className="text-blue-600 text-sm mt-1">
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
      <div className="mt-10 bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-700 text-sm">
                <th className="p-3">Order ID</th>
                <th className="p-3">Pharmacy</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              <tr className="border-b hover:bg-slate-50">
                <td className="p-3">#1021</td>
                <td className="p-3">Al Shifa Pharmacy</td>
                <td className="p-3">20 Feb 2026</td>
                <td className="p-3 text-green-600 font-medium">
                  Completed
                </td>
              </tr>

              <tr className="border-b hover:bg-slate-50">
                <td className="p-3">#1020</td>
                <td className="p-3">Al Noor Pharmacy</td>
                <td className="p-3">19 Feb 2026</td>
                <td className="p-3 text-yellow-600 font-medium">
                  Pending
                </td>
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-3">#1019</td>
                <td className="p-3">City Care Pharmacy</td>
                <td className="p-3">18 Feb 2026</td>
                <td className="p-3 text-red-600 font-medium">
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
    <div className="bg-white shadow-xl rounded-2xl p-6 flex items-center justify-between hover:shadow-2xl transition">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {value}
        </p>
      </div>

      <div className="bg-blue-100 p-3 rounded-xl">
        {icon}
      </div>
    </div>
  );
}