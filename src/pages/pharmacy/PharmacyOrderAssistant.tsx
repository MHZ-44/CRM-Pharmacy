import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  OrderAssistant,
  OrderAssistantCoveredItem,
  OrderAssistantProposal,
} from "@/entities/OrderAssistant";
import { useConfirmOrderAssistant } from "@/hooks/pharmacy/useConfirmOrderAssistant";
import { useGetOrderAssistant } from "@/hooks/pharmacy/useGetOrderAssistant";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getFulfillmentLabel = (fulfillment: string | undefined) => {
  const normalized = (fulfillment ?? "").toLowerCase();

  if (
    normalized === "full" ||
    normalized === "complete" ||
    normalized === "completed"
  ) {
    return "Completed";
  }

  if (normalized === "partial") return "Partial";

  return "No Proposal";
};

const getFulfillmentClasses = (fulfillment: string | undefined) => {
  const normalized = (fulfillment ?? "").toLowerCase();

  if (
    normalized === "full" ||
    normalized === "complete" ||
    normalized === "completed"
  ) {
    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300";
  }

  if (normalized === "partial") {
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300";
  }

  return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
};

const getItemsCost = (items: OrderAssistantCoveredItem[]) =>
  items.reduce((total, item) => total + Number(item.line_total ?? 0), 0);

const normalizeProposals = (
  data: OrderAssistant | undefined,
): OrderAssistantProposal[] => {
  if (!data) return [];

  const rawProposals =
    data.proposals ?? data.warehouse_proposals ?? data.warehouses;

  if (Array.isArray(rawProposals) && rawProposals.length > 0) {
    return rawProposals.map((proposal) => {
      const items = proposal.items ?? [];

      return {
        fulfillment: proposal.fulfillment ?? data.fulfillment,
        message: proposal.message ?? data.message,
        warehouse: proposal.warehouse ?? null,
        items,
        total_cost: proposal.total_cost ?? getItemsCost(items),
        covered_items_count: proposal.covered_items_count ?? items.length,
      };
    });
  }

  if (data.warehouse || data.items?.length) {
    const items = data.items ?? [];

    return [
      {
        fulfillment: data.fulfillment,
        message: data.message,
        warehouse: data.warehouse,
        items,
        total_cost: data.total_cost ?? getItemsCost(items),
        covered_items_count: data.covered_items_count ?? items.length,
      },
    ];
  }

  return [];
};

