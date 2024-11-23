export type Product = {
  name: string;
  price: number;
};

export type SalesChannel = {
  channel_id: string;
  name: string;
  description: string;
};

export type Order = {
  customer_id: string;
  order_id: string;
  discount_amount: number;
  final_amount: number;
  payment_method: string;
  timestamp: Date;
};

export type OrderItem = {
  quantity: number;
  products: Product;
  orders: Order;
};

export type OrderWithChannel = {
  final_amount: number;
  sales_channels: SalesChannel;
};

export type CustomerProfile = {
  gender: string;
  date_of_birth: string;
};

export type ProductAffinity = {
  name: string;
  value: number;
};

export type AffinityData = {
  value: number;
  products: Product;
};

export type KeyMetrics = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  averageOrderValueGrowth: number;
};

export type ChartItem = {
  label: string;
  value: number;
};

export type TimePeriod =
  | "Last 24 hours"
  | "Last 7 days"
  | "Last 30 days"
  | "Last 90 days"
  | "Last 365 days";

export type CustomerGroup = {
  segment_id: string;
  name: string;
  description: string;
  customer_segments: { count: number }[];
};

export type CustomerGroupFormData = {
  name: string;
  description: string;
  type: { new: boolean; returning: boolean };
  ageRanges: { [key: string]: boolean };
  gender: { male: boolean; female: boolean };
};

export type Campaign = {
  campaign_id: string;
  name: string;
  description: string;
  channel_id: string;
  segment_id: string;
  budget: number;
  start_date: string;
  end_date: string;
  sales_channels: { name: string };
  segments: { name: string };
};

export type Segment = {
  segment_id: string;
  name: string;
};
