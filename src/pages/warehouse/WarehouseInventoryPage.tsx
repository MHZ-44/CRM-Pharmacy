import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";

type Product = {
  id: number;
  name: string;
  quantity: number;
  company: string;
  price: number;
  expiryDate: string;
  strength?: string;
};

export default function WarehouseInventory() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Paracetamol", quantity: 3, company: "Pfizer", price: 2.5, expiryDate: "2026-05-01", strength: "500mg" },
    { id: 2, name: "Amoxicillin", quantity: 0, company: "Novartis", price: 4, expiryDate: "2025-08-10", strength: "250mg" },
    { id: 3, name: "Ibuprofen", quantity: 2, company: "Bayer", price: 3.2, expiryDate: "2026-02-15", strength: "400mg" },
    { id: 4, name: "Ciprofloxacin", quantity: 18, company: "Roche", price: 5.5, expiryDate: "2025-11-20", strength: "500mg" },
    { id: 5, name: "Vitamin C", quantity: 0, company: "Jamieson", price: 6, expiryDate: "2027-01-10", strength: "1000mg" },
    { id: 6, name: "Metformin", quantity: 4, company: "Sanofi", price: 7, expiryDate: "2026-07-07", strength: "850mg" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<"low" | "out" | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(
    (product) => product.quantity > 0 && product.quantity < 5
  );

  const outOfStockProducts = products.filter(
    (product) => product.quantity === 0
  );

  return (
    <div className="p-8 space-y-8 text-[18px] bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">
          Warehouse Inventory
        </h1>

        <div className="flex gap-4">

          {/* Low Stock */}
          <div
            onClick={() => setActiveModal("low")}
            className="bg-yellow-100 border border-yellow-300 px-5 py-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
          >
            <p className="text-yellow-700 font-semibold text-sm">
              🟡 Low Stock
            </p>
            <p className="text-lg font-bold text-yellow-700">
              {lowStockProducts.length}
            </p>
          </div>

          {/* Out Of Stock */}
          <div
            onClick={() => setActiveModal("out")}
            className="bg-red-100 border border-red-300 px-5 py-4 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
          >
            <p className="text-red-700 font-semibold text-sm">
              🔴 Out of Stock
            </p>
            <p className="text-lg font-bold text-red-700">
              {outOfStockProducts.length}
            </p>
          </div>

        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search medicine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl shadow-xl">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-blue-100 text-lg">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Strength</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Price ($)</th>
              <th className="p-4 text-left">Expiry</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product, index) => (
              <tr
                key={product.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-4 font-semibold">{product.name}</td>
                <td className="p-4 text-blue-700 font-medium">
                  {product.strength || "—"}
                </td>
                <td className="p-4 font-semibold">{product.quantity}</td>
                <td className="p-4">{product.company}</td>
                <td className="p-4">{product.price}</td>
                <td className="p-4">{product.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
{activeModal && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-[900px] max-h-[80vh] overflow-auto space-y-6">

      <h2
        className={`text-2xl font-bold ${
          activeModal === "low" ? "text-yellow-600" : "text-red-600"
        }`}
      >
        {activeModal === "low"
          ? "Low Stock Medicines"
          : "Out of Stock Medicines"}
      </h2>

      {/* نفس جدول الصفحة الأساسي */}
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-blue-100 text-lg">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Strength</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Price ($)</th>
              <th className="p-4 text-left">Expiry</th>
            </tr>
          </thead>

          <tbody>
            {(activeModal === "low"
              ? lowStockProducts
              : outOfStockProducts
            ).map((product, index) => (
              <tr
                key={product.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-4 font-semibold">{product.name}</td>

                <td className="p-4 text-blue-700 font-medium">
                  {product.strength || "—"}
                </td>

                <td
                  className={`p-4 font-bold ${
                    activeModal === "low"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {product.quantity}
                </td>

                <td className="p-4">{product.company}</td>
                <td className="p-4">{product.price}</td>
                <td className="p-4">{product.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        onClick={() => setActiveModal(null)}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white"
      >
        Close
      </Button>

    </div>
  </div>
)}


    </div>
  );
}