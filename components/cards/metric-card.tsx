import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFloat } from "@/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  percentage: string;
  isIncrease: boolean;
}

export default function MetricCard({
  title,
  value,
  unit,
  percentage,
  isIncrease,
}: MetricCardProps) {
  const formattedValue =
    Number.isInteger(value)
      ? `${unit}${value.toLocaleString()}`
      : `${unit}${formatFloat(value)}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {percentage && (
          <p className="text-xs text-muted-foreground flex items-center">
            <span
              className={`${
                isIncrease ? "text-primary" : "text-destructive"
              } inline-flex items-center`}
            >
              {isIncrease ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span className="align-middle">{percentage}%</span>
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
