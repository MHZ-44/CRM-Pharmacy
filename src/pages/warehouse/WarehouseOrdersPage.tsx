import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetPendingOrders } from "@/hooks/warehouse/useGetPendingOdreds";
import { useApproveOrder } from "@/hooks/warehouse/useApproveOrder";
import { useRejectOrder } from "@/hooks/warehouse/useRejectOrder";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import type { WarehouseOrder } from "@/entities/Order";

export default function WarehouseOrders() {
  const {
    data: pendingOrders,
    isLoading: isLoadingPending,
    isError: isPendingError,
    error: pendingError,
  } = useGetPendingOrders();
  const { mutate: approveOrder, isPending: isApproving } = useApproveOrder();
  const { mutate: rejectOrder, isPending: isRejecting } = useRejectOrder();
  const orders = useMemo(() => pendingOrders ?? [], [pendingOrders]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [pendingAction, setPendingAction] = useState<{
    orderId: number;
    action: "approve" | "reject";
  } | null>(null);

  const getItemKey = (orderId: number, itemId: number) =>
    `${orderId}-${itemId}`;

  const toggleCheck = (orderId: number, itemId: number) => {
    const key = getItemKey(orderId, itemId);
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleOrderCheck = (order: WarehouseOrder, checked: boolean) => {
    setCheckedItems((prev) => {
      const next = { ...prev };

      for (const item of order.items) {
        next[getItemKey(order.id, item.id)] = checked;
      }

      return next;
    });
  };

  const handleApprove = (orderId: number) => {
    setPendingAction({ orderId, action: "approve" });
    approveOrder(orderId, {
      onSuccess: () => {
        toast.success("Order approved successfully.");
      },
      onError: (mutationError) => {
        toast.error(
          getApiErrorMessage(mutationError, "Failed to approve order."),
        );
      },
      onSettled: () => {
        setPendingAction(null);
      },
    });
  };

  const handleReject = (orderId: number) => {
    setPendingAction({ orderId, action: "reject" });
    rejectOrder(orderId, {
      onSuccess: () => {
        toast.success("Order rejected successfully.");
      },
      onError: (mutationError) => {
        toast.error(
          getApiErrorMessage(mutationError, "Failed to reject order."),
        );
      },
      onSettled: () => {
        setPendingAction(null);
      },
    });
  };

  const isLoading = isLoadingPending;
  const isError = isPendingError;
  const error = pendingError;

  return (
    <div className="min-h-screen p-8 space-y-8 bg-gradient-to-br from-white via-slate-200 to-blue-100 text-slate-900 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Warehouse Orders
        </h1>
        <p className="text-slate-600 text-sm mt-1 dark:text-slate-300">
          Review pending pharmacy order requests
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-slate-600 dark:text-slate-400">
            Loading orders...
          </p>
        ) : isError ? (
          <p className="text-red-600 dark:text-red-400">
            {error?.message || "Failed to load orders."}
          </p>
        ) : orders.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">
            No pending order requests found.
          </p>
        ) : (
          orders.map((order) => {
            const hasItems = order.items.length > 0;
            const allChecked = hasItems && order.items.every(
              (item) =>
                checkedItems[getItemKey(order.id, item.id)] ?? item.checked,
            );
            const isMutating = isApproving || isRejecting;
            const isApprovingOrder =
              pendingAction !== null &&
              pendingAction.orderId === order.id &&
              pendingAction.action === "approve";
            const isRejectingOrder =
              pendingAction !== null &&
              pendingAction.orderId === order.id &&
              pendingAction.action === "reject";

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] space-y-4 cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:shadow-none"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {order.pharmacyName}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      disabled={!allChecked || isMutating}
                      onClick={() => handleApprove(order.id)}
                      className="bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isApprovingOrder ? "Approving..." : "Approve Order"}
                    </Button>
                    <Button
                      disabled={isMutating}
                      onClick={() => handleReject(order.id)}
                      className="bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isRejectingOrder ? "Rejecting..." : "Reject Order"}
                    </Button>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse">
                  <thead className="bg-blue-100 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 text-left">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          disabled={!hasItems}
                          onChange={(event) =>
                            toggleOrderCheck(order, event.target.checked)
                          }
                          className="w-4 h-4"
                        />
                      </th>
                      <th className="p-3 text-left">Medicine</th>
                      <th className="p-3 text-left">Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map((item) => {
                      const isChecked =
                        checkedItems[getItemKey(order.id, item.id)] ??
                        item.checked;

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-200 hover:bg-[rgba(15,143,139,0.08)] dark:border-slate-800 dark:hover:bg-slate-800/70"
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCheck(order.id, item.id)}
                              className="w-4 h-4"
                            />
                          </td>

                          <td
                            className={`p-3 ${
                              isChecked ? "line-through text-gray-400" : ""
                            }`}
                          >
                            {item.medicineName}
                          </td>

                          <td className="p-3">{item.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
