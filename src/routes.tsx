import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import SuperAdminAdmins from "./pages/superAdmin/SuperAdminAdmins";
import SuperAdminCreateAdmin from "./pages/superAdmin/SuperAdminCreateAdmin";
import SuperAdminHomePage from "./pages/superAdmin/SuperAdminHomePage";

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
        // element: <RequireRole allowed={["company"]} />,
        children: [
          { path: "", element: <SuperAdminHomePage /> },
          // { path: "pharmacies", element: <AdminPharmacies /> },
          // { path: "pharmacies/create", element: <AdminCreatePharmacie /> },
          // { path: "warehouses ", element: <AdminWarehouses /> },
          // { path: "warehouses/create", element: <AdminCreateWarehouse /> },
          { path: "admins", element: <SuperAdminAdmins /> },
          { path: "admins/create", element: <SuperAdminCreateAdmin /> },
        ],
      },
    ],
    //   },
    // ],
  },
]);

export default router;
