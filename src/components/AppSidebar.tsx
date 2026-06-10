import { useState } from "react";

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
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import {
  type Role,
  getRoleFromAuthToken,
  getStoredRole,
} from "@/lib/roles";

import {
  FiAlertTriangle,
  FiFileText,
  FiHome,
  FiPlusCircle,
  FiShoppingCart,
  FiSlash,
} from "react-icons/fi";

import { LuWarehouse } from "react-icons/lu";

import {
  MdOutlineLocalPharmacy,
  MdOutlinePeopleAlt,
  MdOutlineReceiptLong,
  MdOutlineRateReview,
} from "react-icons/md";

import { NavLink, useLocation } from "react-router-dom";

import { useGetCartStatus } from "@/hooks/pharmacy/useGetCart";

import { useGetMedicine } from "@/hooks/pharmacy/useGetMedicine";

import { useCreateFeedbackP } from "@/hooks/pharmacy/useCreateFeedbackP";

import { useCreateFeedbackW } from "@/hooks/warehouse/useCreateFeedbackW";

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

import type { IconType } from "react-icons";

type SidebarSubItem = {
  label: string;
  to: string;
  icon: IconType;
  requiresCart?: boolean;
};

type SidebarItem = {
  label: string;
  to: string;
  icon: IconType;
  requiresStockIssue?: boolean;
  children?: SidebarSubItem[];
};

const menuItemClass =
  "!text-slate-900 hover:bg-[rgba(15,143,139,0.08)] hover:!text-[#0f8f8b] data-[active=true]:bg-[rgba(15,143,139,0.16)] data-[active=true]:!text-[#0f8f8b] dark:!text-white";

const subMenuItemClass =
  "text-slate-900 hover:bg-[rgba(15,143,139,0.08)] hover:text-[#0f8f8b] data-[active=true]:bg-[rgba(15,143,139,0.16)] data-[active=true]:text-[#0f8f8b] dark:text-white";

const isRouteActive = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(path + "/");

const sidebarItemsByRole: Record<Role, SidebarItem[]> = {
  superadmin: [
    {
      label: "Dashboard",
      to: "/home",
      icon: FiHome,
    },

    {
      label: "Pharmacies",
      to: "/pharmacies",
      icon: MdOutlineLocalPharmacy,
    },

    {
      label: "Warehouses",
      to: "/warehouses",
      icon: LuWarehouse,
    },

    {
      label: "Admins",
      to: "/admins",
      icon: MdOutlinePeopleAlt,
    },
  ],

  admin: [
    {
      label: "Dashboard",
      to: "/home",
      icon: FiHome,
    },

    {
      label: "Pharmacies",
      to: "/pharmacies",
      icon: MdOutlineLocalPharmacy,
    },

    {
      label: "Warehouses",
      to: "/warehouses",
      icon: LuWarehouse,
    },
  ],

  pharmacies: [
    {
      label: "Sales Cart",
      to: "/pharmacy/sales-cart",
      icon: FiShoppingCart,

      children: [
        {
          label: "Sales Invoices",
          to: "/pharmacy/invoices/sales",
          icon: MdOutlineReceiptLong,
        },
      ],
    },

    {
      label: "Feedback Invoices",
      to: "/pharmacy/invoices/feedback",
      icon: MdOutlineRateReview,
    },

    {
      label: "Expense Invoices",
      to: "/pharmacy/invoices/expenses",
      icon: MdOutlineReceiptLong,
    },

    {
      label: "Orders",
      to: "/pharmacy/orders",
      icon: FiFileText,
    },

    {
      label: "Order Assistant",
      to: "/pharmacy/order-assistant",
      icon: FiAlertTriangle,
      requiresStockIssue: true,
    },

    {
      label: "All Medicines",
      to: "/pharmacy/medicines",
      icon: MdOutlineLocalPharmacy,

      children: [
        {
          label: "Low Stock",
          to: "/pharmacy/low-stock",
          icon: FiAlertTriangle,
        },

        {
          label: "Out of Stock",
          to: "/pharmacy/out-of-stock",
          icon: FiSlash,
        },

        {
          label: "Add Medicine",
          to: "/pharmacy/medicines/create",
          icon: FiPlusCircle,
        },
      ],
    },

    {
      label: "Warehouses",
      to: "/pharmacy/warehouses",
      icon: LuWarehouse,

      children: [
        {
          label: "Cart",
          to: "/pharmacy/cart",
          icon: FiShoppingCart,
          requiresCart: true,
        },
      ],
    },
  ],

  warehouse: [
    {
      label: "Dashboard",
      to: "/warehouse/home",
      icon: FiHome,
    },

    {
      label: "Orders",
      to: "/warehouse/orders",
      icon: FiFileText,
    },

    {
      label: "All Medicines",
      to: "/warehouse/inventory",
      icon: MdOutlineLocalPharmacy,

      children: [
        {
          label: "Low Stock",
          to: "/warehouse/low-stock",
          icon: FiAlertTriangle,
        },

        {
          label: "Out of Stock",
          to: "/warehouse/out-of-stock",
          icon: FiSlash,
        },

        {
          label: "Add Medicine",
          to: "/warehouse/add-medicine",
          icon: FiPlusCircle,
        },
      ],
    },

    {
      label: "Invoices",
      to: "/warehouse/invoices/feedback",
      icon: MdOutlineReceiptLong,
    },

    {
      label: "Expense Invoices",
      to: "/warehouse/invoices/expenses",
      icon: MdOutlineReceiptLong,
    },
  ],
};

