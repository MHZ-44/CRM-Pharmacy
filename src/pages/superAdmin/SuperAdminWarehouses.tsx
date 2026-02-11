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

function SuperAdminWarehouses() {
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
            Warehouses
          </h1>
          <Link to={"create"}>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
            >
              Add Warehouse
            </Button>
          </Link>
        </div>

        {/* الجدول */}
        <div className="w-full rounded-lg border bg-white dark:bg-gray-900 shadow-lg">
          <Table className="min-w-[1100px] text-base">
            <TableCaption className="px-4 pb-4 text-left text-blue-700 dark:text-blue-300">
              Showing 1 Warehouse
            </TableCaption>
            <TableHeader className="bg-blue-100 dark:bg-gray-800">
              <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableHead className="w-[240px] px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Warehouse Name
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Owner Name
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
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Admin Add it
                </TableHead>
                <TableHead className="px-6 py-4 text-base text-blue-800 dark:text-blue-300">
                  Added Date
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-base text-blue-800 dark:text-blue-300">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-blue-50 dark:hover:bg-gray-800">
                <TableCell className="px-6 py-4 text-base font-medium text-blue-900 dark:text-blue-200">
                  مستودع عبدو
                </TableCell>
                <TableCell className="px-6 py-4 text-base font-medium text-blue-900 dark:text-blue-200">
                  Muhammad Hamzah Al-masri
                </TableCell>
                <TableCell className="px-6 py-4 text-base text-gray-600 dark:text-gray-400">
                  muhammad.hamzah.almasri@gmail.com
                </TableCell>
                <TableCell className="px-6 py-4 text-base text-blue-900 dark:text-blue-200">
                  0992203599
                </TableCell>
                <TableCell className="px-6 py-4 text-base text-blue-900 dark:text-blue-200">
                  Damascus
                </TableCell>
                <TableCell className="px-6 py-4 text-base text-blue-900 dark:text-blue-200">
                  Abdo
                </TableCell>
                <TableCell className="px-6 py-4 text-base text-blue-900 dark:text-blue-200">
                  24-10-2025
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    variant="destructive"
                    size="xs"
                    className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    onClick={() => console.log("hi")}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminWarehouses;
