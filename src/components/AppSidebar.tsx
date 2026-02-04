import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  match?: string;
};

const sidebarItemsByRole: Record<Role, SidebarItem[]> = {
  superadmin: [
    { label: "Home Page", to: "/", match: "/", icon: FiHome },
    { label: "Pharmacies", to: "/pharmacies", icon: MdOutlineLocalPharmacy },
    { label: "Warehouses", to: "/warehouses", icon: LuWarehouse },
    { label: "Admins", to: "/admins", icon: MdOutlinePeopleAlt },
  ],
  admin: [
    { label: "Home Page", to: "/", match: "/", icon: FiHome },
    { label: "Pharmacies", to: "/pharmacies", icon: MdOutlineLocalPharmacy },
    { label: "Warehouses", to: "/warehouses", icon: LuWarehouse },
  ],
  warehouses: [
    { label: "Home Page", to: "/", match: "/", icon: FiHome },
    { label: "Warehouses", to: "/warehouses", icon: LuWarehouse },
  ],
  pharmacies: [
    { label: "Home Page", to: "/", match: "/", icon: FiHome },
    { label: "Pharmacies", to: "/pharmacies", icon: MdOutlineLocalPharmacy },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const role = getStoredRole() ?? DEFAULT_ROLE;
  const sidebarItems = sidebarItemsByRole[role];

  return (
    <Sidebar collapsible="icon" className="top-16 h-[calc(100svh-4rem)]">
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => {
            const isActive = item.match
              ? location.pathname === item.match ||
                location.pathname.startsWith(item.match + "/")
              : location.pathname === item.to ||
                location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  isActive={isActive}
                  className="text-base [&>svg]:size-5"
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
        <SidebarMenuButton asChild size="lg" className="text-base [&>svg]:size-5">
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
