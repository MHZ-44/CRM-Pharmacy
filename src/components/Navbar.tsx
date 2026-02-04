import { MdOutlineLocalPharmacy } from "react-icons/md";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="mr-1 size-9" />
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <MdOutlineLocalPharmacy className="size-6" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold">PharmaCRM</p>
            <p className="text-muted-foreground text-sm">Management Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ModeToggle />
          <div className="flex items-center gap-3">
            <Avatar size="lg" className="size-11">
              <AvatarImage src="/avatar.png" alt="User avatar" />
              <AvatarFallback>AH</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-base font-medium leading-none">Ahmed Hassan</p>
              <p className="text-muted-foreground text-sm">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
