"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart as BaseAreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface AreaChartProps {
  data: number[];
  maxValue?: number;
  formatValue?: (value: number) => string;
  color?: string;
}

export default function AreaChart({
  data = [],
  maxValue = Math.max(...data),
  formatValue = (value) => value.toString(),
  color = "blue"
}: AreaChartProps) {
  const chartData = useMemo(() => {
    const bucketSize = maxValue / 20;
    const buckets = new Array(20).fill(0);

    data.forEach((value) => {
      const bucketIndex = Math.min(Math.floor(value / bucketSize), 19);
      buckets[bucketIndex]++;
    });

    const totalCustomers = data.length;

    return buckets.map((count, index) => ({
      bucketStart: index * bucketSize,
      bucketEnd: (index + 1) * bucketSize,
      percentage: (count / totalCustomers) * 100,
    }));
  }, [data, maxValue]);

  const xAxisTicks = useMemo(() => {
    return [0, 0.25, 0.5, 0.75, 1].map((fraction) => fraction * maxValue);
  }, [maxValue]);

  return (
    <ChartContainer config={{}}>
      <BaseAreaChart
        data={chartData}
        margin={{ bottom: 10 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="bucketEnd"
          tickFormatter={formatValue}
          ticks={xAxisTicks}
          axisLine={false}
          tickLine={false}
        >
          <Label
            value="Value"
            offset={-10}
            position="insideBottom"
            className="fill-foreground text-xs text-muted-foreground"
          />
        </XAxis>
        <YAxis
          tickFormatter={(value) => `${value}%`}
          axisLine={false}
          tickLine={false}
        >
          <Label
            value="% of Customers"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: 'middle' }}
            className="fill-foreground text-xs text-muted-foreground"
          />
        </YAxis>
        <Area
          type="monotone"
          dataKey="percentage"
          stroke={color}
          fill={`hsl(var(--chart-${color}))`}
          fillOpacity={0.4}
          animationDuration={1000}
        />
      </BaseAreaChart>
    </ChartContainer>
  );
}