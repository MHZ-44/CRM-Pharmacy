export interface Count {
  count: number;
}

export interface CountByRegion {
  id: number;
  name: string;
  pharmacies_count: number;
  admins_count: number;
  warehouses_count: number;
}

export interface CountByAdmin {
  id: number;
  name: string;
  pharmacies_count: number;
  warehouses_count: number;
}
