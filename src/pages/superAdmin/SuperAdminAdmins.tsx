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
import { Link } from "react-router-dom";

function SuperAdminAdmins() {
  const { data, isLoading, isError, error } = useGetAdmins();
  const admins = data ?? [];
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

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
          <Link to={"create"}>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
            >
              Add Admin
            </Button>
          </Link>
        </div>

        {/* الجدول */}
        <div className="w-full rounded-lg border bg-white dark:bg-gray-900 shadow-lg">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left">
              {isLoading
                ? "Loading admins..."
                : isError
                ? "Failed to load admins"
                : admins.length === 0
                ? "No admins found"
                : `Showing ${admins.length} admin${admins.length === 1 ? "" : "s"}`}
            </TableCaption>
            <TableHeader className="bg-blue-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[240px] px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Email
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Number
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Location
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-base text-blue-800 dark:text-blue-300">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-6 text-base text-muted-foreground">
                    Loading admins...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-6 text-base text-destructive">
                    {error?.message || "Failed to load admins."}
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-6 text-base text-muted-foreground">
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="px-6 py-4 text-base font-medium text-blue-900 dark:text-blue-200">
                      {admin.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-gray-600 dark:text-gray-400">
                      {admin.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-blue-900 dark:text-blue-200">
                      {admin.phone}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-blue-900 dark:text-blue-200">
                      {admin.regionName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
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
