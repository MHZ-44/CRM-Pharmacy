export interface Cart {
  cart_id: number;
  warehouse_id: number;
  warehouse_name: string;
  items: {
    barcode: string;
    name: string;
    strength: string;
    company_name: string;
    form: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  };
  total: number;
}

export interface SalesCart {
  cart_id: number;
  items: {
    barcode: string;
    name: string;
    strength: string;
    company_name: string;
    form: string;
    quantity: number;
    default_unit_price: number;
    line_total: number;
  };
  total: number;
}
