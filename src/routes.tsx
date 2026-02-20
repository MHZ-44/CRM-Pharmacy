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
import LoginPage from "./pages/auth/LoginPage";
import WarehouseHomePage from "./pages/warehouse/WarehouseHomePage";
import WarehouseInventoryPage from "./pages/warehouse/WarehouseInventoryPage";
import WarehouseOrdersPage from "./pages/warehouse/WarehouseOrdersPage";

const router = createBrowserRouter([
  
    //element: <AuthLayout />,
   
    { path: "/", element: <LoginPage /> },
  //     { path: "/register", element: <Signup /> },
  //     { path: "/forgot-password", element: <ResetPassword /> },
  //     { path: "/verify-email/success", element: <VerifyEmailSuccess /> },
  //   ],
  

  {
    // element: <RequireAuth />,
    // children: [
    //   {
    
    element: <AppLayout />,
    children: [
      // { path: "/profile", element: <ProfilePage /> },

      {
        // element: <RequireRole allowed={["superAdmin"]} />,
        children: [
          
          { path: "home", element: <SuperAdminHomePage /> },
          { path: "pharmacies", element: <SuperAdminPharmacies /> },
          { path: "pharmacies/create", element: <SuperAdminAddPharmacy /> },
          { path: "warehouses", element: <SuperAdminWarehouses /> },
          { path: "warehouses/create", element: <SuperAdminAddWarehouse /> },
          { path: "admins", element: <SuperAdminAdmins /> },
          { path: "admins/create", element: <SuperAdminAddAdmin /> },
          { path: "settings", element: <ProfilePage /> },
          { path: "warehouse/home", element: <WarehouseHomePage />,},
          { path: "warehouse/inventory", element: <WarehouseInventoryPage /> },
          { path: "warehouse/orders", element: <WarehouseOrdersPage /> },
        ],
      },
    ],
    //   },
    // ],
  },
]);

export default router;
