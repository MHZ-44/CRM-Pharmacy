import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./components/AppLayout";
import {
  AddPharmacyPageByRole,
  AddWarehousePageByRole,
  HomePageByRole,
  PharmaciesPageByRole,
  WarehousesPageByRole,
} from "./components/RoleRoutePages";
import { RequireRole, RoleHomeRedirect } from "./lib/route-guards";

import LoginPage from "./pages/auth/LoginPage";

import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// =========================
// Admin / SuperAdmin
// =========================

import SuperAdminAdmins from "./pages/superAdmin/SuperAdminAdmins";

import SuperAdminAddAdmin from "./pages/superAdmin/SuperAdminAddAdmin";

// =========================
// Pharmacy
// =========================

import PharmacyMedicine from "./pages/pharmacy/PharmacyMedicine";

import PharmacyLowStockMedicine from "./pages/pharmacy/PharmacyLowStockMedicine";

import PharmacyOutOfStockMedicine from "./pages/pharmacy/PharmacyOutOfStockMedicine";

import PharmacyAddMedicine from "./pages/pharmacy/PharmacyAddMedicine";

import PharmacyShowWarehouses from "./pages/pharmacy/PharmacyShowWarehouses";

import PharmacyWarehouseMedicines from "./pages/pharmacy/PharmacyWarehouseMedicines";

import PharmacyCart from "./pages/pharmacy/PharmacyCart";

import PharmacySalesInvoices from "./pages/pharmacy/PharmacySalesInvoices";

import PharmacySalesInvoiceDetails from "./pages/pharmacy/PharmacySalesInvoiceDetails";

import PharmacySalesCart from "./pages/pharmacy/PharmacySalesCart";

import PharmacyFeedbackInvoices from "./pages/pharmacy/PharmacyFeedbackInvoices";

import PharmacyFeedbackInvoiceDetails from "./pages/pharmacy/PharmacyFeedbackInvoiceDetails";

import PharmacyExpenseInvoices from "./pages/pharmacy/PharmacyExpenseInvoices";

import PharmacyExpenseInvoiceDetails from "./pages/pharmacy/PharmacyExpenseInvoiceDetails";

import PharmacyOrders from "./pages/pharmacy/PharmacyOrders";

import PharmacyOrderDetails from "./pages/pharmacy/PharmacyOrderDetails";

import PharmacyOrderAssistant from "./pages/pharmacy/PharmacyOrderAssistant";

// =========================
// Warehouse
// =========================

import WarehouseHomePage from "./pages/warehouse/WarehouseHomePage";

import WarehouseAddMedicine from "./pages/warehouse/WarehouseAddMedicinePage";

import WarehouseInventory from "./pages/warehouse/WarehouseInventoryPage";

import WarehouseOrders from "./pages/warehouse/WarehouseOrdersPage";

import WarehouseLowStockMedicine from "./pages/warehouse/WarehouseLowStockMedicinePage";

import WarehouseOutOfStockMedicine from "./pages/warehouse/WarehouseOutOfStockMedicinePage";

import WarehouseInvoices from "./pages/warehouse/WarehouseInvoices";

import WarehouseOrderDetails from "./pages/warehouse/WarehouseOrderDetails";

import WarehouseCreateExpenseInvoice from "./pages/warehouse/WarehouseCreateExpenseInvoices";

import WarehouseExpenseInvoiceDetails from "./pages/warehouse/WarehouseExpenseInvoiceDetails";

