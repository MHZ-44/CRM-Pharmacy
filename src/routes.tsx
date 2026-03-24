import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import SuperAdminAdmins from "./pages/superAdmin/SuperAdminAdmins";
import SuperAdminHomePage from "./pages/superAdmin/SuperAdminHomePage";
import SuperAdminPharmacies from "./pages/superAdmin/SuperAdminPharmacies";
import SuperAdminWarehouses from "./pages/superAdmin/SuperAdminWarehouses";
import SuperAdminAddAdmin from "./pages/superAdmin/SuperAdminAddAdmin";
import SuperAdminAddPharmacy from "./pages/superAdmin/SuperAdminAddPharmacy";
import SuperAdminAddWarehouse from "./pages/superAdmin/SuperAdminAddWarehouse";
import ProfilePage from "./pages/Profile";
import AdminAddPharmacy from "./pages/admin/AdminAddPharmacy";
import AdminAddWarehouse from "./pages/admin/AdminAddWarehouse";
import AdminPharmacies from "./pages/admin/AdminPharmacies";
import AdminWarehouses from "./pages/admin/AdminWarehouses";
import { RequireRole, RoleHomeRedirect } from "./lib/route-guards";
import PharmacyMedicine from "./pages/pharmacy/PharmacyMedicine";
import PharmacyLowStockMedicine from "./pages/pharmacy/PharmacyLowStockMedicine";
import PharmacyOutOfStockMedicine from "./pages/pharmacy/PharmacyOutOfStockMedicine";
import PharmacyAddMedicine from "./pages/pharmacy/PharmacyAddMedicine";
import PharmacyShowWarehouses from "./pages/pharmacy/PharmacyShowWarehouses";
import PharmacyWarehouseMedicines from "./pages/pharmacy/PharmacyWarehouseMedicines";
import PharmacyCart from "./pages/pharmacy/PharmacyCart";
import PharmacySalesCart from "./pages/pharmacy/PharmacySalesCart";
import PharmacyExpenseInvoices from "./pages/pharmacy/PharmacyExpenseInvoices";
import PharmacyFeedbackInvoices from "./pages/pharmacy/PharmacyFeedbackInvoices";
import WarehouseHomePage from "./pages/warehouse/WarehouseHomePage";
import WarehouseAddMedicine from "./pages/warehouse/WarehouseAddMedicinePage";
import WarehouseInventory from "./pages/warehouse/WarehouseInventoryPage";
import WarehouseOrders from "./pages/warehouse/WarehouseOrdersPage";
import WarehouseLowStockMedicine from "./pages/warehouse/WarehouseLowStockMedicinePage";
import WarehouseOutOfStockMedicine from "./pages/warehouse/WarehouseOutOfStockMedicinePage";
import WarehouseCreateExpenseInvoice from "./pages/warehouse/WarehouseCreateExpenseInvoices";
import WarehouseInvoices from "./pages/warehouse/WarehouseInvoices";

import WarehousePendingInvoices from "./pages/warehouse/WarehousePendingInvoices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // { index: true, element: <RoleHomeRedirect /> },
      // { path: "settings", element: <ProfilePage /> },

       //{
       //element: <RequireRole allowed={["superadmin"]} />,
         //children: [
           //{ path: "home", element: <SuperAdminHomePage /> },
           //{ path: "pharmacies", element: <SuperAdminPharmacies /> },
           //{ path: "pharmacies/create", element: <SuperAdminAddPharmacy /> },
           //{ path: "warehouses", element: <SuperAdminWarehouses /> },
           //{ path: "warehouses/create", element: <SuperAdminAddWarehouse /> },
           //{ path: "admins", element: <SuperAdminAdmins /> },
           //{ path: "admins/create", element: <SuperAdminAddAdmin /> },
         //],
       //},

       //{
         //element: <RequireRole allowed={["admin"]} />,
         //children: [
          // { path: "home", element: <SuperAdminHomePage /> },
          // { path: "pharmacies", element: <AdminPharmacies /> },
         //  { path: "pharmacies/create", element: <AdminAddPharmacy /> },
          // { path: "warehouses", element: <AdminWarehouses /> },
           //{ path: "warehouses/create", element: <AdminAddWarehouse /> },
        //],
      //},

       {
        element: <RequireRole allowed={["warehouse"]} />,
        children: [
           { path: "/warehouse/home", element: <WarehouseHomePage/> },
           { path: "/warehouse/inventory", element: <WarehouseInventory /> },
           { path: "/warehouse/orders", element: <WarehouseOrders/> },
           { path: "/warehouse/add-medicine", element: <WarehouseAddMedicine/> },
           { path: "/warehouse/low-stock", element: <WarehouseLowStockMedicine/> },
           { path: "/warehouse/out-of-stock", element: <WarehouseOutOfStockMedicine/> },
           
           


        ],
      }, 
      

      {
        element: <RequireRole allowed={["pharmacies"]} />,
        children: [
          { path: "", element: <WarehouseHomePage /> },
          { path: "pharmacy/medicines", 
            element: <WarehouseInventory /> },
            {
            path: "pharmacy/low-stock",
            element: <WarehouseLowStockMedicine />,
          },
          {
            path: "pharmacy/out-of-stock",
            element: <WarehouseOutOfStockMedicine />,
          },
          {
            path: "/pharmacy/expense-invoices",
            element: <WarehouseInvoices/>,
          },
          {
            path: "/pharmacy/warehouses",
            element: <WarehouseInvoices/>,
          },
          {
            path: "/pharmacy/carts",
            element: <PharmacyCart />,
          },
         /* {
            path:"/pharmacy/expense-invoices",
            element: <WarehouseCreateExpenseInvoice/>,
          }, */
          {
            path:"/pharmacy/feedback-invoices",
            element: <PharmacyFeedbackInvoices />,
          }

        ],
      },

      /*{ path: "*", element: <RoleHomeRedirect /> }, */
    ],
  },
]);

export default router;
