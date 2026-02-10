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
    <div className="min-h-full w-full bg-muted/30">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Admins</h1>
          <Link to={"create"}>
            <Button size="sm">Add Admin</Button>
          </Link>
        </div>

        <div className="w-full rounded-lg border bg-card shadow-sm">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left">
              {isLoading
                ? "Loading admins..."
                : isError
                  ? "Failed to load admins"
                  : `Showing ${admins.length} admin${
                      admins.length === 1 ? "" : "s"
                    }`}
            </TableCaption>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableHead className="w-[240px] px-6 py-4 text-base">
                  Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base">Email</TableHead>
                <TableHead className="px-6 py-4 text-base">Number</TableHead>
                <TableHead className="px-6 py-4 text-base">Location</TableHead>
                <TableHead className="px-6 py-4 text-right text-base">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                  <TableCell
                    className="px-6 py-6 text-base text-muted-foreground"
                    colSpan={5}
                  >
                    Loading admins...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                  <TableCell
                    className="px-6 py-6 text-base text-destructive"
                    colSpan={5}
                  >
                    {error?.message || "Failed to load admins."}
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                  <TableCell
                    className="px-6 py-6 text-base text-muted-foreground"
                    colSpan={5}
                  >
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="hover:bg-transparent data-[state=selected]:bg-transparent"
                  >
                    <TableCell className="px-6 py-4 text-base font-medium">
                      {admin.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base text-muted-foreground">
                      {admin.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {admin.phone}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base">
                      {admin.regionName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DeleteDialog
                        title="Delete admin ?"
                        description="This action cannot be undone."
                        onConfirm={() => deleteAdmin(admin.id.toString())}
                        isPending={isDeleting}
                        trigger={
                          <Button variant="destructive" size="xs">
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
