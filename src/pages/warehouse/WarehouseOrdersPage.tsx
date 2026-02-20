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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
        Warehouse Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const allChecked = order.items.every((item) => item.checked);

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] space-y-4 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-blue-700">
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
                <thead className="bg-blue-100 dark:bg-gray-800">
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
                      className="border-b hover:bg-blue-50 dark:hover:bg-gray-800"
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