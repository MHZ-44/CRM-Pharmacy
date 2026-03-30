import { useState } from "react";
import { Button } from "@/components/ui/button";

type OrderItem = {
  id: number;
  medicineName: string;
  quantity: number;
  checked: boolean;
};

type Order = {
  id: number;
  pharmacyName: string;
  items: OrderItem[];
  sent: boolean;
};

export default function WarehouseOrders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      pharmacyName: "Al Shifa Pharmacy",
      sent: false,
      items: [
        { id: 1, medicineName: "Paracetamol", quantity: 50, checked: false },
        { id: 2, medicineName: "Amoxicillin", quantity: 30, checked: false },
      ],
    },
    {
      id: 2,
      pharmacyName: "Al Amal Pharmacy",
      sent: false,
      items: [
        { id: 1, medicineName: "Ibuprofen", quantity: 20, checked: false },
        { id: 2, medicineName: "Amoxicillin", quantity: 100, checked: false },
        { id: 3, medicineName: "Unadol", quantity: 40, checked: false },
      ],
    },
  ]);

  const toggleCheck = (orderId: number, itemId: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId
                  ? { ...item, checked: !item.checked }
                  : item
              ),
            }
          : order
      )
    );
  };

  const sendOrder = (orderId: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, sent: true } : order
      )
    );

    alert("Order sent successfully ✅ Pharmacy has been notified.");
  };

  return (
    <div className="min-h-screen p-8 space-y-8 bg-gradient-to-br from-white via-slate-200 to-blue-100 text-slate-900 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Warehouse Orders
        </h1>
        <p className="text-slate-600 text-sm mt-1 dark:text-slate-300">
          Review and send pending pharmacy orders
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const allChecked = order.items.every((item) => item.checked);

          return (
            <div
              key={order.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] space-y-4 cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:shadow-none"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {order.pharmacyName}
                </h2>

                <Button
                  disabled={!allChecked || order.sent}
                  onClick={() => sendOrder(order.id)}
                  className={`${
                    order.sent
                      ? "bg-green-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {order.sent ? "Sent ✅" : "Send Order"}
                </Button>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse">
                <thead className="bg-blue-100 dark:bg-slate-800">
                  <tr>
                    <th className="p-3 text-left">✓</th>
                    <th className="p-3 text-left">Medicine</th>
                    <th className="p-3 text-left">Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-200 hover:bg-blue-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() =>
                            toggleCheck(order.id, item.id)
                          }
                          className="w-4 h-4"
                        />
                      </td>

                      <td
                        className={`p-3 ${
                          item.checked ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {item.medicineName}
                      </td>

                      <td className="p-3">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
