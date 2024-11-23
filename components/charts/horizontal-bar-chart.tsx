/* eslint-disable */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface HorizontalBarChartProps {
  data: { label: string; value: number }[];
  formatValue?: (value: any) => string;
  width?: number;
  height?: number;
  barSize?: number;
  color?: string;
}

export default function HorizontalBarChart({
  data,
  formatValue,
  width = 100,
  height = 30 * data.length,
  barSize = 20,
  color = "blue"
}: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart layout="vertical" data={data} barSize={barSize}>
        <XAxis type="number" hide />
        <YAxis
          dataKey="label"
          type="category"
          fontSize={14}
          width={width}
          axisLine={false}
          tickLine={false}
          tickMargin={6}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-2 border rounded-lg">
                  <p className="text-sm">
                    <span className="font-bold">
                      {payload[0].payload.label}:
                    </span>{" "}
                    {formatValue
                      ? formatValue(payload[0].value)
                      : payload[0].value}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="value"
          radius={4}
          fill={`hsl(var(--chart-${color}))`}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
