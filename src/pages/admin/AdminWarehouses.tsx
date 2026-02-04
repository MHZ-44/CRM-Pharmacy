import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

function AdminWarehouses() {
  return (
    <div className="min-h-full w-full bg-muted/30">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Warehouses</h1>
          <Link to={"create"}>
            <Button size="sm">Add Warehouse</Button>
          </Link>
        </div>

        <div className="w-full rounded-lg border bg-card shadow-sm">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left">
              Showing 1 Warehouse
            </TableCaption>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableHead className="w-[240px] px-6 py-4 text-base">
                  Warehouse Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base">
                  Owner Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base">Email</TableHead>
                <TableHead className="px-6 py-4 text-base">Number</TableHead>
                <TableHead className="px-6 py-4 text-base">Location</TableHead>
                <TableHead className="px-6 py-4 text-right text-base">
                  Added Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableCell className="px-6 py-4 text-base font-medium">
                  مستودع عبدو
                </TableCell>
                <TableCell className="px-6 py-4 text-base font-medium">
                  Muhammad Hamzah Al-masri
                </TableCell>
                <TableCell className="px-6 py-4 text-base text-muted-foreground">
                  muhammad.hamzah.almasri@gmail.com
                </TableCell>
                <TableCell className="px-6 py-4 text-base">
                  0992203599
                </TableCell>
                <TableCell className="px-6 py-4 text-base">Damascus</TableCell>
                <TableCell className="px-6 py-4 text-base">
                  24-10-2025
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdminWarehouses;
