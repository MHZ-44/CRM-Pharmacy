import * as React from "react";
import {
  Tooltip as RechartsTooltip,
  type TooltipProps,
  type ValueType,
  type NameType,
} from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
};

function ChartContainer({
  config,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) {
  const cssVars = Object.entries(config).reduce(
    (acc, [key, value]) => {
      if (value?.color) {
        acc[`--color-${key}` as keyof React.CSSProperties] = value.color;
      }
      return acc;
    },
    {} as React.CSSProperties
  );

  return (
    <div
      data-slot="chart-container"
      className={cn("w-full", className)}
      style={{ ...cssVars, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

type ChartTooltipContentProps = {
  hideLabel?: boolean;
} & TooltipProps<ValueType, NameType>;

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-background text-foreground border-border min-w-[160px] rounded-md border px-3 py-2 text-sm shadow-md">
      {!hideLabel && (
        <div className="text-muted-foreground mb-1 text-xs">{label}</div>
      )}
      <div className="space-y-1">
        {payload.map((item) => (
          <div
            key={`${item.dataKey}-${item.name}`}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex size-2 rounded-full"
                style={{ background: item.color ?? item.fill }}
              />
              <span className="text-muted-foreground text-xs">
                {item.name ?? item.dataKey}
              </span>
            </div>
            <span className="font-medium tabular-nums">
              {item.value as number}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChartTooltip = RechartsTooltip;

export { ChartContainer, ChartTooltip, ChartTooltipContent };
