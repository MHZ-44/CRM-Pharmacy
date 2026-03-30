import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const invoicesData = [
  {
    id: 1,
    status: "pending",
    pharmacyName: "Al Shifa Pharmacy",
    location: "Damascus",
    doctorName: "Dr. Ahmad",
    doctorPhone: "0999999999",
  },
  {
    id: 2,
    status: "accepted",
    pharmacyName: "Al Noor Pharmacy",
    location: "Aleppo",
    doctorName: "Dr. Sara",
    doctorPhone: "0988888888",
  },
  {
    id: 3,
    status: "rejected",
    pharmacyName: "Al Amal Pharmacy",
    location: "Hama",
    doctorName: "Dr. Omar",
    doctorPhone: "0977777777",
  },
];

export default function WarehouseInvoices() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return invoicesData.filter((inv) => {
      const matchesStatus =
        statusFilter === "all" || inv.status === statusFilter;

      const matchesSearch =
        inv.pharmacyName.toLowerCase().includes(search.toLowerCase()) ||
        inv.doctorName.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const statusColor = {
    pending: "bg-yellow-400",
    accepted: "bg-green-500",
    rejected: "bg-red-500",
  };

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-3xl font-bold">Warehouse Invoices</h1>

      {/* 🔍 Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-xl"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-xl"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 🧾 Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p>No invoices found</p>
        ) : (
          filtered.map((inv) => (
            <div
              key={inv.id}
              onClick={() => {
                if (inv.status === "pending") {
                  navigate("/pending-invoices"); // 🔥 يروح لصفحة البيندينغ
                } else {
                  navigate(`/invoice/${inv.id}`); // باقي الحالات
                }
              }}
              className="cursor-pointer p-5 rounded-2xl shadow-lg bg-white hover:scale-105 transition"
            >
              {/* الحالة */}
              <div
                className={`text-white px-3 py-1 rounded-full w-fit mb-3 ${statusColor[inv.status]}`}
              >
                {inv.status}
              </div>

              {/* المعلومات */}
              <p><b>Pharmacy:</b> {inv.pharmacyName}</p>
              <p><b>Location:</b> {inv.location}</p>
              <p><b>Doctor:</b> {inv.doctorName}</p>
              <p><b>Phone:</b> {inv.doctorPhone}</p>

              {/* أيقونات */}
              {inv.status === "accepted" && (
                <span className="text-green-600 text-xl">✔</span>
              )}
              {inv.status === "rejected" && (
                <span className="text-red-600 text-xl">✖</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}