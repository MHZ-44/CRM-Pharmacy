export interface Medicine {
  id: number;
  pharmacy_id: number;
  product_id: number;
  quantity: number;
  cost_price: string;
  default_sell_price: string;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    barcode: string;
    name: string;
    strength: string;
    company_name: string;
    form: string;
    created_at: string;
    updated_at: string;
  };
}