export function AppSidebar() {
  const location = useLocation();

  const role = getRoleFromAuthToken() ?? getStoredRole();

  const items = role ? (sidebarItemsByRole[role] ?? []) : [];

  const { data: cartStatus } = useGetCartStatus(role === "pharmacies");
  const { data: pharmacyMedicines = [] } = useGetMedicine(
    role === "pharmacies",
  );

  const { mutate: createPharmacyFeedback, isPending: isCreatingPharmacyFeedback } =
    useCreateFeedbackP();

  const { mutate: createWarehouseFeedback, isPending: isCreatingWarehouseFeedback } =
    useCreateFeedbackW();

  const isCartDisabled = !cartStatus?.cartExists;
  const hasStockIssue = pharmacyMedicines.some(
    (medicine) =>
      medicine.quantity === 0 ||
      (medicine.quantity > 0 && medicine.quantity < 5),
  );

  const canSendFeedback = role === "pharmacies" || role === "warehouse";
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const isCreatingFeedback =
    isCreatingPharmacyFeedback || isCreatingWarehouseFeedback;

  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = feedbackText.trim();
    if (!content) return;

    const options = {
      onSuccess: () => {
        toast.success("Feedback sent successfully.");
        setFeedbackText("");
        setFeedbackDialogOpen(false);
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error, "Failed to send feedback."));
      },
    };

    if (role === "pharmacies") {
      createPharmacyFeedback({ content }, options);
      return;
    }

    if (role === "warehouse") {
      createWarehouseFeedback({ content }, options);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="!top-16 !bottom-0 z-20 !h-[calc(100svh-4rem)]"
    >
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const disabled = item.requiresStockIssue && !hasStockIssue;

            return (
              <SidebarMenuItem key={item.label}>
                {disabled ? (
                  <SidebarMenuButton
                    size="lg"
                    aria-disabled
                    className="text-base text-slate-400 dark:text-white/40 [&>svg]:size-5"
                  >
                    <Icon />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={isRouteActive(location.pathname, item.to)}
                    className={`text-base [&>svg]:size-5 ${menuItemClass}`}
                  >
                    <NavLink to={item.to}>
                      <Icon />

                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                )}

                {item.children && (
                  <SidebarMenuSub>
                    {item.children.map((sub) => {
                      const SubIcon = sub.icon;

                      const disabled = sub.requiresCart && isCartDisabled;

                      return (
                        <SidebarMenuSubItem key={sub.label}>
                          {disabled ? (
                            <SidebarMenuSubButton
                              aria-disabled
                              className="text-slate-400 dark:text-white/40"
                            >
                              <SubIcon />

                              <span>{sub.label}</span>
                            </SidebarMenuSubButton>
                          ) : (
                            <SidebarMenuSubButton
                              asChild
                              isActive={isRouteActive(
                                location.pathname,
                                sub.to,
                              )}
                              className={subMenuItemClass}
                            >
                              <NavLink to={sub.to}>
                                <SubIcon />

                                <span>{sub.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {canSendFeedback && (
        <SidebarFooter>
          <Dialog
            open={feedbackDialogOpen}
            onOpenChange={setFeedbackDialogOpen}
          >
            <DialogTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={`text-base [&>svg]:size-5 ${menuItemClass}`}
              >
                <MdOutlineRateReview />

                <span className="group-data-[collapsible=icon]:hidden">
                  Feedback
                </span>
              </SidebarMenuButton>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <DialogHeader>
                <DialogTitle className="text-blue-800 dark:text-blue-300">
                  Send Feedback
                </DialogTitle>
                <DialogDescription className="text-blue-600 dark:text-blue-300">
                  Write a message for the admin team.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
                <textarea
                  value={feedbackText}
                  onChange={(event) => setFeedbackText(event.target.value)}
                  placeholder="Write feedback..."
                  rows={5}
                  className="w-full resize-none rounded-xl border bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isCreatingFeedback}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={!feedbackText.trim() || isCreatingFeedback}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isCreatingFeedback ? "Sending..." : "Send Feedback"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
