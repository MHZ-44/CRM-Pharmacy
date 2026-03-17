import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

type Invoice = {
  id: number;
  pharmacy: string;
  total: number;
  date: string;
  status: "Paid" | "Pending";
};

export default function WarehouseInvoices() {

  const [searchTerm, setSearchTerm] = useState("");

  const [invoices] = useState<Invoice[]>([
    { id: 1001, pharmacy: "Al Shifa Pharmacy", total: 250, date: "2026-03-10", status: "Paid" },
    { id: 1002, pharmacy: "Al Amal Pharmacy", total: 430, date: "2026-03-12", status: "Pending" },
    { id: 1003, pharmacy: "Al Noor Pharmacy", total: 180, date: "2026-03-14", status: "Paid" },
  ]);

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.pharmacy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 space-y-8 bg-gradient-to-br from-white via-slate-100 to-blue-50">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-blue-800">
            Warehouse Invoices
          </h1>

          <p className="text-blue-600 text-sm mt-1">
            Manage pharmacy invoices
          </p>
        </div>

        <Link to="/warehouse/create-invoice">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + New Invoice
          </Button>
        </Link>

      </div>

      {/* Search */}

      <div className="relative w-full">

        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

        <input
          type="text"
          placeholder="Search pharmacy..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />

      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-2xl shadow-xl border bg-white">

        <table className="w-full border-collapse">

          <thead className="bg-blue-100 text-lg">

            <tr>
              <th className="p-4 text-left">Invoice ID</th>
              <th className="p-4 text-left">Pharmacy</th>
              <th className="p-4 text-left">Total ($)</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
            </tr>

          </thead>

          <tbody>

            {filteredInvoices.map((invoice, index) => (

              <tr
                key={invoice.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-blue-50 transition`}
              >

                <td className="p-4 font-semibold">
                  #{invoice.id}
                </td>

                <td className="p-4">
                  {invoice.pharmacy}
                </td>

                <td className="p-4 font-semibold">
                  {invoice.total}
                </td>

                <td className="p-4">
                  {invoice.date}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}