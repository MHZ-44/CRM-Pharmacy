import { useMemo, useState } from "react";
import {
  Pie,
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { LOCATIONS } from "@/lib/locations";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCountPharmacies } from "@/hooks/superAdmin/useGetCountPharmacies";
import { useGetCountWarehouses } from "@/hooks/superAdmin/useGetCountWarehouses";
import { useGetCountAdmins } from "@/hooks/superAdmin/useGetCountAdmins";
import { useGetCountPharmaciesByRegion } from "@/hooks/superAdmin/useGetCountPharmaciesByRegion";
import { useGetCountWarehousesByRegion } from "@/hooks/superAdmin/useGetCountWarehousesByRegion";
import { useGetCountAdminsByRegion } from "@/hooks/superAdmin/useGetCountAdminsByRegion";
import { useGetCountPharmaciesByAdmin } from "@/hooks/superAdmin/useGetCountPharmaciesByAdmin";
import { useGetCountWarehousesByAdmin } from "@/hooks/superAdmin/useGetCountWarehousesByAdmin";

// الإحصائيات الرئيسية
const statCards = [
  { title: "Total Admins", value: 0 },
  { title: "Total Pharmacies", value: 0 },
  { title: "Total Warehouses", value: 0 },
];

// إحصائيات كل موقع
const locationStatsBase = LOCATIONS.map((location) => ({
  location: location.label,
}));

// ألوان المخططات
const chartColors = [
  "color-mix(in oklch, oklch(0.80 0.14 215) 80%, white)", // أزرق
  "color-mix(in oklch, oklch(0.76 0.13 240) 80%, white)", // سماوي
  "color-mix(in oklch, oklch(0.78 0.12 265) 80%, white)", // نيلي
  "color-mix(in oklch, oklch(0.82 0.12 190) 80%, white)", // أزرق مخضر
  "color-mix(in oklch, oklch(0.74 0.15 290) 80%, white)", // بنفسجي فاتح
  "color-mix(in oklch, oklch(0.84 0.11 165) 80%, white)", // أخضر أزرق
];

// تكوين المخططات
const chartConfig = {
  value: { label: "Count" },
  admins: { label: "Admins", color: "var(--chart-1)" },
  pharmacies: { label: "Pharmacies", color: "var(--chart-2)" },
  warehouses: { label: "Warehouses", color: "var(--chart-3)" },
} satisfies ChartConfig;

function SuperAdminHomePage() {
  const [metric, setMetric] = useState<"admins" | "pharmacies" | "warehouses">(
    "admins",
  );
  const [adminMetric, setAdminMetric] = useState<"pharmacies" | "warehouses">(
    "pharmacies",
  );

  const { data: pharmaciesCount = 0 } = useGetCountPharmacies();
  const { data: warehousesCount = 0 } = useGetCountWarehouses();
  const { data: adminsCount = 0 } = useGetCountAdmins();
  const { data: pharmaciesByRegion } = useGetCountPharmaciesByRegion();
  const { data: warehousesCountByRegion } = useGetCountWarehousesByRegion();
  const { data: adminsByRegion } = useGetCountAdminsByRegion();
  const { data: pharmaciesByAdmin } = useGetCountPharmaciesByAdmin();
  const { data: warehousesByAdmin } = useGetCountWarehousesByAdmin();
  const locationStats = useMemo(
    () =>
      locationStatsBase.map((location) => {
        const region = location.location;
        return {
          ...location,
          admins:
            adminsByRegion?.find((item) => item.name === region)
              ?.admins_count ?? 0,
          pharmacies:
            pharmaciesByRegion?.find((item) => item.name === region)
              ?.pharmacies_count ?? 0,
          warehouses:
            warehousesCountByRegion?.find((item) => item.name === region)
              ?.warehouses_count ?? 0,
        };
      }),
    [adminsByRegion, pharmaciesByRegion, warehousesCountByRegion],
  );

  const pieData = useMemo(
    () =>
      locationStats.map((item, index) => ({
        name: item.location,
        value: item[metric],
        fill: chartColors[index % chartColors.length],
      })),
    [locationStats, metric],
  );

  const adminData = useMemo(() => {
    if (adminMetric === "warehouses") {
      return (warehousesByAdmin ?? []).map((item) => ({
        admin: item.name,
        warehouses: item.warehouses_count ?? 0,
      }));
    }

    return (pharmaciesByAdmin ?? []).map((item) => ({
      admin: item.name,
      pharmacies: item.pharmacies_count ?? 0,
    }));
  }, [adminMetric, pharmaciesByAdmin, warehousesByAdmin]);

  const adminChartTitle =
    adminMetric === "warehouses"
      ? "Warehouses Per Admin"
      : "Pharmacies Per Admin";

  statCards[0].value = adminsCount;
  statCards[1].value = pharmaciesCount;
  statCards[2].value = warehousesCount;

  return (
    <div
      className="min-h-full w-full 
      bg-gradient-to-br from-white via-slate-200 to-blue-100
      dark:from-gray-900 dark:via-slate-900 dark:to-blue-950
      transition-colors duration-500"
    >
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* العنوان */}
        <h1 className="text-4xl font-semibold tracking-tight text-blue-800 dark:text-blue-300">
          Dashboard
        </h1>

        {/* كروت الإحصائيات */}
        <div className="grid gap-4 md:grid-cols-3">
          {statCards.map((card) => (
            <Card
              key={card.title}
              className="w-full h-32 bg-white dark:bg-gray-900 shadow-lg rounded-xl"
            >
              <CardContent className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <div className="text-sm font-medium tracking-wide text-muted-foreground dark:text-gray-400">
                  {card.title}
                </div>
                <div className="text-3xl font-semibold text-blue-800 dark:text-blue-300">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* المخططات */}
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* مخطط المواقع */}
          <Card className="flex flex-col bg-white dark:bg-gray-900 shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
              <CardTitle className="text-blue-800 dark:text-blue-300">
                Locations Overview
              </CardTitle>
              <Select
                value={metric}
                onValueChange={(value) =>
                  setMetric(value as "admins" | "pharmacies" | "warehouses")
                }
              >
                <SelectTrigger className="h-10 w-[180px] bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-300 rounded-lg shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admins">Admins</SelectItem>
                  <SelectItem value="pharmacies">Pharmacies</SelectItem>
                  <SelectItem value="warehouses">Warehouses</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={pieData} dataKey="value" label nameKey="name" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="hidden" />
          </Card>

          {/* مخطط البيانات لكل مسؤول */}
          <Card className="bg-white dark:bg-gray-900 shadow-lg rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-0">
              <CardTitle className="text-blue-800 dark:text-blue-300">
                {adminChartTitle}
              </CardTitle>
              <Select
                value={adminMetric}
                onValueChange={(value) =>
                  setAdminMetric(value as "pharmacies" | "warehouses")
                }
              >
                <SelectTrigger className="h-10 w-[180px] bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-300 rounded-lg shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pharmacies">Pharmacies</SelectItem>
                  <SelectItem value="warehouses">Warehouses</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    accessibilityLayer
                    data={adminData}
                    margin={{ top: 20 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                      strokeOpacity={0.35}
                    />
                    <XAxis
                      dataKey="admin"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey={adminMetric}
                      fill={
                        adminMetric === "warehouses"
                          ? "color-mix(in oklch, oklch(0.74 0.12 190) 85%, white)"
                          : "color-mix(in oklch, oklch(0.75 0.12 240) 85%, white)"
                      }
                      radius={8}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="hidden" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminHomePage;
