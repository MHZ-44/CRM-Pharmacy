import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetProfile } from "@/hooks/useGetProfile";

function ProfilePage() {
  const { data, isLoading, isError, error } = useGetProfile();

  return (
    <div
      className="min-h-full w-full 
      bg-gradient-to-br from-white via-slate-200 to-blue-100
      dark:from-gray-900 dark:via-slate-900 dark:to-blue-950
      transition-colors duration-500"
    >
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        </div>

        <Card className="w-full rounded-lg border bg-white dark:bg-gray-900 shadow-lg">
          <CardHeader className="border-b dark:border-gray-800">
            <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">
              Account Details
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your personal information and role.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <p className="text-muted-foreground">Loading profile...</p>
            ) : isError ? (
              <p className="text-destructive">
                {error?.message || "Failed to load profile."}
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Name
                  </p>
                  <p className="mt-2 text-base font-medium">
                    {data?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Role
                  </p>
                  <p className="mt-2 text-base font-medium">
                    {data?.role ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-2 text-base font-medium">
                    {data?.email ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Phone
                  </p>
                  <p className="mt-2 text-base font-medium">
                    {data?.phone ?? "—"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Region
                  </p>
                  <p className="mt-2 text-base font-medium">
                    {data?.regionName ?? "—"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
