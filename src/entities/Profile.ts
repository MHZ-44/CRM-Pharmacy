export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  region_id: number;
  created_at: string;
  updated_at: string;
  region: {
    id: number;
    name: string;
  };
  pharmacies: Pharmacies[];
  warehouse: Warehouse[];
}

interface Pharmacies {
  id: number;
  pharmacy_name: string;
  doctor_name: string;
  doctor_phone: string;
  doctor_email: string;
  activated_at: string;
  region_id: number;
  admin_id: number;
  created_at: string;
  updated_at: string;
}

interface Warehouse {
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
}
