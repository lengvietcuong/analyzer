"use client"

import { format, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  DollarSign,
  Users,
  ShoppingBag,
} from "lucide-react";
import { Campaign } from "@/types";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  cardClassName?: string;
  progressClassName?: string;
}

export default function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  cardClassName,
  progressClassName,
}: CampaignCardProps) {
  const startDate = new Date(campaign.start_date);
  const endDate = new Date(campaign.end_date);
  const currentDate = new Date();

  const totalDays = differenceInDays(endDate, startDate);
  const daysPassed = differenceInDays(currentDate, startDate);
  const progress = Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle>{campaign.name}</CardTitle>
        <CardDescription>{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <p className="flex items-center">
            <ShoppingBag className="h-3.5 w-3.5 mr-2" />
            <strong>Sales Channel:</strong>&nbsp;{campaign.sales_channels.name}
          </p>
          <p className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-2" />
            <strong>Customer Group:</strong>&nbsp;{campaign.segments.name}
          </p>
          <p className="flex items-center">
            <DollarSign className="h-3.5 w-3.5 mr-2" />
            <strong>Budget:</strong>&nbsp;${campaign.budget.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span>{format(startDate, "PP")}</span>
            <span>{format(endDate, "PP")}</span>
          </div>
          <Progress value={progress} className={progressClassName} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}