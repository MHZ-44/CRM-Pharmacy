import { MdOutlineLocalPharmacy } from "react-icons/md";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetProfile } from "@/hooks/useGetProfile";

export function Navbar() {
  const { data } = useGetProfile();
  const profile = data;
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "NA";

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur 
      bg-gradient-to-b from-white/80 via-white/60 to-white/40
      dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40
      transition-colors duration-500"
    >
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* شعار واسم التطبيق */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="mr-1 w-9 h-9" />
          <div className="bg-blue-500 dark:bg-blue-700 text-white flex w-10 h-10 items-center justify-center rounded-lg shadow-md">
            <MdOutlineLocalPharmacy className="w-6 h-6" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              PharmaCRM
            </p>
            <p className="text-muted-foreground dark:text-gray-400 text-sm">
              Management Suite
            </p>
          </div>
        </div>

        {/* أيقونات المستخدم وDark Mode */}
        <div className="flex items-center gap-6">
          <ModeToggle />
          <div className="flex items-center gap-3">
            <Avatar size="lg" className="w-11 h-11">
              <AvatarImage src="/avatar.png" alt="User avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-base font-medium text-blue-800 dark:text-blue-300 leading-none">
                {profile?.name ?? "Unknown User"}
              </p>
              <p className="text-muted-foreground dark:text-gray-400 text-sm">
                {profile?.role ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