const router = createBrowserRouter([
  {
    path: "/login",

    element: <LoginPage />,
  },

  {
    path: "/reset-password",

    element: <ResetPasswordPage />,
  },

  {
    path: "/",

    element: <AppLayout />,

    children: [
      // =========================
      // Default redirect
      // =========================

      {
        index: true,

        element: <RoleHomeRedirect />,
      },

      // =========================
      // Admin / SuperAdmin Routes
      // =========================

      {
        element: <RequireRole allowed={["admin", "superadmin"]} />,

        children: [
          {
            path: "home",

            element: <HomePageByRole />,
          },

          {
            path: "pharmacies",

            element: <PharmaciesPageByRole />,
          },

          {
            path: "pharmacies/create",

            element: <AddPharmacyPageByRole />,
          },

          {
            path: "warehouses",

            element: <WarehousesPageByRole />,
          },

          {
            path: "warehouses/create",

            element: <AddWarehousePageByRole />,
          },
        ],
      },

      {
        element: <RequireRole allowed={["superadmin"]} />,

        children: [
          {
            path: "admins",

            element: <SuperAdminAdmins />,
          },

          {
            path: "admins/create",

            element: <SuperAdminAddAdmin />,
          },
        ],
      },

      // =========================
      // Warehouse Routes
      // =========================

      {
        element: <RequireRole allowed={["warehouse"]} />,

        children: [
          {
            path: "warehouse/home",

            element: <WarehouseHomePage />,
          },

          {
            path: "warehouse/inventory",

            element: <WarehouseInventory />,
          },

          {
            path: "warehouse/orders",

            element: <WarehouseOrders />,
          },

          {
            path: "warehouse/add-medicine",

            element: <WarehouseAddMedicine />,
          },

          {
            path: "warehouse/low-stock",

            element: <WarehouseLowStockMedicine />,
          },

          {
            path: "warehouse/out-of-stock",

            element: <WarehouseOutOfStockMedicine />,
          },

          {
            path: "warehouse/invoices/feedback",

            element: <WarehouseInvoices />,
          },

          {
            path: "warehouse/invoices/feedback/:invoiceId",

            element: <WarehouseOrderDetails />,
          },

          {
            path: "warehouse/invoices/expenses",

            element: <WarehouseCreateExpenseInvoice />,
          },

          {
            path: "warehouse/invoices/expenses/:invoiceId",

            element: <WarehouseExpenseInvoiceDetails />,
          },
        ],
      },

      // =========================
      // Pharmacy Routes
      // =========================

      {
        element: <RequireRole allowed={["pharmacies"]} />,

        children: [
          // Sales Cart

          {
            path: "pharmacy/sales-cart",

            element: <PharmacySalesCart />,
          },

          // Medicines

          {
            path: "pharmacy/medicines",

            element: <PharmacyMedicine />,
          },

          {
            path: "pharmacy/low-stock",

            element: <PharmacyLowStockMedicine />,
          },

          {
            path: "pharmacy/out-of-stock",

            element: <PharmacyOutOfStockMedicine />,
          },

          {
            path: "pharmacy/medicines/create",

            element: <PharmacyAddMedicine />,
          },

          // Warehouses

          {
            path: "pharmacy/warehouses",

            element: <PharmacyShowWarehouses />,
          },

          {
            path: "pharmacy/warehouses/:warehouseId/medicines",

            element: <PharmacyWarehouseMedicines />,
          },

          {
            path: "pharmacy/cart",

            element: <PharmacyCart />,
          },

          // Sales Invoices

          {
            path: "pharmacy/invoices/sales",

            element: <PharmacySalesInvoices />,
          },

          {
            path: "pharmacy/invoices/sales/:invoiceId",

            element: <PharmacySalesInvoiceDetails />,
          },

          // Feedback Invoices

          {
            path: "pharmacy/invoices/feedback",

            element: <PharmacyFeedbackInvoices />,
          },

          {
            path: "pharmacy/invoices/feedback/:invoiceId",

            element: <PharmacyFeedbackInvoiceDetails />,
          },

          // Expense Invoices

          {
            path: "pharmacy/invoices/expenses",

            element: <PharmacyExpenseInvoices />,
          },

          {
            path: "pharmacy/invoices/expenses/:invoiceId",

            element: <PharmacyExpenseInvoiceDetails />,
          },

          // Orders

          {
            path: "pharmacy/orders",

            element: <PharmacyOrders />,
          },

          {
            path: "pharmacy/order-assistant",

            element: <PharmacyOrderAssistant />,
          },

          {
            path: "pharmacy/orders/:orderId",

            element: <PharmacyOrderDetails />,
          },
        ],
      },

      // =========================
      // Fallback
      // =========================

      {
        path: "*",

        element: <RoleHomeRedirect />,
      },
    ],
  },
]);

export default router;
