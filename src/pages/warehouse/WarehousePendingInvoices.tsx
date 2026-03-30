import { useState, useMemo } from "react";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // 🔥 البيانات الأساسية
  const initialData = [
    {
      id: 1,
      status: "pending",
      pharmacyName: "Al Shifa Pharmacy",
      location: "Damascus",
      doctorName: "Dr. Ahmad",
      doctorPhone: "0999999999",
      items: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          quantity: 20,
          company: "ABC Pharma",
        },
        {
          name: "Amoxicillin",
          dosage: "250mg",
          quantity: 10,
          company: "XYZ Pharma",
        },
      ],
    },
    {
      id: 2,
      status: "pending",
      pharmacyName: "Al Rahma Pharmacy",
      location: "Homs",
      doctorName: "Dr. Khaled",
      doctorPhone: "0988888888",
      items: [
        {
          name: "Ibuprofen",
          dosage: "400mg",
          quantity: 15,
          company: "Medico",
        },
      ],
    },
  ];

  const [invoices, setInvoices] = useState(initialData);

  // 🔍 فلترة
  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus =
        statusFilter === "all" || inv.status === statusFilter;

      const matchesSearch =
        inv.pharmacyName.toLowerCase().includes(search.toLowerCase()) ||
        inv.doctorName.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, invoices]);

  // 🔄 تغيير الحالة
  const updateStatus = (id, newStatus) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${newStatus} this invoice?`
    );

    if (!confirmAction) return;

    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: newStatus } : inv
    );

    setInvoices(updated);
    setSelectedInvoice(null);
  };

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-3xl font-bold text-yellow-600">
        Pending Invoices
      </h1>

      {/* 🔍 Search + Filter */}
      <div className="flex gap-4 flex-wrap">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-xl w-full max-w-md"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 🧾 Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <p>No invoices</p>
        ) : (
          filtered.map((inv) => (
            <div
              key={inv.id}
              className="p-5 rounded-2xl shadow-lg bg-white border"
            >
              {/* الحالة */}
              <div
                className={`text-white px-3 py-1 rounded-full w-fit mb-3
                  ${
                    inv.status === "pending"
                      ? "bg-yellow-500"
                      : inv.status === "accepted"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
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

              {/* زر التفاصيل */}
              <button
                onClick={() => setSelectedInvoice(inv)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* 📦 Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-lg space-y-4">

            <h2 className="text-xl font-bold">Invoice Details</h2>

            {/* معلومات */}
            <div>
              <p><b>Pharmacy:</b> {selectedInvoice.pharmacyName}</p>
              <p><b>Location:</b> {selectedInvoice.location}</p>
              <p><b>Doctor:</b> {selectedInvoice.doctorName}</p>
              <p><b>Phone:</b> {selectedInvoice.doctorPhone}</p>
            </div>

            {/* الطلبية */}
            <div>
              <h3 className="font-semibold mb-2">Order Items:</h3>

              {selectedInvoice.items.map((item, index) => (
                <div key={index} className="border-b py-2">
                  <p>💊 {item.name}</p>
                  <p>Dosage: {item.dosage}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Company: {item.company}</p>
                </div>
              ))}
            </div>

            {/* أزرار (فقط Pending) */}
            {selectedInvoice.status === "pending" && (
              <div className="flex gap-4 mt-4">
                
                <button
                  onClick={() =>
                    updateStatus(selectedInvoice.id, "accepted")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    updateStatus(selectedInvoice.id, "rejected")
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Reject
                </button>

              </div>
            )}

            {/* إغلاق */}
            <button
              onClick={() => setSelectedInvoice(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}