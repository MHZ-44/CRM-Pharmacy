import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCart } from "@/hooks/pharmacy/useGetCart";
import { useUpdateQuantity } from "@/hooks/pharmacy/useUpdateQuantity";
import { useDeleteItem } from "@/hooks/pharmacy/useDeleteItem";
import { useDeleteCart } from "@/hooks/pharmacy/useDeleteCart";
import { useCreateOrder } from "@/hooks/pharmacy/useCreateOrder";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export default function PharmacyCart() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetCart();
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateQuantity();
  const { mutate: deleteItem, isPending: isDeletingItem } = useDeleteItem();
  const { mutate: deleteCart, isPending: isDeletingCart } = useDeleteCart();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const cartItems = data ?? [];
  const [quantityDraft, setQuantityDraft] = useState<Record<string, string>>(
    {},
  );

  const getItemKey = (cartId: number, index: number) => `${cartId}-${index}`;

  const handleChangeDraft = (key: string, value: string) => {
    setQuantityDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteItem = (barcode: string) => {
    deleteItem(barcode, {
      onSuccess: () => {
        toast.success("Item deleted from cart.");
        setQuantityDraft({});
      },
      onError: (mutationError) => {
        toast.error(
          getApiErrorMessage(mutationError, "Failed to delete item."),
        );
      },
    });
  };

  const handleUpdateQuantity = (
    warehouseId: number,
    barcode: string,
    quantity: string,
  ) => {
    const parsedQuantity = Number.parseInt(quantity, 10);

    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    updateQuantity(
      {
        warehouse_id: warehouseId,
        barcode,
        quantity: parsedQuantity,
      },
      {
        onSuccess: () => {
          toast.success("Quantity updated.");
        },
        onError: (mutationError) => {
          toast.error(
            getApiErrorMessage(mutationError, "Failed to update quantity."),
          );
        },
      },
    );
  };

  const handleConfirmCart = () => {
    createOrder(undefined, {
      onSuccess: () => {
        toast.success("Order created successfully.");
        setQuantityDraft({});
        navigate("/pharmacy/warehouses");
      },
      onError: (mutationError) => {
        toast.error(
          getApiErrorMessage(mutationError, "Failed to confirm cart."),
        );
      },
    });
  };

  const handleCancelCart = () => {
    deleteCart(undefined, {
      onSuccess: () => {
        toast.success("Cart deleted.");
        setQuantityDraft({});
        navigate("/pharmacy/warehouses");
      },
      onError: (mutationError) => {
        toast.error(
          getApiErrorMessage(mutationError, "Failed to delete cart."),
        );
      },
    });
  };

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-100 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
          Pharmacy Cart
        </h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <Table className="min-w-[900px] border-collapse text-base">
          <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
            <TableRow>
              <TableHead className="p-4 text-left">Warehouse</TableHead>
              <TableHead className="p-4 text-left">Name</TableHead>
              <TableHead className="p-4 text-left">Strength</TableHead>
              <TableHead className="p-4 text-left">Company</TableHead>
              <TableHead className="p-4 text-left">Form</TableHead>
              <TableHead className="p-4 text-left">Quantity</TableHead>
              <TableHead className="p-4 text-left">Unit Price</TableHead>
              <TableHead className="p-4 text-left">Line Total</TableHead>
              <TableHead className="p-4 text-left">Update Qty</TableHead>
              <TableHead className="p-4 text-left">Delete Item</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Loading cart...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="p-8 text-center text-red-500 dark:text-red-400"
                >
                  {error?.message || "Failed to load cart."}
                </TableCell>
              </TableRow>
            ) : cartItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="p-8 text-center text-gray-500 dark:text-slate-400"
                >
                  Cart is empty.
                </TableCell>
              </TableRow>
            ) : (
              cartItems.map((item, index) => {
                const itemKey = getItemKey(item.cart_id, index);
                const quantityValue =
                  quantityDraft[itemKey] ?? String(item.quantity);

                return (
                  <TableRow
                    key={`${item.cart_id}-${item.name}-${index}`}
                    className={`transition hover:bg-blue-50 dark:hover:bg-slate-800/70 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-100 dark:bg-slate-900/60"
                    }`}
                  >
                    <TableCell className="p-4">{item.warehouse_name}</TableCell>
                    <TableCell className="p-4 font-semibold">
                      {item.name}
                    </TableCell>
                    <TableCell className="p-4">{item.strength}</TableCell>
                    <TableCell className="p-4">{item.company_name}</TableCell>
                    <TableCell className="p-4">{item.form}</TableCell>
                    <TableCell className="p-4">{item.quantity}</TableCell>
                    <TableCell className="p-4">{item.unit_price}</TableCell>
                    <TableCell className="p-4">{item.line_total}</TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={quantityValue}
                          onChange={(event) =>
                            handleChangeDraft(itemKey, event.target.value)
                          }
                          className="w-20 rounded-lg border bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <Button
                          type="button"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleUpdateQuantity(
                              item.warehouse_id,
                              item.barcode,
                              quantityValue,
                            )
                          }
                          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
                        >
                          Update
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <DeleteDialog
                        title="Delete item from cart?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDeleteItem(item.barcode)}
                        isPending={isDeletingItem}
                        trigger={
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={isDeletingItem}
                          >
                            Delete
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <DeleteDialog
          title="Delete whole cart?"
          description="This action cannot be undone."
          onConfirm={handleCancelCart}
          isPending={isDeletingCart}
          confirmLabel="Delete Cart"
          trigger={
            <Button
              type="button"
              variant="destructive"
              disabled={isDeletingCart}
            >
              Cancel Cart
            </Button>
          }
        />
        <Button
          type="button"
          disabled={isCreatingOrder}
          className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          onClick={handleConfirmCart}
        >
          Confirm Cart
        </Button>
      </div>
    </div>
  );
}
