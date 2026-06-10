export type OrderAssistantFulfillment =
  | "full"
  | "completed"
  | "complete"
  | "partial"
  | "none";

export interface OrderAssistantRegion {
  id: number;
  name: string;
}

export interface OrderAssistantWarehouse {
  id: number;
  warehouse_name: string;
  region: OrderAssistantRegion;
  ratings_count: number;
  rating_average: number;
}

export interface OrderAssistantItem {
  product_id: number;
  barcode: string;
  name: string;
  strength: string;
  company_name: string;
  form: string;
  current_pharmacy_quantity: number;
  suggested_quantity: number;
  reason: string;
  available_quantity: number;
}

export interface OrderAssistantCoveredItem extends OrderAssistantItem {
  unit_price: number;
  line_total: number;
}

export interface OrderAssistantProposal {
  fulfillment?: OrderAssistantFulfillment;
  message?: string;
  warehouse: OrderAssistantWarehouse | null;
  items: OrderAssistantCoveredItem[];
  total_cost: number;
  covered_items_count: number;
}

export interface OrderAssistant {
  fulfillment: OrderAssistantFulfillment;
  message: string;
  warehouse: OrderAssistantWarehouse | null;
  proposals?: OrderAssistantProposal[];
  warehouse_proposals?: OrderAssistantProposal[];
  warehouses?: OrderAssistantProposal[];
  items: OrderAssistantCoveredItem[];
  missing_items: OrderAssistantItem[];
  total_cost: number;
  covered_items_count: number;
  missing_items_count: number;
}
