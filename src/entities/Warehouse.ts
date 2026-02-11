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
