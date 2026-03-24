export interface SalesInvoice {
  id: number;
  pharmacy_id: number;
  total_price: string;
  paid_total: string;
  discount_percent: string;
  feedback: string;
  created_at: string;
  updated_at: string;
  items: {
    id: number;
    sales_invoice_id: number;
    product_id: number;
    quantity: number;
    unit_price: string;
    line_total: string;
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
  };
}
