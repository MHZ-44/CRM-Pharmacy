export interface Warehouse {
  id: number;
  warehouse_name: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  average_rating?: number | string | null;
  avg_rating?: number | string | null;
  rating?: number | string | null;
  ratings_count?: number | string | null;
  rating_count?: number | string | null;
  raters_count?: number | string | null;
  has_rated?: boolean | number | null;
  user_rating?: number | string | null;
  my_rating?: number | string | null;
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
