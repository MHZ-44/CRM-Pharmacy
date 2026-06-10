import { Navigate } from "react-router-dom";

import { getCurrentRole } from "@/lib/route-guards";
import AdminAddPharmacy from "@/pages/admin/AdminAddPharmacy";
import AdminAddWarehouse from "@/pages/admin/AdminAddWarehouse";
import AdminPharmacies from "@/pages/admin/AdminPharmacies";
import AdminWarehouses from "@/pages/admin/AdminWarehouses";
import SuperAdminAddPharmacy from "@/pages/superAdmin/SuperAdminAddPharmacy";
import SuperAdminAddWarehouse from "@/pages/superAdmin/SuperAdminAddWarehouse";
import SuperAdminHomePage from "@/pages/superAdmin/SuperAdminHomePage";
import SuperAdminPharmacies from "@/pages/superAdmin/SuperAdminPharmacies";
import SuperAdminWarehouses from "@/pages/superAdmin/SuperAdminWarehouses";

export function HomePageByRole() {
  const role = getCurrentRole();

  if (role === "superadmin") {
    return <SuperAdminHomePage />;
  }

  if (role === "admin") {
    return <Navigate to="/pharmacies" replace />;
  }

  if (role === "warehouse") {
    return <Navigate to="/warehouse/home" replace />;
  }

  if (role === "pharmacies") {
    return <Navigate to="/pharmacy/sales-cart" replace />;
  }

  return <Navigate to="/login" replace />;
}

export function PharmaciesPageByRole() {
  const role = getCurrentRole();

  if (role === "superadmin") {
    return <SuperAdminPharmacies />;
  }

  return <AdminPharmacies />;
}

export function AddPharmacyPageByRole() {
  const role = getCurrentRole();

  if (role === "superadmin") {
    return <SuperAdminAddPharmacy />;
  }

  return <AdminAddPharmacy />;
}

export function WarehousesPageByRole() {
  const role = getCurrentRole();

  if (role === "superadmin") {
    return <SuperAdminWarehouses />;
  }

  return <AdminWarehouses />;
}

export function AddWarehousePageByRole() {
  const role = getCurrentRole();

  if (role === "superadmin") {
    return <SuperAdminAddWarehouse />;
  }

  return <AdminAddWarehouse />;
}
