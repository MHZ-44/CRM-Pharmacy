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

// الإحصائيات الرئيسية
const statCards = [
  { title: "Total Admins", value: "24" },
  { title: "Total Pharmacies", value: "128" },
  { title: "Total Warehouses", value: "18" },
];

// إحصائيات كل موقع
const locationStats = LOCATIONS.map((location, index) => ({
  location: location.label,
  admins: [4, 6, 3, 5, 2, 4, 3, 5, 2, 3][index] ?? 0,
  pharmacies: [18, 24, 12, 20, 9, 14, 10, 16, 8, 11][index] ?? 0,
  warehouses: [2, 3, 1, 2, 1, 2, 1, 3, 1, 2][index] ?? 0,
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

// بيانات الصيدليات لكل مسؤول
const adminPharmacyData = [
  { admin: "Hamzah", pharmacies: 22 },
  { admin: "Ahmed", pharmacies: 16 },
  { admin: "Yara", pharmacies: 14 },
  { admin: "Lina", pharmacies: 11 },
  { admin: "Omar", pharmacies: 9 },
];

function SuperAdminHomePage() {
  const [metric, setMetric] = useState<"admins" | "pharmacies" | "warehouses">(
    "admins"
  );

  const pieData = useMemo(
    () =>
      locationStats.map((item, index) => ({
        name: item.location,
        value: item[metric],
        fill: chartColors[index % chartColors.length],
      })),
    [metric]
  );

  return (
    <div className="min-h-full w-full 
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

          {/* مخطط الصيدليات لكل مسؤول */}
          <Card className="bg-white dark:bg-gray-900 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-300">
                Pharmacies Per Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    accessibilityLayer
                    data={adminPharmacyData}
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
                      dataKey="pharmacies"
                      fill="color-mix(in oklch, oklch(0.75 0.12 240) 85%, white)"
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
