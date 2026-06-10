# Current Status

PharmaLink is a build-ready React 19 + TypeScript + Vite frontend for a pharmacy CRM. The app currently supports role-based workspaces for Super Admin, Admin, Pharmacy, and Warehouse users.

The project passes:

- `npm run lint`
- `npm run build`

The active architecture is:

`pages -> hooks -> api wrappers -> backend`

The API layer uses a shared Axios instance, React Query manages server state, and React Router protects routes through role guards.

# Completed Features

- Role-based routing for Super Admin, Admin, Pharmacy, and Warehouse users.
- Public login route at `/login`.
- Public reset password route at `/reset-password`.
- Admin direct login with `{ login, password }`.
- Pharmacy and Warehouse OTP login flow.
- OTP verification and resend flow.
- Role-aware password reset.
- Axios authorization header from stored auth token.
- 401 auth clearing behavior.
- Role-based sidebar navigation.
- Sidebar feedback dialog for Pharmacy and Warehouse roles.
- Super Admin dashboard route.
- Super Admin admin list and create routes.
- Admin/Super Admin pharmacy CRUD views.
- Admin/Super Admin warehouse CRUD views.
- Admin promotion hook.
- Pharmacy medicine list, low stock, out of stock, and add medicine pages.
- Pharmacy barcode product lookup through medicine hooks/pages.
- Pharmacy warehouse list and warehouse medicines pages.
- Pharmacy warehouse rating display/create flow.
- Pharmacy order cart flow.
- Pharmacy sales cart flow.
- Pharmacy sales invoice list/detail pages.
- Pharmacy feedback invoice list/detail pages.
- Pharmacy expense invoice list/create/detail pages.
- Pharmacy orders and order details pages.
- Pharmacy order assistant proposal and apply flow.
- Warehouse dashboard page.
- Warehouse inventory, low stock, out of stock, and add medicine pages.
- Warehouse pending orders page with approve/reject hooks.
- Warehouse invoice list/detail pages.
- Warehouse expense invoice create/list/detail pages.
- Light/dark theme support.
- Vendor chunk splitting in Vite config.

# Active Modules

- `src/api/axios.ts`
- `src/api/fetcher.ts`
- `src/api/mutator.ts`
- `src/components/AppLayout.tsx`
- `src/components/AppSidebar.tsx`
- `src/components/Navbar.tsx`
- `src/components/RoleRoutePages.tsx`
- `src/components/BarcodeScanner.tsx`
- `src/components/DeleteDialog.tsx`
- `src/components/StarRating.tsx`
- `src/components/ui/*`
- `src/entities/*`
- `src/hooks/auth/*`
- `src/hooks/pharmacy/*`
- `src/hooks/superAdmin/*`
- `src/hooks/warehouse/*`
- `src/hooks/useGetProfile.ts`
- `src/lib/roles.ts`
- `src/lib/route-guards.tsx`
- `src/lib/getApiErrorMessage.ts`
- `src/lib/locations.ts`
- `src/lib/normalizeDateSearch.ts`
- `src/lib/utils.ts`
- `src/pages/auth/*`
- `src/pages/admin/*`
- `src/pages/superAdmin/*`
- `src/pages/pharmacy/*`
- `src/pages/warehouse/*`
- `src/routes.tsx`
- `src/main.tsx`

# Incomplete Features

- Warehouse issue-order handling exists through `useGetIssueOrder`, but no active route is dedicated to issue orders.
- Warehouse expense invoice update and delete hooks exist but are not currently wired into routed pages.
- Production API configuration is incomplete because `src/api/axios.ts` uses `http://127.0.0.1:8000` directly.
- OTP frontend timing is implemented as 5 minutes for expiry and 60 seconds for resend cooldown, but backend timing still needs confirmation.
- Some backend response contracts still need verification before production, especially auth and invoice response shapes.

# Technical Debt

- Warehouse hook filenames contain typos:
  - `useGetOrdes.ts`
  - `useGetPendingOdreds.ts`
- Pharmacy role is stored as `pharmacies` while UI labels display `Pharmacist`.
- Order query keys are not fully standardized:
  - Pharmacy order list uses `["order", paramsString]`.
  - Warehouse order flows use `["orders", ...]`.
- Some hooks define local DTO/normalization types instead of shared entity types.
- `pharmalink-logo.png` is large and should be optimized.
- `src/components/ui/alert.tsx` and `src/components/ui/checkbox.tsx` are retained UI primitives but are not currently imported.
- `console.error` remains in `BarcodeScanner.tsx` for camera startup failure reporting.

# Known Issues

- API base URL is hardcoded to localhost.
- Warehouse issue-order hook is not exposed in active navigation.
- Warehouse expense invoice update/delete hooks are not connected to UI.
- There are no automated tests for role guards, auth redirects, or cache invalidation behavior.
- Backend contract mismatches may still appear at runtime because the frontend relies on several normalized API response shapes.

# Architecture Risks

- Hardcoded API base URL blocks clean environment switching for staging/production.
- Mixed `.tsx` and `.jsx` files are supported by the current config, but type coverage is weaker in JSX pages.
- Query key differences between `order` and `orders` can cause stale order data if future pages start sharing flows.
- Role naming is normalized in frontend code, but backend role naming must remain compatible with `src/lib/roles.ts`.
- The auth flow stores role separately from the token when the token is not a JWT or does not contain role claims.
- Some planned hooks may drift from backend behavior if not wired and tested soon.

# High Priority TODOs

- Move Axios `baseURL` to an environment variable.
- Confirm backend response contracts for Admin, Pharmacy, and Warehouse auth.
- Confirm OTP expiry/resend timing with backend behavior.
- Verify all invoice details pages against real backend responses.
- Standardize order query keys after testing pharmacy and warehouse order screens.
- Optimize `src/assets/pharmalink-logo.png`.

# Medium Priority TODOs

- Wire or intentionally remove warehouse expense invoice update/delete hooks after confirming required UI behavior.
- Add a route/page for warehouse issue orders if that workflow is required.
- Rename misspelled warehouse hook files with import-safe refactors.
- Move reused response DTOs into `src/entities`.
- Add tests for route guards and role redirects.
- Add tests for cart/order cache invalidation.

# Low Priority TODOs

- Review dependencies for unused packages.
- Consider route-level lazy loading if bundle growth continues.
- Review unimported UI primitives and keep only the primitives expected by the design system.
- Improve documentation with backend response examples once contracts stabilize.
- Add a deployment checklist.

# Recommended Next Development Steps

1. Move API base URL to Vite environment configuration and verify local behavior remains unchanged.
2. Test login flows for Admin, Pharmacy, and Warehouse against the backend.
3. Confirm password reset endpoints and OTP timing with backend responses.
4. Test pharmacy order cart, sales cart, order assistant, and invoice flows end to end.
5. Test warehouse inventory, pending orders, approve/reject, invoices, and expense invoices end to end.
6. Decide whether warehouse issue orders need a routed page.
7. Decide whether warehouse expense invoice update/delete should be connected to UI.
8. Standardize order query keys only after the order flows are verified.
9. Rename typoed hook files in a focused refactor.
10. Optimize the logo asset and add deployment documentation.