export default function PharmacyOrderAssistant() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetOrderAssistant();
  const { mutate: confirmOrderAssistant, isPending: isConfirming } =
    useConfirmOrderAssistant();
  const proposals = normalizeProposals(data);
  const missingItems = data?.missing_items ?? [];
  const coveredItemsCount =
    data?.covered_items_count ??
    proposals.reduce(
      (total, proposal) => total + proposal.covered_items_count,
      0,
    );
  const missingItemsCount = data?.missing_items_count ?? missingItems.length;
  const totalCost =
    data?.total_cost ??
    proposals.reduce((total, proposal) => total + proposal.total_cost, 0);

  const handleConvertToCart = (proposal: OrderAssistantProposal) => {
    const warehouseId = proposal.warehouse?.id;

    if (!warehouseId) {
      toast.error("Warehouse is missing.");
      return;
    }

    const items = proposal.items
      .filter((item) => item.barcode && item.suggested_quantity > 0)
      .map((item) => ({
        barcode: item.barcode,
        quantity: item.suggested_quantity,
      }));

    if (items.length === 0) {
      toast.error("No valid items to convert.");
      return;
    }

    confirmOrderAssistant(
      {
        warehouse_id: warehouseId,
        items,
      },
      {
        onSuccess: () => {
          toast.success("Order assistant items added to cart.");
          navigate("/pharmacy/cart");
        },
        onError: (mutationError) => {
          toast.error(
            getApiErrorMessage(
              mutationError,
              "Failed to convert proposal to cart.",
            ),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen space-y-8 p-8 text-[18px] text-gray-900 bg-gradient-to-br from-white via-slate-200 to-blue-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 dark:text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            Order Assistant
          </h1>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-300">
            Suggested warehouse order based on low and out of stock medicines
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fulfillment
            </p>
            <span
              className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getFulfillmentClasses(
                data?.fulfillment,
              )}`}
            >
              {getFulfillmentLabel(data?.fulfillment)}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Cost
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {data ? totalCost : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Covered / Missing
            </p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              {data ? `${coveredItemsCount} / ${missingItemsCount}` : "—"}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
          Covered Items
        </h2>
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-gray-500 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:shadow-none">
            Loading covered items...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-red-500 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-red-400 dark:shadow-none">
            {error?.message || "Failed to load order proposal."}
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-gray-500 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:shadow-none">
            No covered items found.
          </div>
        ) : (
          proposals.map((proposal, proposalIndex) => (
            <div
              key={`proposal-${proposal.warehouse?.id ?? proposalIndex}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="grid gap-3 border-b border-slate-200 p-4 text-sm md:grid-cols-4 dark:border-slate-800">
                <p>
                  <span className="font-semibold">Warehouse:</span>{" "}
                  {proposal.warehouse?.warehouse_name ?? "—"}
                </p>
                <p>
                  <span className="font-semibold">Region:</span>{" "}
                  {proposal.warehouse?.region?.name ?? "—"}
                </p>
                <p>
                  <span className="font-semibold">Rating:</span>{" "}
                  {proposal.warehouse?.rating_average ?? 0}
                </p>
                <p>
                  <span className="font-semibold">Ratings Count:</span>{" "}
                  {proposal.warehouse?.ratings_count ?? 0}
                </p>
                <p>
                  <span className="font-semibold">Covered:</span>{" "}
                  {proposal.covered_items_count}
                </p>
                <p>
                  <span className="font-semibold">Total Cost:</span>{" "}
                  {proposal.total_cost}
                </p>
                <p className="md:col-span-2">
                  <span className="font-semibold">Message:</span>{" "}
                  {proposal.message ?? data?.message ?? "—"}
                </p>
              </div>

              <Table className="min-w-[1100px] border-collapse text-base">
                <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
                  <TableRow>
                    <TableHead className="p-4 text-left">Name</TableHead>
                    <TableHead className="p-4 text-left">Strength</TableHead>
                    <TableHead className="p-4 text-left">Company</TableHead>
                    <TableHead className="p-4 text-left">Form</TableHead>
                    <TableHead className="p-4 text-left">
                      Current Qty
                    </TableHead>
                    <TableHead className="p-4 text-left">
                      Suggested Qty
                    </TableHead>
                    <TableHead className="p-4 text-left">
                      Available Qty
                    </TableHead>
                    <TableHead className="p-4 text-left">Unit Price</TableHead>
                    <TableHead className="p-4 text-left">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposal.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="p-8 text-center text-gray-500 dark:text-slate-400"
                      >
                        No covered items found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    proposal.items.map((item, index) => (
                      <TableRow
                        key={`covered-${proposal.warehouse?.id ?? proposalIndex}-${item.product_id}-${index}`}
                        className={`transition hover:bg-[rgba(15,143,139,0.08)] dark:hover:bg-slate-800/70 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-900"
                            : "bg-gray-100 dark:bg-slate-900/60"
                        }`}
                      >
                        <TableCell className="p-4 font-semibold">
                          {item.name}
                        </TableCell>
                        <TableCell className="p-4">{item.strength}</TableCell>
                        <TableCell className="p-4">
                          {item.company_name}
                        </TableCell>
                        <TableCell className="p-4">{item.form}</TableCell>
                        <TableCell className="p-4">
                          {item.current_pharmacy_quantity}
                        </TableCell>
                        <TableCell className="p-4">
                          {item.suggested_quantity}
                        </TableCell>
                        <TableCell className="p-4">
                          {item.available_quantity}
                        </TableCell>
                        <TableCell className="p-4">
                          {item.unit_price}
                        </TableCell>
                        <TableCell className="p-4">
                          {item.line_total}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-800">
                <Button
                  type="button"
                  disabled={
                    isConfirming ||
                    !proposal.warehouse?.id ||
                    proposal.items.length === 0
                  }
                  onClick={() => handleConvertToCart(proposal)}
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isConfirming ? "Converting..." : "Convert to Cart"}
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
          Missing Items
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <Table className="min-w-[1000px] border-collapse text-base">
            <TableHeader className="bg-blue-100 text-lg dark:bg-slate-800">
              <TableRow>
                <TableHead className="p-4 text-left">Name</TableHead>
                <TableHead className="p-4 text-left">Strength</TableHead>
                <TableHead className="p-4 text-left">Company</TableHead>
                <TableHead className="p-4 text-left">Form</TableHead>
                <TableHead className="p-4 text-left">Current Qty</TableHead>
                <TableHead className="p-4 text-left">Suggested Qty</TableHead>
                <TableHead className="p-4 text-left">Available Qty</TableHead>
                <TableHead className="p-4 text-left">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="p-8 text-center text-gray-500 dark:text-slate-400"
                  >
                    Loading missing items...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="p-8 text-center text-red-500 dark:text-red-400"
                  >
                    {error?.message || "Failed to load order proposal."}
                  </TableCell>
                </TableRow>
              ) : missingItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="p-8 text-center text-gray-500 dark:text-slate-400"
                  >
                    No missing items found.
                  </TableCell>
                </TableRow>
              ) : (
                missingItems.map((item, index) => (
                  <TableRow
                    key={`missing-${item.product_id}-${index}`}
                    className={`transition hover:bg-red-50 dark:hover:bg-red-500/10 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-gray-100 dark:bg-slate-900/60"
                    }`}
                  >
                    <TableCell className="p-4 font-semibold">
                      {item.name}
                    </TableCell>
                    <TableCell className="p-4">{item.strength}</TableCell>
                    <TableCell className="p-4">{item.company_name}</TableCell>
                    <TableCell className="p-4">{item.form}</TableCell>
                    <TableCell className="p-4">
                      {item.current_pharmacy_quantity}
                    </TableCell>
                    <TableCell className="p-4">
                      {item.suggested_quantity}
                    </TableCell>
                    <TableCell className="p-4">
                      {item.available_quantity}
                    </TableCell>
                    <TableCell className="p-4">{item.reason}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
