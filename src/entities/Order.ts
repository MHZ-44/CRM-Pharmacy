export type OrderCollection<T> = T | T[];

export interface OrderProduct {
  id: number;
  barcode?: string;
  name?: string;
  strength?: string;
  company_name?: string;
  form?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_cost: string;
  line_total: string;
  created_at: string;
  updated_at: string;
  product?: OrderProduct;
}

export interface OrderFeedback {
  id: number;
  content?: string;
  pharmacy_id: number;
  warehouse_id: number;
  created_at: string;
  updated_at: string;
  order_id: number;
}

export interface OrderRegion {
  id: number;
  name?: string;
}

export interface OrderPharmacy {
  id: number;
  pharmacy_name?: string;
  doctor_phone?: string;
  doctor_email?: string;
  region_id: number;
  region?: OrderRegion;
}

export interface OrderWarehouse {
  id: number;
  warehouse_name: string;
}

export interface Order {
  id: number;
  pharmacy_id: number;
  warehouse_id: number;
  status: string;
  total_cost: string;
  approved_at: string | null;
  rejected_at: string | null;
  received_at: string | null;
  issue_at: string | null;
  issue_note: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderCollection<OrderItem>;
  pharmacy?: OrderPharmacy;
  warehouse?: OrderWarehouse;
  feedbacks?: OrderCollection<OrderFeedback>;
}

export interface WarehouseOrderItem {
  id: number;
  medicineName: string;
  quantity: number;
  checked: boolean;
  barcode: string;
  strength: string;
  companyName: string;
  form: string;
  unitCost: string;
  lineTotal: string;
}

export interface WarehouseOrderFeedback {
  id: number;
  content: string;
  createdAt: string;
}

export interface WarehouseOrder {
  id: number;
  pharmacyName: string;
  items: WarehouseOrderItem[];
  sent: boolean;
  status: string;
  totalCost: string;
  regionName: string;
  issueNote: string;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  receivedAt: string | null;
  issueAt: string | null;
  feedbacks: WarehouseOrderFeedback[];
}
