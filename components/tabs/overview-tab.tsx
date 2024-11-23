/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RevenueChart from "@/components/charts/revenue-chart";
import HorizontalBarChart from "@/components/charts/horizontal-bar-chart";
import ChartCard from "../cards/chart-card";
import MetricCard from "../cards/metric-card";
import {
  calculateMetrics,
  calculateGrowthMetrics,
  formatDate,
  getTopItems,
  formatFloat,
} from "@/utils";
import {
  Order,
  OrderItem,
  OrderWithChannel,
  TimePeriod,
  KeyMetrics,
  ChartItem,
} from "@/types";

// Constants
const TODAY = new Date(2024, 9, 23).getTime();
const TIME_PERIODS: Record<TimePeriod, number> = {
  "Last 24 hours": 1,
  "Last 7 days": 7,
  "Last 30 days": 30,
  "Last 90 days": 90,
  "Last 365 days": 365,
};

export default function OverviewTab() {
  const [period, setPeriod] = useState<TimePeriod>("Last 30 days");
  const [topProductsMetric, setTopProductsMetric] = useState<
    "revenue" | "units"
  >("revenue");
  const [topChannelsMetric, setTopChannelsMetric] = useState<
    "revenue" | "orders"
  >("revenue");
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<KeyMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    averageOrderValueGrowth: 0,
  });
  const [topProducts, setTopProducts] = useState<Record<string, ChartItem[]>>({
    revenue: [],
    units: [],
  });
  const [topSalesChannels, setTopSalesChannels] = useState<
    Record<string, ChartItem[]>
  >({
    revenue: [],
    orders: [],
  });

  const fetchOrders = async (
    startDate: string,
    endDate: string
  ): Promise<Order[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("order_id, final_amount, timestamp")
      .gte("timestamp", startDate)
      .lte("timestamp", endDate)
      .order("timestamp", { ascending: true });

    if (error) throw error;
    return data as Order[];
  };

  const fetchTopProducts = async (startDate: string) => {
    const { data, error } = await supabase
      .from("order_items")
      .select(
        `
        quantity,
        products (name, price),
        orders!inner (timestamp, discount_amount, final_amount)
      `
      )
      .gte("orders.timestamp", startDate);

    if (error) throw error;

    const productsByRevenue = getTopItems(
      data as unknown as OrderItem[],
      (item) => item.products.name,
      (item) =>
        item.quantity *
        item.products.price *
        (1 - item.orders.discount_amount / item.orders.final_amount),
      5
    );
    const productsByUnits = getTopItems(
      data as unknown as OrderItem[],
      (item) => item.products.name,
      (item) => item.quantity,
      5
    );

    return { revenue: productsByRevenue, units: productsByUnits };
  };

  const fetchTopChannels = async (startDate: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("final_amount, sales_channels (name)")
      .gte("timestamp", startDate);

    if (error) throw error;

    const channelsByRevenue = getTopItems(
      data as unknown as OrderWithChannel[],
      (item) => item.sales_channels.name,
      (item) => item.final_amount,
      5
    );
    const channelsByOrders = getTopItems(
      data as unknown as OrderWithChannel[],
      (item) => item.sales_channels.name,
      () => 1,
      5
    );

    return { revenue: channelsByRevenue, orders: channelsByOrders };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const days = TIME_PERIODS[period];
        const startDate = formatDate(TODAY - days * 24 * 60 * 60 * 1000);
        const endDate = formatDate(TODAY);
        const previousStartDate = formatDate(
          TODAY - days * 2 * 24 * 60 * 60 * 1000
        );
        const previousEndDate = startDate;

        const [currentOrders, previousOrders] = await Promise.all([
          fetchOrders(startDate, endDate),
          fetchOrders(previousStartDate, previousEndDate),
        ]);

        const processedOrders = currentOrders.map((order) => ({
          ...order,
          timestamp: new Date(order.timestamp),
        }));

        const currentMetrics = calculateMetrics(processedOrders);
        const previousMetrics = calculateMetrics(previousOrders);
        const growthMetrics = calculateGrowthMetrics(
          currentMetrics,
          previousMetrics,
          period
        );

        setOrders(processedOrders);
        setMetrics({ ...currentMetrics, ...growthMetrics });

        const [topProductsData, topChannelsData] = await Promise.all([
          fetchTopProducts(startDate),
          fetchTopChannels(startDate),
        ]);

        setTopProducts(topProductsData);
        setTopSalesChannels(topChannelsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [period]);

  return (
    <>
      <p className="text-muted-foreground text-sm mb-5">Showing your overall sales data</p>
      <Select
        value={period}
        onValueChange={(value: string) => setPeriod(value as TimePeriod)}
      >
        <SelectTrigger className="w-40 mb-3">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(TIME_PERIODS).map((period) => (
            <SelectItem key={period} value={period}>
              {period}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-col md:flex-row gap-4">
        <ChartCard
          title="Revenue Over Time"
          chart={<RevenueChart orders={orders} period={period} color="blue"/>}
          className="flex-[2]"
        />
        <div className="flex-1 space-y-4">
          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            unit="$"
            percentage={metrics.revenueGrowth.toFixed(1)}
            isIncrease={metrics.revenueGrowth >= 0}
          />
          <MetricCard
            title="Total Orders"
            unit=""
            value={metrics.totalOrders}
            percentage={metrics.ordersGrowth.toFixed(1)}
            isIncrease={metrics.ordersGrowth >= 0}
          />
          <MetricCard
            title="Average Order Value"
            value={metrics.averageOrderValue}
            unit="$"
            percentage={metrics.averageOrderValueGrowth.toFixed(1)}
            isIncrease={metrics.averageOrderValueGrowth >= 0}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-4 gap-4">
        <ChartCard
          title="Top Products"
          chart={
            <HorizontalBarChart
              data={topProducts[topProductsMetric]}
              formatValue={
                topProductsMetric === "revenue"
                  ? (value) => `$${formatFloat(value)}`
                  : (value) => `${value} units`
              }
              height={180}
              color="red"
            />
          }
          select={{
            values: ["revenue", "units"],
            value: topProductsMetric,
            setValue: setTopProductsMetric as (value: string) => void,
          }}
          className="flex-1"
          headerClassName="pb-2"
        />
        <ChartCard
          title="Top Sales Channels"
          chart={
            <HorizontalBarChart
              data={topSalesChannels[topChannelsMetric]}
              formatValue={
                topChannelsMetric === "revenue"
                  ? (value) => `$${formatFloat(value)}`
                  : (value) => `${value} orders`
              }
              height={180}
              color="purple"
            />
          }
          select={{
            values: ["revenue", "orders"],
            value: topChannelsMetric,
            setValue: setTopChannelsMetric as (value: string) => void,
          }}
          className="flex-1"
          headerClassName="pb-2"
        />
      </div>
    </>
  );
}
