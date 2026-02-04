import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import SuperAdminAdmins from "./pages/superAdmin/SuperAdminAdmins";
import SuperAdminHomePage from "./pages/superAdmin/SuperAdminHomePage";
import SuperAdminPharmacies from "./pages/superAdmin/SuperAdminPharmacies";
import SuperAdminWarehouses from "./pages/superAdmin/SuperAdminWarehouses";

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
          // { path: "pharmacies/create", element: <SuperAdminCreatePharmacy /> },
          { path: "warehouses", element: <SuperAdminWarehouses /> },
          // {
          //   path: "warehouses/create",
          //   element: <SuperAdminCreateWarehouse />,
          // },
          { path: "admins", element: <SuperAdminAdmins /> },
          // { path: "admins/create", element: <SuperAdminCreateAdmin /> },
        ],
      },
    ],
    //   },
    // ],
  },
]);

export default router;
