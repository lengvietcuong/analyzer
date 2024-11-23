import { Order, TimePeriod, ChartItem } from "./types";

export function calculateGrowth(current: number, previous: number): number {
  return previous > 0 ? ((current - previous) / previous) * 100 : 0;
}

export function formatDate(date: number): string {
  return new Date(date).toISOString();
}

export function getTopItems<T>(
  data: T[],
  getName: (item: T) => string,
  getMetric: (item: T) => number,
  count: number
) {
  const topItems = Object.values(
    data.reduce(function (
      acc: Record<string, ChartItem>,
      item
    ) {
      const name = getName(item);
      const metric = getMetric(item);

      if (!acc[name]) {
        acc[name] = { label: name, value: 0 };
      }

      acc[name].value += metric;
      return acc;
    },
    {})
  );

  return topItems.sort((a, b) => b.value - a.value).slice(0, count);
}

export function calculateMetrics(orders: Order[]) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.final_amount,
    0
  );
  const totalOrders = orders.length;
  return {
    totalRevenue,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
}

export function calculateGrowthMetrics(
  current: ReturnType<typeof calculateMetrics>,
  previous: ReturnType<typeof calculateMetrics>,
  period: TimePeriod
) {
  if (period === "Last 365 days") {
    return {
      revenueGrowth: 0,
      ordersGrowth: 0,
      averageOrderValueGrowth: 0,
    };
  }

  return {
    revenueGrowth: calculateGrowth(current.totalRevenue, previous.totalRevenue),
    ordersGrowth: calculateGrowth(current.totalOrders, previous.totalOrders),
    averageOrderValueGrowth: calculateGrowth(
      current.averageOrderValue,
      previous.averageOrderValue
    ),
  };
}

export function calculateAgeDistribution(ages: number[]) {
  const ageGroups = [
    { label: "0-17", min: 0, max: 17 },
    { label: "18-24", min: 18, max: 24 },
    { label: "25-34", min: 25, max: 34 },
    { label: "35-44", min: 35, max: 44 },
    { label: "45-54", min: 45, max: 54 },
    { label: "55-64", min: 55, max: 64 },
    { label: "65+", min: 65, max: Infinity },
  ];

  const distribution = ageGroups.map((group) => ({
    label: group.label,
    value: ages.filter((age) => age >= group.min && age <= group.max).length,
  }));

  return distribution;
}

export function formatFloat(number: number): string {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}