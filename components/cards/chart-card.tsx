import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  chart: ReactNode;
  select?: {
    values: string[];
    value: string;
    setValue: (value: string) => void;
  };
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default function ChartCard({
  title,
  chart,
  select,
  className,
  headerClassName,
  contentClassName,
}: ChartCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader
        className={cn(
          select ? "flex flex-row items-center justify-between" : "",
          headerClassName
        )}
      >
        <CardTitle>{title}</CardTitle>
        {select && (
          <Select value={select.value} onValueChange={select.setValue}>
            <SelectTrigger className="w-fit border-none p-0 ">
              <SelectValue>
                {select.value.charAt(0).toUpperCase() + select.value.slice(1)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {select.values.map((value) => (
                <SelectItem key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className={cn("flex-1", contentClassName)}>
        {chart}
      </CardContent>
    </Card>
  );
}
