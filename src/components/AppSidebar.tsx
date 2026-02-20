import { useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DEFAULT_ROLE, type Role, getStoredRole } from "@/lib/roles";
import { FiHome } from "react-icons/fi";
import { LuWarehouse } from "react-icons/lu";
import {
  MdOutlineLocalPharmacy,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
} from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";

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
    { label: "Dashboard", to: "/pharmacist/home", icon: FiHome },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, open, setOpen } = useSidebar();
  const expandedByHoverRef = useRef(false);

  const role = getStoredRole() ?? DEFAULT_ROLE;
  const sidebarItems = sidebarItemsByRole[role];

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
      className="top-16 h-[calc(100svh-4rem)]
        bg-gradient-to-b from-white via-slate-200 to-blue-100
        shadow-lg transition-colors duration-500"
    >
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

      <SidebarFooter>
        <SidebarMenuButton asChild size="lg" isActive={isSettingsActive}>
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