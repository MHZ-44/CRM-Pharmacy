# PROJECT_CONTEXT

## Project Status

PharmaLink is a React 19 + TypeScript + Vite frontend for a pharmacy CRM. The current app is organized around role-based workspaces for Super Admin, Admin, Pharmacy, and Warehouse users.

The main implemented flow is:

- Pharmacy medicine management.
- Pharmacy order cart and warehouse browsing.
- Pharmacy sales cart and sales invoices.
- Pharmacy order assistant.
- Warehouse medicine inventory.
- Warehouse pending orders and order actions.
- Warehouse invoices and expense invoices.
- Admin/Super Admin CRUD pages for pharmacies, warehouses, and admins.

The app currently builds successfully with `npm run build` and passes `npm run lint`.

## Tech Stack

- React 19.
- TypeScript with Vite.
- React Router via `createBrowserRouter`.
- React Query for server state.
- Axios via local API wrappers.
- Tailwind CSS and custom shadcn-style UI primitives.
- Sonner for toast notifications.
- ZXing barcode scanner.
- Recharts for dashboard charts.
- `next-themes` for light/dark theme support.

## Folder Structure

- `src/api/`
  - `axios.ts` creates the shared Axios instance.
  - `fetcher.ts` wraps GET requests.
  - `mutator.ts` wraps POST, PATCH, PUT, and DELETE requests.

- `src/components/`
  - App shell components: `AppLayout.tsx`, `AppSidebar.tsx`, `Navbar.tsx`.
  - Route helper components: `RoleRoutePages.tsx`.
  - Shared UI and behavior: `BarcodeScanner.tsx`, `DeleteDialog.tsx`, `StarRating.tsx`, theme components, and `components/ui/*`.

- `src/entities/`
  - Shared TypeScript entities for API data, including `Admin`, `Auth`, `Cart`, `Feedback`, `Invoices`, `Medicine`, `Order`, `OrderAssistant`, `Pharmacy`, `Profile`, and `Warehouse`.

- `src/hooks/`
  - `auth/` contains OTP login, OTP verification, OTP resend, and password reset hooks.
  - `pharmacy/` contains pharmacy medicines, carts, invoices, orders, order assistant, feedback, and ratings hooks.
  - `warehouse/` contains warehouse medicines, orders, invoices, feedback, and order action hooks.
  - `superAdmin/` contains admin, pharmacy, warehouse, feedback, count, login, and promotion hooks.
  - `useGetProfile.ts` loads the current profile by role.

- `src/lib/`
  - `roles.ts` stores role definitions, token lookup, role normalization, and auth clearing.
  - `route-guards.tsx` provides route guards and role-based home redirects.
  - `getApiErrorMessage.ts`, `locations.ts`, `normalizeDateSearch.ts`, and `utils.ts` provide shared utilities.

- `src/pages/`
  - `auth/` contains login and reset password pages.
  - `admin/`, `superAdmin/`, `pharmacy/`, and `warehouse/` contain role-specific pages.

## Active Routes

Public routes:

- `/login` -> `LoginPage`.
- `/reset-password` -> `ResetPasswordPage`.

Role-redirect routes:

- `/` -> `RoleHomeRedirect`.
- `*` -> `RoleHomeRedirect`.

Admin and Super Admin routes:

- `/home` -> `HomePageByRole`.
- `/pharmacies` -> `PharmaciesPageByRole`.
- `/pharmacies/create` -> `AddPharmacyPageByRole`.
- `/warehouses` -> `WarehousesPageByRole`.
- `/warehouses/create` -> `AddWarehousePageByRole`.

Super Admin-only routes:

- `/admins` -> `SuperAdminAdmins`.
- `/admins/create` -> `SuperAdminAddAdmin`.

Warehouse routes:

- `/warehouse/home` -> `WarehouseHomePage`.
- `/warehouse/inventory` -> `WarehouseInventory`.
- `/warehouse/orders` -> `WarehouseOrders`.
- `/warehouse/add-medicine` -> `WarehouseAddMedicine`.
- `/warehouse/low-stock` -> `WarehouseLowStockMedicine`.
- `/warehouse/out-of-stock` -> `WarehouseOutOfStockMedicine`.
- `/warehouse/invoices/feedback` -> `WarehouseInvoices`.
- `/warehouse/invoices/feedback/:invoiceId` -> `WarehouseOrderDetails`.
- `/warehouse/invoices/expenses` -> `WarehouseCreateExpenseInvoice`.
- `/warehouse/invoices/expenses/:invoiceId` -> `WarehouseExpenseInvoiceDetails`.

