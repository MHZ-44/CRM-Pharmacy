export interface Admin {
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
}
