import { TimePeriod } from "@/types";
import { formatFloat } from "@/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface RevenueChartProps {
  orders: { timestamp: Date; final_amount: number }[];
  period: TimePeriod;
  color?: string;
}

function formatDate(date: Date, period: TimePeriod) {
  switch (period) {
    case "Last 24 hours":
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
      });
    case "Last 7 days":
    case "Last 30 days":
    case "Last 90 days":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "Last 365 days":
      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    default:
      return "";
  }
}

function getXAxisInterval(period: TimePeriod) {
  switch (period) {
    case "Last 24 hours":
      return 3;
    case "Last 7 days":
      return 0;
    case "Last 30 days":
      return 5;
    case "Last 90 days":
      return 9;
    case "Last 365 days":
      return 0;
    default:
      return 0;
  }
}

export default function RevenueChart({ orders, period, color = "blue" }: RevenueChartProps) {
  function calculateRevenueData() {
    if (!orders.length) return [];

    const data: { date: Date; revenue: number }[] = [];
    const endDate = orders[orders.length - 1].timestamp;

    let intervalMs: number;
    let periods: number;

    switch (period) {
      case "Last 24 hours":
        intervalMs = 60 * 60 * 1000; // 1 hour
        periods = 24;
        break;
      case "Last 7 days":
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        periods = 7;
        break;
      case "Last 30 days":
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        periods = 30;
        break;
      case "Last 90 days":
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        periods = 90;
        break;
      case "Last 365 days":
        intervalMs = 30 * 24 * 60 * 60 * 1000; // ~1 month
        periods = 12;
        break;
      default:
        return [];
    }

    // Create time periods
    for (let i = 0; i < periods; i++) {
      const periodStart = new Date(endDate.getTime() - (periods - i) * intervalMs);
      const periodEnd = new Date(endDate.getTime() - (periods - i - 1) * intervalMs);
      
      const periodRevenue = orders
        .filter(order => 
          order.timestamp >= periodStart &&
          order.timestamp < periodEnd
        )
        .reduce((sum, order) => sum + order.final_amount, 0);

      data.push({
        date: periodStart,
        revenue: periodRevenue
      });
    }

    return data;
  };

  const revenueData = calculateRevenueData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={revenueData}>
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          height={16}
          tickLine={false}
          axisLine={false}
          interval={getXAxisInterval(period)}
          textAnchor="middle"
          tickFormatter={(date) => formatDate(date, period)}
        />
        <YAxis
          dataKey="revenue"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-2 border rounded-lg">
                  <p className="text-sm">
                    <span className="font-bold">
                      {formatDate(payload[0].payload.date, period)}:
                    </span>{" "}
                    {`$${formatFloat(payload[0].payload.revenue)}`}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="revenue"
          radius={4}
          fill={`hsl(var(--chart-${color}))`}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
