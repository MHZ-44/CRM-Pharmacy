import { useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DEFAULT_ROLE,
  type Role,
  getRoleFromAuthToken,
  getStoredRole,
} from "@/lib/roles";
import {
  FiAlertTriangle,
  FiHome,
  FiPlusCircle,
  FiShoppingCart,
  FiSlash,
} from "react-icons/fi";
import { LuWarehouse } from "react-icons/lu";
import {
  MdOutlineLocalPharmacy,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
} from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { useGetCartStatus } from "@/hooks/pharmacy/useGetCart";

type SidebarItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const sidebarItemsByRole: Record<Role, SidebarItem[]> = {
  superadmin: [
    { label: "Dashboard", to: "/home", icon: FiHome },
    { label: "Pharmacies", to: "/pharmacies", icon: MdOutlineLocalPharmacy },
    { label: "Warehouses", to: "/warehouses", icon: LuWarehouse },
    { label: "Admins", to: "/admins", icon: MdOutlinePeopleAlt },
  ],

  admin: [
    { label: "Dashboard", to: "/home", icon: FiHome },
    { label: "Pharmacies", to: "/pharmacies", icon: MdOutlineLocalPharmacy },
    { label: "Warehouses", to: "/warehouses", icon: LuWarehouse },
  ],

  warehouse: [
    { label: "Dashboard", to: "/warehouse/home", icon: FiHome },
    { label: "Inventory", to: "/warehouse/inventory", icon: LuWarehouse },
    { label: "Orders", to: "/warehouse/orders", icon: MdOutlineLocalPharmacy },
  ],

  pharmacies: [
    { label: "Dashboard", to: "/", icon: FiHome },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, open, setOpen } = useSidebar();
  const expandedByHoverRef = useRef(false);

  const role = getRoleFromAuthToken() ?? getStoredRole() ?? DEFAULT_ROLE;
  const sidebarItems = sidebarItemsByRole[role];
  const isPharmacy = role === "pharmacies";
  const pharmacyItems: SidebarItem[] = [
    { label: "Warehouses", to: "/pharmacy/warehouses", icon: LuWarehouse },
  ];
  const { data: cartStatus } = useGetCartStatus();
  const isCartDisabled = cartStatus ? !cartStatus.cartExists : false;

  const isSettingsActive =
    location.pathname === "/settings" ||
    location.pathname.startsWith("/settings/");

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => {
        if (isMobile || open) return;
        expandedByHoverRef.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (isMobile || !expandedByHoverRef.current) return;
        expandedByHoverRef.current = false;
        setOpen(false);
      }}
      className={
        isPharmacy
          ? "top-16 h-[calc(100svh-4rem)] border-r border-blue-200/60 bg-gradient-to-b from-white via-slate-100 to-blue-50 shadow-lg transition-colors duration-500 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800"
          : "top-16 h-[calc(100svh-4rem)] bg-gradient-to-b from-white via-slate-200 to-blue-100 shadow-lg transition-colors duration-500"
      }
    >
      {isPharmacy ? (
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                isActive={
                  location.pathname === "/" ||
                  location.pathname.startsWith("/pharmacy/low-stock") ||
                  location.pathname.startsWith("/pharmacy/out-of-stock")
                }
                className={`text-base [&>svg]:size-5 ${
                  location.pathname === "/" ||
                  location.pathname.startsWith("/pharmacy/low-stock") ||
                  location.pathname.startsWith("/pharmacy/out-of-stock")
                    ? "bg-blue-200 text-blue-800 font-semibold"
                    : "text-blue-700 hover:bg-blue-100"
                }`}
              >
                <NavLink to="/">
                  <MdOutlineLocalPharmacy />
                  <span className="group-data-[collapsible=icon]:hidden">
                    All Medicines
                  </span>
                </NavLink>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location.pathname.startsWith("/pharmacy/low-stock")}
                    className="text-blue-700"
                  >
                    <NavLink to="/pharmacy/low-stock">
                      <FiAlertTriangle />
                      <span>Low Stock</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location.pathname.startsWith(
                      "/pharmacy/out-of-stock",
                    )}
                    className="text-blue-700"
                  >
                    <NavLink to="/pharmacy/out-of-stock">
                      <FiSlash />
                      <span>Out of Stock</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location.pathname === "/pharmacy/medicines/create"}
                    className="text-blue-700"
                  >
                    <NavLink to="/pharmacy/medicines/create">
                      <FiPlusCircle />
                      <span>Add Medicine</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {pharmacyItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                location.pathname.startsWith(item.to + "/");

              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={isActive}
                    className={`text-base [&>svg]:size-5 ${
                      isActive
                        ? "bg-blue-200 text-blue-800 font-semibold"
                        : "text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    <NavLink to={item.to}>
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                  {item.label === "Warehouses" && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        {isCartDisabled ? (
                          <SidebarMenuSubButton
                            size="md"
                            aria-disabled
                            className="text-blue-700/60"
                          >
                            <FiShoppingCart />
                            <span>Cart</span>
                          </SidebarMenuSubButton>
                        ) : (
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === "/pharmacy/cart"}
                            className="text-blue-700"
                          >
                            <NavLink to="/pharmacy/cart">
                              <FiShoppingCart />
                              <span>Cart</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        )}
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      ) : (
        <SidebarContent>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                location.pathname.startsWith(item.to + "/");

              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={isActive}
                    className={`text-base [&>svg]:size-5 ${
                      isActive
                        ? "bg-blue-200 text-blue-800 font-semibold"
                        : "text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    <NavLink to={item.to}>
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      )}

      <SidebarFooter>
        <SidebarMenuButton
          asChild
          size="lg"
          isActive={isSettingsActive}
          className={isPharmacy ? "text-base" : undefined}
        >
          <NavLink to="/settings">
            <MdOutlineSettings />
            <span className="group-data-[collapsible=icon]:hidden">
              Settings
            </span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
