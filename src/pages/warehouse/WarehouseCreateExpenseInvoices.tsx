import { useState } from "react";

export default function WarehouseCreateExpenseInvoice() {
  const [items, setItems] = useState([
    { name: "", quantity: 1, price: 0 },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="min-h-screen p-8 space-y-8 bg-gradient-to-br from-white via-slate-200 to-red-100 dark:from-gray-900 dark:to-red-950">

      <h1 className="text-3xl font-bold text-red-700">
        Create Expense Invoice
      </h1>

      {/* Invoice Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <input placeholder="Invoice #" className="p-3 rounded-xl border" />
        <input placeholder="Supplier Name" className="p-3 rounded-xl border" />
        <input type="date" className="p-3 rounded-xl border" />
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid md:grid-cols-5 gap-4 items-center"
          >
            <input
              placeholder="Medicine"
              value={item.name}
              onChange={(e) =>
                handleChange(index, "name", e.target.value)
              }
              className="p-3 rounded-xl border"
            />

            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleChange(index, "quantity", +e.target.value)
              }
              className="p-3 rounded-xl border"
            />

            <input
              type="number"
              value={item.price}
              onChange={(e) =>
                handleChange(index, "price", +e.target.value)
              }
              className="p-3 rounded-xl border"
            />

            <div className="p-3">
              {(item.quantity * item.price).toFixed(2)}
            </div>

            <button
              onClick={() => removeItem(index)}
              className="bg-red-500 text-white px-3 py-2 rounded-xl"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        + Add Item
      </button>

      {/* Total */}
      <div className="text-xl font-bold">
        Total: ${total.toFixed(2)}
      </div>

      <button className="bg-green-600 text-white px-6 py-3 rounded-xl">
        Save Invoice
      </button>
    </div>
  );
}