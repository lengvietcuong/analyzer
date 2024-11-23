/* eslint-disable */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, CheckIcon, ExternalLinkIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Campaign, Segment, SalesChannel } from "@/types";
import { FaFacebook as FacebookIcon, FaTiktok as TikTokIcon, FaInstagram as InstagramIcon, FaGoogle as GoogleIcon } from "react-icons/fa";

interface CampaignFormProps {
  campaign: Partial<Campaign>;
  onChange: (field: string, value: string) => void;
  segments: Segment[];
  salesChannels: SalesChannel[];
}

export default function CampaignForm({
  campaign,
  onChange,
  segments,
  salesChannels,
}: CampaignFormProps) {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  const togglePlatform = (platform: string) => {
    setConnectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const platformButtons = [
    { name: "Facebook Ads", icon: <FacebookIcon className="h-4 w-4" /> },
    { name: "TikTok Ads", icon: <TikTokIcon className="h-4 w-4" /> },
    { name: "Instagram Ads", icon: <InstagramIcon className="h-4 w-4" /> },
    { name: "Google Ads", icon: <GoogleIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={campaign.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={campaign.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="channel">Sales Channel</Label>
          <Select
            value={campaign.channel_id || ""}
            onValueChange={(value) => onChange("channel_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a channel" />
            </SelectTrigger>
            <SelectContent>
              {salesChannels.map((channel) => (
                <SelectItem key={channel.channel_id} value={channel.channel_id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="segment">Customer Group</Label>
          <Select
            value={campaign.segment_id || ""}
            onValueChange={(value) => onChange("segment_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {segments.map((segment) => (
                <SelectItem key={segment.segment_id} value={segment.segment_id}>
                  {segment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          type="number"
          value={campaign.budget || ""}
          onChange={(e) => onChange("budget", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start_date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {campaign.start_date ? (
                  format(new Date(campaign.start_date), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={
                  campaign.start_date
                    ? new Date(campaign.start_date)
                    : undefined
                }
                onSelect={(date) =>
                  onChange("start_date", date ? date.toISOString() : "")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end_date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end_date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {campaign.end_date ? (
                  format(new Date(campaign.end_date), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={
                  campaign.end_date ? new Date(campaign.end_date) : undefined
                }
                onSelect={(date) =>
                  onChange("end_date", date ? date.toISOString() : "")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Connect</Label>
        <div className="flex flex-wrap gap-2">
          {platformButtons.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => togglePlatform(platform.name)}
            >
              {platform.icon}
              <span>{platform.name}</span>
              {connectedPlatforms.includes(platform.name) ? (
                <CheckIcon className="h-4 w-4 text-primary" />
              ) : (
                <ExternalLinkIcon className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
