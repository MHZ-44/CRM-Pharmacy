import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetProfile } from "@/hooks/useGetProfile";
import pharmalinkLogo from "@/assets/pharmalink-logo.png";

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
      <div className="flex h-16 items-center justify-between gap-4 pr-6">
        <div className="flex min-w-0 items-center">
          <div className="flex w-14 shrink-0 items-center justify-center">
            <SidebarTrigger className="size-9 text-slate-700 hover:bg-[#0f8f8b]/10 hover:text-[#0f8f8b] dark:text-slate-200 dark:hover:text-[#49c7c2]" />
          </div>

          <div className="flex h-35 w-35 shrink-0 items-center justify-center overflow-hidden">
            <img
              src={pharmalinkLogo}
              alt="PharmaLink logo"
              className="max-h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-4">
          <ModeToggle />
          <div className="flex min-w-0 items-center gap-3">
            <Avatar size="lg" className="h-10 w-10">
              <AvatarImage src="/avatar.png" alt="User avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 sm:block">
              <p className="max-w-40 truncate text-sm font-medium leading-none text-[#0f8f8b] dark:text-[#49c7c2]">
                {profile?.name ?? "Unknown User"}
              </p>
              <p className="mt-1 max-w-40 truncate text-xs text-muted-foreground dark:text-gray-400">
                {profile?.role ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
