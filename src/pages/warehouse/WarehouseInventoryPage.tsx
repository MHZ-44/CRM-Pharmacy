import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

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
  const defaultProducts: Product[] = [
    {
      id: 1,
      name: "Paracetamol",
      quantity: 3,
      company: "Pfizer",
      price: 2.5,
      expiryDate: "2026-05-01",
      strength: "500mg",
    },
    {
      id: 2,
      name: "Amoxicillin",
      quantity: 0,
      company: "Novartis",
      price: 4,
      expiryDate: "2025-08-10",
      strength: "250mg",
    },
    {
      id: 3,
      name: "Ibuprofen",
      quantity: 2,
      company: "Bayer",
      price: 3.2,
      expiryDate: "2026-02-15",
      strength: "400mg",
    },
    {
      id: 4,
      name: "Ciprofloxacin",
      quantity: 18,
      company: "Roche",
      price: 5.5,
      expiryDate: "2025-11-20",
      strength: "500mg",
    },
    {
      id: 5,
      name: "Vitamin C",
      quantity: 0,
      company: "Jamieson",
      price: 6,
      expiryDate: "2027-01-10",
      strength: "1000mg",
    },
    {
      id: 6,
      name: "Metformin",
      quantity: 4,
      company: "Sanofi",
      price: 7,
      expiryDate: "2026-07-07",
      strength: "850mg",
    },
  ];

  const [products] = useState<Product[]>(() => {
    const stored = localStorage.getItem("medicines");
    if (stored) return JSON.parse(stored);

    localStorage.setItem("medicines", JSON.stringify(defaultProducts));
    return defaultProducts;
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const lowStockProducts = products.filter(
    (product) => product.quantity > 0 && product.quantity < 10,
  );

  const outOfStockProducts = products.filter(
    (product) => product.quantity === 0,
  );

  return (
    <div className="min-h-screen p-8 space-y-8 text-[18px] bg-gradient-to-br from-white via-slate-100 to-blue-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">
            Warehouse Inventory
          </h1>

          <p className="text-blue-600 text-sm mt-1">
            Live stock levels across the warehouse
          </p>
        </div>

        <Link to="/warehouse/add-medicine">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Add Medicine
          </Button>
        </Link>
      </div>

      {/* STOCK CARDS */}
      <div className="grid grid-cols-2 gap-6">
        <Link to="/warehouse/low">
          <div className="cursor-pointer bg-yellow-100 hover:bg-yellow-200 transition p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-yellow-700">Low Stock</h2>
            <p className="text-3xl font-bold mt-2">{lowStockProducts.length}</p>
            <p className="text-sm text-yellow-700">Medicines below 10 items</p>
          </div>
        </Link>

        <Link to="/warehouse/out">
          <div className="cursor-pointer bg-red-100 hover:bg-red-200 transition p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-red-700">Out of Stock</h2>
            <p className="text-3xl font-bold mt-2">
              {outOfStockProducts.length}
            </p>
            <p className="text-sm text-red-700">Medicines finished</p>
          </div>
        </Link>
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

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow-xl border bg-white">
        <table className="w-full border-collapse">
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
                <td className="p-4">{product.strength || "—"}</td>
                <td className="p-4 font-semibold">{product.quantity}</td>
                <td className="p-4">{product.company}</td>
                <td className="p-4">{product.price}</td>
                <td className="p-4">{product.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
