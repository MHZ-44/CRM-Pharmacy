import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import SuperAdminAdmins from "./pages/superAdmin/SuperAdminAdmins";
import SuperAdminHomePage from "./pages/superAdmin/SuperAdminHomePage";
import SuperAdminPharmacies from "./pages/superAdmin/SuperAdminPharmacies";
import SuperAdminWarehouses from "./pages/superAdmin/SuperAdminWarehouses";
import SuperAdminAddAdmin from "./pages/superAdmin/SuperAdminAddAdmin";
import SuperAdminAddPharmacy from "./pages/superAdmin/SuperAdminAddPharmacy";
import SuperAdminAddWarehouse from "./pages/superAdmin/SuperAdminAddWarehouse";

const router = createBrowserRouter([
  // {
  //   element: <AuthLayout />,
  //   children: [
  //     { path: "/", element: <Login /> },
  //     { path: "/register", element: <Signup /> },
  //     { path: "/forgot-password", element: <ResetPassword /> },
  //     { path: "/verify-email/success", element: <VerifyEmailSuccess /> },
  //   ],
  // },

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
          { path: "", element: <SuperAdminHomePage /> },
          { path: "pharmacies", element: <SuperAdminPharmacies /> },
          { path: "pharmacies/create", element: <SuperAdminAddPharmacy /> },
          { path: "warehouses", element: <SuperAdminWarehouses /> },
          { path: "warehouses/create", element: <SuperAdminAddWarehouse /> },
          { path: "admins", element: <SuperAdminAdmins /> },
          { path: "admins/create", element: <SuperAdminAddAdmin /> },
        ],
      },
    ],
    //   },
    // ],
  },
]);

export default router;