Pharmacy routes:

- `/pharmacy/sales-cart` -> `PharmacySalesCart`.
- `/pharmacy/medicines` -> `PharmacyMedicine`.
- `/pharmacy/low-stock` -> `PharmacyLowStockMedicine`.
- `/pharmacy/out-of-stock` -> `PharmacyOutOfStockMedicine`.
- `/pharmacy/medicines/create` -> `PharmacyAddMedicine`.
- `/pharmacy/warehouses` -> `PharmacyShowWarehouses`.
- `/pharmacy/warehouses/:warehouseId/medicines` -> `PharmacyWarehouseMedicines`.
- `/pharmacy/cart` -> `PharmacyCart`.
- `/pharmacy/invoices/sales` -> `PharmacySalesInvoices`.
- `/pharmacy/invoices/sales/:invoiceId` -> `PharmacySalesInvoiceDetails`.
- `/pharmacy/invoices/feedback` -> `PharmacyFeedbackInvoices`.
- `/pharmacy/invoices/feedback/:invoiceId` -> `PharmacyFeedbackInvoiceDetails`.
- `/pharmacy/invoices/expenses` -> `PharmacyExpenseInvoices`.
- `/pharmacy/invoices/expenses/:invoiceId` -> `PharmacyExpenseInvoiceDetails`.
- `/pharmacy/orders` -> `PharmacyOrders`.
- `/pharmacy/order-assistant` -> `PharmacyOrderAssistant`.
- `/pharmacy/orders/:orderId` -> `PharmacyOrderDetails`.

## Role System

Canonical frontend roles are defined in `src/lib/roles.ts`:

- `superadmin`
- `admin`
- `warehouse`
- `pharmacies`

Role normalization accepts backend-style values such as `super_admin`, `pharmacist`, `pharmacy`, and `warehouse_owner`.

Route protection is implemented in `src/lib/route-guards.tsx`:

- `RequireRole` requires both a stored token and a resolved role.
- Unauthenticated users are redirected to `/login`.
- Authenticated users with the wrong role are redirected to their role home path.
- `RoleHomeRedirect` sends users to `/home`, `/warehouse/home`, or `/pharmacy/sales-cart`.

## Authentication Flow

Admin login:

- `LoginPage.jsx` uses `useLoginA`.
- Request body is `{ login, password }`.
- Endpoint is `/api/admin/login`.
- The response token is stored in `localStorage` under `token`.
- The admin role is normalized and stored under `app_role`.

Pharmacy and Warehouse login:

- `LoginPage.jsx` uses `useOtpLogin`, `useVerifyOtpLogin`, and `useResendOtp`.
- Pharmacy login endpoint is `/api/pharmacy/login`.
- Warehouse login endpoint is `/api/warehouse/login`.
- OTP verification endpoints are `/api/pharmacy/login/verify-otp` and `/api/warehouse/login/verify-otp`.
- OTP resend endpoints are `/api/pharmacy/login/resend-otp` and `/api/warehouse/login/resend-otp`.
- The UI uses a 5-minute OTP window and a 60-second resend cooldown.
- Successful OTP verification stores the token when returned and stores the resolved role.
- After OTP verification, the user is sent to `/reset-password`.

Password reset:

- `ResetPasswordPage.jsx` uses `useResetPassword`.
- Endpoints are `/api/admin/password`, `/api/pharmacy/password`, and `/api/warehouse/password`.
- `superadmin` is treated as `admin` for password reset.
- Reset requires a stored role and token.

## API Layer

All API calls should flow through:

`pages -> hooks -> api -> backend`

Current API utilities:

