import { fetcher } from "@/api/fetcher";
import type { Order } from "@/entities/Order";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

type OrderItemDetails = {
  id: number;
  name: string;
  strength: string;
  company_name: string;
  form: string;
  quantity: number;
  unit_cost: string;
  line_total: string;
};

type OrderRow = {
  id: number;
  pharmacy_name: string;
  status: string;
  total_cost: string;
  quantity: number;
  feedback_count: number;
  has_feedback: boolean;
  feedback_content: string;
  issue_note: string;
  created_date: string;
  approved_date: string;
  rejected_date: string;
  received_date: string;
  issue_date: string;
  status_event: string;
  status_date: string;
  items: OrderItemDetails[];
};

export const useGetOrders = () => {
  const [searchParams] = useSearchParams();

  const paramsString = searchParams.toString();
  const url = paramsString
    ? `/api/warehouse/orders?${paramsString}`
    : "/api/warehouse/orders";

  const query = useQuery<Order[], Error, OrderRow[]>({
    queryKey: ["order", paramsString],
    queryFn: () => fetcher<Order[]>(url),
    select: (response) => {
      const pharmacyOrders = Array.isArray(response)
        ? response
        : (response ?? []);

      return pharmacyOrders.map((order) => {
        const items = Array.isArray(order.items)
          ? order.items
          : order.items
            ? [order.items]
            : [];
        const feedbacks = Array.isArray(order.feedbacks)
          ? order.feedbacks
          : order.feedbacks
            ? [order.feedbacks]
            : [];
        const normalizedStatus = (order.status ?? "").toLowerCase();
        const approvedDate = order.approved_at
          ? dayjs(order.approved_at).format("YYYY-MM-DD")
          : "—";
        const rejectedDate = order.rejected_at
          ? dayjs(order.rejected_at).format("YYYY-MM-DD")
          : "—";
        const receivedDate = order.received_at
          ? dayjs(order.received_at).format("YYYY-MM-DD")
          : "—";
        const issueDate = order.issue_at
          ? dayjs(order.issue_at).format("YYYY-MM-DD")
          : "—";

        return {
          id: order.id,
          pharmacy_name: order.pharmacy?.pharmacy_name ?? "—",
          status: order.status ?? "—",
          total_cost: order.total_cost ?? "0",
          quantity: items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0),
          feedback_count: feedbacks.length,
          has_feedback: feedbacks.length > 0,
          feedback_content: feedbacks[0]?.content ?? "—",
          issue_note: order.issue_note ?? "—",
          created_date: dayjs(order.created_at).format("YYYY-MM-DD"),
          approved_date: approvedDate,
          rejected_date: rejectedDate,
          received_date: receivedDate,
          issue_date: issueDate,
          status_event:
            normalizedStatus === "approved"
              ? "Approved At"
              : normalizedStatus === "received"
                ? "Received At"
                : normalizedStatus === "issue" ||
                    normalizedStatus === "reported"
                  ? "Issue Reported At"
                  : normalizedStatus === "rejected"
                    ? "Rejected At"
                    : "Status Date",
          status_date:
            normalizedStatus === "approved"
              ? approvedDate
              : normalizedStatus === "received"
                ? receivedDate
                : normalizedStatus === "issue" ||
                    normalizedStatus === "reported"
                  ? issueDate
                  : normalizedStatus === "rejected"
                    ? rejectedDate
                    : "—",
          items: items.map((item) => ({
            id: item.id,
            name: item.product?.name ?? "—",
            strength: item.product?.strength ?? "—",
            company_name: item.product?.company_name ?? "—",
            form: item.product?.form ?? "—",
            quantity: item.quantity ?? 0,
            unit_cost: item.unit_cost ?? "0",
            line_total: item.line_total ?? "0",
          })),
        };
      });
    },
  });

  return query;
};
