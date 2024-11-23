/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AreaChart from "../charts/area-chart";
import PieChart from "../charts/pie-chart";
import HorizontalBarChart from "../charts/horizontal-bar-chart";
import ChartCard from "../cards/chart-card";
import {
  ChartItem,
  Order,
  CustomerProfile,
  ProductAffinity,
  AffinityData,
} from "@/types";
import { calculateAgeDistribution } from "@/utils";

export default function CustomersTab() {
  const [loading, setLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [types, setTypes] = useState<ChartItem[]>([]);
  const [genders, setGenders] = useState<ChartItem[]>([]);
  const [ages, setAges] = useState<ChartItem[]>([]);
  const [reviews, setReviews] = useState<ChartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<ChartItem[]>([]);
  const [discounts, setDiscounts] = useState<number[]>([]);
  const [lifetimeValues, setLifetimeValues] = useState<number[]>([]);
  const [churnProbabilities, setChurnProbabilities] = useState<number[]>([]);
  const [productAffinities, setProductAffinities] = useState<Record<string, number[]>>({});
  const [product, setProduct] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Define all fetch operations
        const fetchOperations = {
          customers: supabase
            .from("customers")
            .select("customer_id", { count: "exact" }),
          
          orders: supabase
            .from("orders")
            .select("customer_id, payment_method, discount_amount, final_amount"),
          
          profiles: supabase
            .from("customer_profiles")
            .select("gender, date_of_birth"),
          
          reviews: supabase
            .from("reviews")
            .select("rating"),
          
          predictions: supabase
            .from("customer_predictions")
            .select("label, value"),
          
          affinities: supabase
            .from("product_affinities")
            .select(`
              value,
              products (
                name
              )
            `)
        };

        // Execute all fetch operations in parallel
        const results = await Promise.all(Object.values(fetchOperations));
        const [
          { count: customersCount, error: countError },
          { data: ordersData, error: ordersError },
          { data: profilesData, error: profilesError },
          { data: reviewsData, error: reviewsError },
          { data: predictionsData, error: predictionsError },
          { data: affinitiesData, error: affinitiesError }
        ] = results;

        // Check for errors
        if (countError) throw new Error(countError.message);
        if (ordersError) throw new Error(ordersError.message);
        if (profilesError) throw new Error(profilesError.message);
        if (reviewsError) throw new Error(reviewsError.message);
        if (predictionsError) throw new Error(predictionsError.message);
        if (affinitiesError) throw new Error(affinitiesError.message);

        // Process total customers
        setTotalCustomers(customersCount || 0);

        // Process customer types
        const customerOrders = ordersData as Order[];
        const customerOrderCounts = customerOrders.reduce((acc, order) => {
          acc[order.customer_id] = (acc[order.customer_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const newCustomers = Object.values(customerOrderCounts).filter(
          (count) => count === 1
        ).length;
        const returningCustomers = Object.values(customerOrderCounts).filter(
          (count) => count > 1
        ).length;

        setTypes([
          { label: "New", value: newCustomers },
          { label: "Returning", value: returningCustomers },
        ]);

        // Process genders
        const customerProfiles = profilesData as CustomerProfile[];
        const genderCounts = customerProfiles.reduce((acc, profile) => {
          const genderLabel =
            profile.gender === "M"
              ? "Males"
              : profile.gender === "F"
              ? "Females"
              : "Other";
          acc[genderLabel] = (acc[genderLabel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setGenders(
          Object.entries(genderCounts).map(([gender, count]) => ({
            label: gender,
            value: count,
          }))
        );

        // Process ages
        const ages = customerProfiles.map((c) => {
          const birthDate = new Date(c.date_of_birth);
          const ageDifMs = Date.now() - birthDate.getTime();
          const ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        });
        setAges(calculateAgeDistribution(ages));

        // Process reviews
        const reviews = reviewsData as { rating: number }[];
        const reviewCounts = reviews.reduce((acc, review) => {
          acc[review.rating] = (acc[review.rating] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        setReviews(
          Object.entries(reviewCounts)
            .map(([rating, count]) => ({
              rating: Number(rating),
              label: "★".repeat(Number(rating)),
              value: count,
            }))
            .sort((a, b) => b.rating - a.rating)
        );

        // Process payment methods
        const orders = ordersData as Order[];
        const paymentMethodCounts = orders.reduce((acc, order) => {
          acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        setPaymentMethods(
          Object.entries(paymentMethodCounts).map(([method, count]) => ({
            label: method,
            value: count,
          })).sort((a, b) => b.value - a.value)
        );

        // Process discounts
        setDiscounts(
          orders.map((d) => (d.discount_amount / (d.discount_amount + d.final_amount)) * 100)
        );

        // Process predictions
        const customerPredictions = predictionsData as ChartItem[];
        
        setLifetimeValues(
          customerPredictions
            .filter((p) => p.label === "lifetime value")
            .map((p) => p.value)
        );

        setChurnProbabilities(
          customerPredictions
            .filter((p) => p.label === "churn probability")
            .map((p) => p.value * 100)
        );

        // Process product affinities
        const productAffinitiesData = (affinitiesData as unknown as AffinityData[])
          .map((affinity) => ({
            value: affinity.value,
            name: affinity.products.name,
          })) as ProductAffinity[];

        const affinities: Record<string, number[]> = {};
        for (const affinity of productAffinitiesData) {
          if (!affinities[affinity.name]) {
            affinities[affinity.name] = [];
          }
          affinities[affinity.name].push(affinity.value * 100);
        }
        setProductAffinities(affinities);
        setProduct(Object.keys(affinities)[0] || "");

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    !loading && (
      <>
      <p className="text-muted-foreground text-sm mb-5">Showing information about your customers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Card className="md:col-span-2 xl:col-span-3">
            <CardHeader className="pb-4">
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-medium">
                {totalCustomers.toLocaleString()}{" "}
              </span>
              <span className="text-muted-foreground">Customers</span>
            </CardContent>
          </Card>
          <ChartCard
            title="Type"
            chart={<PieChart data={types} colors={["purple", "green"]}/>}
            headerClassName="pb-0"
            contentClassName="pb-0"
          />
          <ChartCard
            title="Gender"
            chart={<PieChart data={genders} colors={["red", "blue"]}/>}
            headerClassName="pb-0"
            contentClassName="pb-0"
          />
          <ChartCard
            title="Age"
            chart={
              <HorizontalBarChart
                data={ages}
                width={50}
                formatValue={(value) => `${value} customers`}
                color="blue"
              />
            }
          />
          <ChartCard
            title="Review"
            chart={
              <HorizontalBarChart
                data={reviews}
                formatValue={(value) => `${value} reviews`}
                color="red"
              />
            }
          />
          <ChartCard
            title="Payment Method"
            chart={
              <HorizontalBarChart
                data={paymentMethods}
                formatValue={(value) => `${value} payments`}
                color="green"
              />
            }
          />
          <ChartCard
            title="Discount"
            chart={
              <AreaChart
                data={discounts}
                formatValue={(value) => `${value.toFixed(2)}%`}
                color="purple"
              />
            }
          />
          <ChartCard
            title="Lifetime Value"
            chart={
              <AreaChart
                data={lifetimeValues}
                formatValue={(value) => `$${value}`}
                color="blue"
              />
            }
          />
          <ChartCard
            title="Churn Probability"
            chart={
              <AreaChart
                data={churnProbabilities}
                formatValue={(value) =>
                  `${Number.isInteger(value) ? value : value.toFixed(2)}%`
                }
                maxValue={100}
                color="red"
              />
            }
          />
          <ChartCard
            title="Product Affinity"
            chart={
              <AreaChart
                data={productAffinities[product] || []}
                formatValue={(value) =>
                  `${Number.isInteger(value) ? value : value.toFixed(2)}%`
                }
                maxValue={100}
                color="green"
              />
            }
            select={{
              values: Object.keys(productAffinities),
              value: product,
              setValue: setProduct,
            }}
          />
        </div>
      </>
    )
  );
}