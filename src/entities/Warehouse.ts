export interface Warehouse {
  id: number;
  warehouse_name: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  activated_at: string;
  region_id: number;
  admin_id: number;
  created_at: string;
  updated_at: string;
  admin: {
    id: number;
    name: string;
  };
  region: {
    id: number;
    name: string;
  };
}

export interface WarehouseMedicines {
  id: number;
  warehouse_id: number;
  product_id: number;
  available_quantity: number;
  sell_price_to_pharmacy: string;
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
