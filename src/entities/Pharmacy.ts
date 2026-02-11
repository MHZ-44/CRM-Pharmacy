export interface Pharmacy {
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
  admin: {
    id: number;
    name: string;
  };
  region: {
    id: number;
    name: string;
  };
}
