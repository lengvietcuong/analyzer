"use client";

import { LabelList, Pie, PieChart as BasePieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PieChartProps {
  data: {
    label: string;
    value: number;
  }[];
  colors?: string[];
}

function formatLabel(label: string) {
  return label.replace(" ", "").toLowerCase();
}

export default function PieChart({
  data,
  colors = ["blue", "red", "orange", "purple", "green"],
}: PieChartProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item) => ({
    label: formatLabel(item.label),
    value: item.value,
    percentage: ((item.value / totalValue) * 100).toFixed(1),
    fill: `var(--color-${formatLabel(item.label)})`,
  }));

  const chartConfig: ChartConfig = {
    ...data.reduce(
      (config, item, index) => ({
        ...config,
        [formatLabel(item.label)]: {
          label: item.label,
          color: `hsl(var(--chart-${colors[index]}))`,
        },
      }),
      {}
    ),
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-64 [&_.recharts-text]:fill-background"
    >
      <BasePieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          animationBegin={0}
          animationDuration={1_000}
        >
          <LabelList
            dataKey="percentage"
            position="inside"
            className="fill-background font-medium"
            stroke="none"
            formatter={(value: string) => `${value}%`}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="label" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-sm"
        />
      </BasePieChart>
    </ChartContainer>
  );
}
