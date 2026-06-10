import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteAdmin } from "@/hooks/superAdmin/useDeleteAdmin";
import { useGetAdmins } from "@/hooks/superAdmin/useGetAdmins";
import { useMakeAdminToSuper } from "@/hooks/superAdmin/useMakeAdminToSuper";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function SuperAdminAdmins() {
  const { data, isLoading, isError, error } = useGetAdmins();
  const admins = data ?? [];
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const { mutate: makeAdminToSuper, isPending: isPromoting } =
    useMakeAdminToSuper();

  const handlePromoteAdmin = (id: number) => {
    makeAdminToSuper(id, {
      onSuccess: () => {
        toast.success("Admin promoted to super admin.");
      },
      onError: (mutationError) => {
        toast.error(
          getApiErrorMessage(mutationError, "Failed to promote admin."),
        );
      },
    });
  };

  return (
    <div
      className="min-h-full w-full 
        bg-gradient-to-br from-white via-slate-200 to-blue-100
        dark:from-gray-900 dark:via-slate-900 dark:to-blue-950
        transition-colors duration-500"
    >
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* العنوان + زر الإضافة */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-800 dark:text-blue-300">
            Admins
          </h1>
          <Link to={"/admins/create"}>
            <Button
              size="sm"
              className="bg-[#0f8f8b] text-white hover:bg-[#0c7d79] dark:bg-[#0f8f8b] dark:hover:bg-[#0c7d79]"
            >
              Add Admin
            </Button>
          </Link>
        </div>

        {/* الجدول */}
        <div className="w-full overflow-hidden rounded-lg border border-[#0f8f8b]/20 bg-white shadow-lg dark:border-[#0f8f8b]/30 dark:bg-gray-900">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left text-[#0f8f8b] dark:text-[#49c7c2]">
              {isLoading
                ? "Loading admins..."
                : isError
                  ? "Failed to load admins"
                  : admins.length === 0
                    ? "No admins found"
                    : `Showing ${admins.length} admin${admins.length === 1 ? "" : "s"}`}
            </TableCaption>
            <TableHeader className="bg-[#0f8f8b]/10 dark:bg-[#0f8f8b]/20">
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableHead className="w-[240px] px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Email
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Number
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Location
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  Role
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-base text-[#0f8f8b] dark:text-[#49c7c2]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-6 text-base text-muted-foreground"
                  >
                    Loading admins...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-6 text-base text-destructive"
                  >
                    {error?.message || "Failed to load admins."}
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-6 text-base text-muted-foreground"
                  >
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="text-slate-800 hover:bg-[#0f8f8b]/5 data-[state=selected]:bg-[#0f8f8b]/10 dark:text-slate-100 dark:hover:bg-[#0f8f8b]/10"
                  >
                    <TableCell className="px-6 py-4 text-base font-medium text-[#0f8f8b] dark:text-[#49c7c2]">
                      {admin.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-slate-600 dark:text-slate-300">
                      {admin.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {admin.phone}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {admin.regionName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {admin.role}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!["superadmin", "super_admin"].includes(
                          admin.role.toLowerCase(),
                        ) && (
                          <Button
                            size="xs"
                            disabled={isPromoting}
                            onClick={() => handlePromoteAdmin(admin.id)}
                            className="bg-[#0f8f8b] text-white hover:bg-[#0c7d79] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#0f8f8b] dark:hover:bg-[#0c7d79]"
                          >
                            Make Super
                          </Button>
                        )}
                        <DeleteDialog
                          title="Delete admin?"
                          description="This action cannot be undone."
                          onConfirm={() => deleteAdmin(admin.id.toString())}
                          isPending={isDeleting}
                          trigger={
                            <Button
                              variant="destructive"
                              size="xs"
                              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                            >
                              Delete
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminAdmins;
