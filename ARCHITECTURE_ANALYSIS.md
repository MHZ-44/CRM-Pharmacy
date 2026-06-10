# ARCHITECTURE_ANALYSIS

## Current Architecture

PharmaLink follows a layered frontend structure:

`pages -> hooks -> api wrappers -> backend`

Pages own UI state and user interaction. Hooks own API calls, React Query cache keys, response normalization, and mutation invalidation. The API layer centralizes Axios configuration through `src/api/axios.ts`, `src/api/fetcher.ts`, and `src/api/mutator.ts`.

The main app tree is created in `src/main.tsx`:

- `ThemeProvider`
- `QueryClientProvider`
- `RouterProvider`

The authenticated shell is `src/components/AppLayout.tsx`, which combines:

- `Navbar`
- `AppSidebar`
- `SidebarInset`
- `Outlet`
- `Toaster`

## Routing Architecture

Routes are defined in `src/routes.tsx` with `createBrowserRouter`.

Public routes:

- `/login`
- `/reset-password`

Protected route groups:

- Admin and Super Admin routes use `RequireRole allowed={["admin", "superadmin"]}`.
- Super Admin-only routes use `RequireRole allowed={["superadmin"]}`.
- Warehouse routes use `RequireRole allowed={["warehouse"]}`.
- Pharmacy routes use `RequireRole allowed={["pharmacies"]}`.

Role-specific page selection for shared Admin/Super Admin routes is isolated in `src/components/RoleRoutePages.tsx`. This keeps route configuration separate from role-switching page components and avoids React Fast Refresh lint issues in `routes.tsx`.

Fallback behavior:

- `/` uses `RoleHomeRedirect`.
- `*` uses `RoleHomeRedirect`.
- Unauthenticated users are redirected to `/login`.

## Role And Auth Architecture

Role definitions are centralized in `src/lib/roles.ts`.

Canonical frontend roles:

- `superadmin`
- `admin`
- `warehouse`
- `pharmacies`

Role helpers:

- `getStoredRole`
- `setStoredRole`
- `getStoredAuthToken`
- `clearStoredAuth`
- `getRoleFromToken`
- `getRoleFromAuthToken`
- `isRole`

`getStoredAuthToken` checks `localStorage` and `sessionStorage` for:

- `token`
- `access_token`
- `auth_token`

Route guard logic is centralized in `src/lib/route-guards.tsx`.

Auth flow is split by role:

- Admin logs in directly through `/api/admin/login`.
- Pharmacy and Warehouse login through OTP request, OTP verification, resend OTP, and then reset password.
- Password reset is role-aware and uses `/api/admin/password`, `/api/pharmacy/password`, or `/api/warehouse/password`.

Architectural concern:

- `axios.ts` still uses a hardcoded localhost base URL. This should become an environment variable before deployment.

## API Layer

`src/api/axios.ts` is the only Axios instance. It currently:

- Uses `http://127.0.0.1:8000` as `baseURL`.
- Adds `Authorization` only when a stored token exists.
- Adds `ngrok-skip-browser-warning`.
- Adds `apiKey` from `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
- Clears local/session auth storage on 401.

`src/api/fetcher.ts`:

- Provides typed GET requests.

`src/api/mutator.ts`:

- Provides a generic `mutator`.
- Exposes `post`, `patch`, `put`, and `del`.

API calls in current hooks are generally aligned with the intended architecture. Pages should not call Axios directly.

## React Query Strategy

React Query is used for server state across all role areas.

Current query key groups:

- `cart` for pharmacy order cart.
- `cart/status` for pharmacy order cart status.
- `sCart` for pharmacy sales cart.
- `pharmacy` for pharmacy product inventory.
- `warehouse` for warehouse product inventory.
- `warehouses` for warehouse list data.
- `warehouse-medicines` for pharmacy view of warehouse products.
- `order` for pharmacy orders.
- `orders` for warehouse order collections/details.
- `order-assistant` for pharmacy order assistant proposals.
- `sales-invoices` for pharmacy sales invoices.
- `feedback-invoices` for pharmacy feedback invoice views.
- `expense-invoices` for pharmacy expense invoices.
- `w-expense-invoices` for warehouse expense invoices.
- `ratings` for warehouse rating data.
- `admins`, `pharmacies`, and `warehouses` for Admin/Super Admin CRUD.
- `profile` for current profile data.

Recent cleanup separated sales and feedback invoice keys from `sCart`, reducing cache coupling between sales cart data and invoice lists.

Architectural concern:

- Some warehouse and pharmacy order hooks use singular `order` while warehouse actions invalidate plural `orders`. This currently reflects existing hook usage but should be standardized carefully after backend response testing.

## Component Architecture

Shell components:

- `AppLayout`
- `Navbar`
- `AppSidebar`

Role-aware routing component:

- `RoleRoutePages`

Reusable components:

- `BarcodeScanner`
- `DeleteDialog`
- `StarRating`
- `mode-toggle`
- theme provider/context utilities
- `components/ui/*` primitives

Sidebar behavior:

- Menu items are role-based.
- Pharmacy order assistant is disabled when pharmacy inventory has no low-stock or out-of-stock products.
- Pharmacy warehouse cart link is disabled when cart status reports no cart.
- Feedback dialog is available only for pharmacy and warehouse roles.

Navbar behavior:

- Uses `useGetProfile`.
- Shows PharmaLink logo, theme toggle, avatar fallback, name, and role.

## Entity And Type Architecture

Shared entities live in `src/entities`.

Important entities:

- `Auth.ts` for auth payloads and auth role types.
- `Order.ts` for pharmacy and warehouse order shapes.
- `OrderAssistant.ts` for order assistant proposal responses.
- `Invoices.ts` for sales and expense invoices.
- `Warehouse.ts` for warehouse and warehouse medicine data.
- `Cart.ts` for order cart and sales cart data.
- `Profile.ts` for profile responses.

Architectural concern:

- Some hooks still define local DTO types for response normalization. This is acceptable where responses are locally normalized, but shared response contracts should move to `src/entities` when reused by multiple hooks/pages.

## Implemented Page Areas

Auth:

- `LoginPage.jsx`
- `ResetPasswordPage.jsx`

Admin:

- `AdminPharmacies`
- `AdminWarehouses`
- `AdminAddPharmacy`
- `AdminAddWarehouse`

Super Admin:

- `SuperAdminHomePage`
- `SuperAdminAdmins`
- `SuperAdminAddAdmin`
- `SuperAdminPharmacies`
- `SuperAdminWarehouses`
- `SuperAdminAddPharmacy`
- `SuperAdminAddWarehouse`

Pharmacy:

- Medicines, low stock, out of stock, add medicine.
- Warehouse list and warehouse medicine list.
- Order cart and sales cart.
- Sales invoices, feedback invoices, expense invoices.
- Orders and order details.
- Order assistant.

Warehouse:

- Dashboard.
- Inventory, low stock, out of stock, add medicine.
- Orders.
- Feedback invoices and order details.
- Expense invoice create/list and detail.

## New Or Recently Introduced Files

- `src/assets/pharmalink-logo.png`
- `src/components/RoleRoutePages.tsx`
- `src/components/StarRating.tsx`
- `src/components/ui/input-otp.tsx`
- `src/entities/Auth.ts`
- `src/entities/Order.ts`
- `src/entities/OrderAssistant.ts`
- `src/hooks/auth/*`
- `src/hooks/pharmacy/useConfirmOrderAssistant.ts`
- `src/hooks/pharmacy/useCreateFeedbackP.ts`
- `src/hooks/pharmacy/useCreateIssue.ts`
- `src/hooks/pharmacy/useCreateRating.ts`
- `src/hooks/pharmacy/useGetOrderAssistant.ts`
- `src/hooks/pharmacy/useGetRating.ts`
- `src/hooks/superAdmin/useLoginA.ts`
- `src/hooks/superAdmin/useMakeAdminToSuper.ts`
- `src/hooks/warehouse/*`
- `src/lib/normalizeDateSearch.ts`
- `src/pages/auth/ResetPasswordPage.jsx`
- `src/pages/pharmacy/PharmacyOrderAssistant.tsx`
- `src/pages/pharmacy/PharmacyOrderDetails.tsx`
- `src/pages/pharmacy/PharmacyOrders.tsx`
- `src/pages/warehouse/WarehouseExpenseInvoiceDetails.tsx`
- `src/pages/warehouse/WarehouseOrderDetails.tsx`

## Removed Files

The following files were removed and should not be referenced:

- `src/App.css`
- `src/assets/react.svg`
- `src/components/login-form.tsx`
- `src/components/ScannerButton.tsx`
- `src/lib/helper.ts`
- `src/lib/index.ts`
- `src/lib/role.ts`
- `src/pages/Profile.tsx`
- `src/pages/warehouse/WarehousePendingInvoices.tsx`

## Naming And Consistency Findings

Current naming is mostly role-consistent, but these issues remain:

- Frontend pharmacy role is `pharmacies`, while labels show `Pharmacist`. This is intentional because route guards and backend-aligned role storage currently use `pharmacies`.
- Some warehouse hook filenames are misspelled:
  - `useGetOrdes.ts`
  - `useGetPendingOdreds.ts`
- Query keys use both `order` and `orders`. Do not rename casually; standardize only with page and invalidation testing.
- Warehouse expense invoice update/delete hooks exist but are not currently wired into routed pages.

## Build And Deployment Architecture

Vite config:

- React plugin.
- Tailwind CSS Vite plugin.
- `@` alias points to `./src`.
- Manual chunks split large vendor groups:
  - charts
  - icons
  - barcode
  - react-vendor
  - query-vendor
  - motion
  - http
  - radix
  - ui-utils
  - vendor

Package metadata:

- Package name is `pharmalink`.
- Main scripts are `dev`, `build`, `lint`, and `preview`.

## Current Risks

- API base URL is not environment-based.
- Large logo asset should be optimized.
- Backend response contracts should be verified for every auth and invoice hook before production release.
- OTP durations are implemented in the frontend as 5 minutes for expiry and 60 seconds for resend cooldown; backend timing should be confirmed.
- `console.error` remains in `BarcodeScanner` intentionally for camera startup failures.
- Some UI primitives are present but not currently imported, such as `alert.tsx` and `checkbox.tsx`; they are retained as shared UI primitives.

## Improvement Suggestions

High priority:

- Move Axios `baseURL` to an environment variable.
- Confirm backend auth response contracts for all roles.
- Optimize `pharmalink-logo.png`.
- Standardize order query keys after testing warehouse/pharmacy order screens.

Medium priority:

- Rename misspelled warehouse hook files with import-safe refactors.
- Wire or remove unused warehouse expense invoice update/delete hooks after confirming planned UI behavior.
- Move reused local DTOs into `src/entities`.

Low priority:

- Review package dependencies for unused libraries.
- Add route-level lazy loading if bundle size becomes an issue.
- Add tests around route guards, role redirects, and cart/order cache invalidation.