- `src/api/axios.ts`
  - Base URL: `http://127.0.0.1:8000`.
  - Adds `Authorization: Bearer <token>` when a token is stored.
  - Preserves `ngrok-skip-browser-warning`.
  - Adds `apiKey` from `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
  - Clears stored auth on HTTP 401.

- `src/api/fetcher.ts`
  - GET wrapper for React Query hooks.

- `src/api/mutator.ts`
  - Generic mutator plus `post`, `patch`, `put`, and `del` helpers.

No hardcoded bearer token is present in `src/api/axios.ts`.

## Query Key Strategy

React Query keys are grouped by feature:

- Pharmacy order cart: `["cart"]`, `["cart", "status"]`.
- Pharmacy sales cart: `["sCart", paramsString]`.
- Pharmacy medicines: `["pharmacy", paramsString]`.
- Pharmacy warehouses: `["warehouses", paramsString]`.
- Pharmacy warehouse medicines: `["warehouse-medicines", id]`.
- Pharmacy orders: `["order", paramsString]`.
- Pharmacy order assistant: `["order-assistant"]`.
- Pharmacy sales invoices: `["sales-invoices", paramsString]`, `["sales-invoices", id]`.
- Pharmacy feedback invoices: `["feedback-invoices", paramsString]`, `["feedback-invoices", id]`.
- Pharmacy expense invoices: `["expense-invoices", paramsString]`, `["expense-invoices", id]`.
- Pharmacy ratings: `["ratings", warehouseId]`.
- Warehouse medicines: `["warehouse", paramsString]`.
- Warehouse orders: `["orders", "pending"]`, `["orders", "issues"]`, `["orders", id]`.
- Warehouse expense invoices: `["w-expense-invoices", paramsString]`, `["w-expense-invoices", id]`.
- Super Admin/Admin CRUD: `["admins"]`, `["pharmacies"]`, `["warehouses"]`, and related count keys.
- Profile: `["profile", currentRole]`.

Mutation hooks invalidate the closest relevant keys. Sales invoice and feedback invoice keys are intentionally separate from `sCart`.

## Implemented Features

Implemented Super Admin/Admin features:

- Dashboard route for Super Admin.
- Admin list and create route for Super Admin.
- Pharmacy CRUD views.
- Warehouse CRUD views.
- Admin promotion hook: `useMakeAdminToSuper`.
- Region selection uses `LOCATIONS`.

Implemented Pharmacy features:

- Medicine list, low stock, out of stock, and add medicine.
- Product lookup by barcode.
- Warehouse browsing and warehouse medicine browsing.
- Warehouse rating display/create flow through rating hooks and `StarRating`.
- Order cart flow.
- Sales cart flow.
- Sales invoices, feedback invoices, and expense invoices.
- Order list and order details.
- Order assistant proposal and apply hook.
- Pharmacy feedback dialog in the sidebar.

Implemented Warehouse features:

- Dashboard page.
- Inventory, low stock, out of stock, and add medicine.
- Pending order page with approve/reject hooks.
- Warehouse invoice list/detail pages.
- Warehouse expense invoice list/create/detail pages.
- Warehouse feedback dialog in the sidebar.

## Planned Or Incomplete Areas

- `useGetIssueOrder`, `useDeleteExpenseInvoicesW`, and `useUpdateExpenseInvoicesW` exist but are not currently imported by routed pages.
- Warehouse issue-order handling exists at the hook level but is not exposed as a separate active route.
- Some file names in warehouse hooks contain typos, such as `useGetOrdes.ts` and `useGetPendingOdreds.ts`; imports currently match the existing filenames.
- API base URL is fixed to localhost in `axios.ts`; production deployment needs environment-based configuration.
- The logo asset is large and should be optimized before production hosting.

## Deleted During Cleanup

The following obsolete files are no longer part of the project:

- `src/App.css`
- `src/assets/react.svg`
- `src/components/login-form.tsx`
- `src/components/ScannerButton.tsx`
- `src/lib/helper.ts`
- `src/lib/index.ts`
- `src/lib/role.ts`
- `src/pages/Profile.tsx`
- `src/pages/warehouse/WarehousePendingInvoices.tsx`

## Development Status

The project is in a build-ready frontend state. The current architecture is mostly consistent with `pages -> hooks -> api -> backend`, and the final cleanup removed hardcoded auth tokens, stale template files, dead local storage helpers, duplicate button variants, and inactive mock-only pages.

Before production deployment, the main remaining work is backend contract verification, environment configuration for the API URL, file-name cleanup for misspelled warehouse hooks, and asset optimization.
