/* eslint-disable */
"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CampaignCard from "../cards/campaign-card";
import CampaignForm from "../campaign-form";
import { Campaign, Segment, SalesChannel } from "@/types";

const cardColors = [
  "bg-chart-blue/[7.5%] border-chart-blue/5",
  "bg-chart-red/[7.5%] border-chart-red/5",
  "bg-chart-green/[7.5%] border-chart-green/5",
  "bg-chart-orange/[7.5%] border-chart-orange/5",
  "bg-chart-purple/[7.5%] border-chart-purple/5",
];
const progressColors = [
  "bg-chart-blue/25",
  "bg-chart-red/25",
  "bg-chart-green/25",
  "bg-chart-orange/25",
  "bg-chart-purple/25",
];

export default function CampaignsTab() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: "",
    description: "",
    channel_id: "",
    segment_id: "",
    budget: 0,
    start_date: "",
    end_date: "",
  });

  async function fetchCampaigns() {
    const { data, error } = await supabase.from("campaigns").select(`
      *,
      sales_channels (name),
      segments (name)
    `);
    if (error) console.error("Error fetching campaigns:", error);
    return data || [];
  }

  async function fetchSegments() {
    const { data, error } = await supabase.from("segments").select("*");
    if (error) console.error("Error fetching segments:", error);
    return data || [];
  }

  async function fetchSalesChannels() {
    const { data, error } = await supabase.from("sales_channels").select("*");
    if (error) console.error("Error fetching sales channels:", error);
    return data || [];
  }

  async function createCampaign(campaign: Partial<Campaign>) {
    const { data, error } = await supabase.from("campaigns").insert([campaign]);
    if (error) console.error("Error creating campaign:", error);
    return data;
  }

  async function updateCampaign(campaign: Campaign) {
    const { sales_channels, segments, ...updatedCampaign } = campaign;
    const { error } = await supabase
      .from("campaigns")
      .update(updatedCampaign)
      .eq("campaign_id", campaign.campaign_id);
    if (error) console.error("Error updating campaign:", error);
  }

  async function deleteCampaign(campaignId: string) {
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("campaign_id", campaignId);
    if (error) console.error("Error deleting campaign:", error);
  }

  useEffect(() => {
    fetchCampaigns().then(setCampaigns);
    fetchSegments().then(setSegments);
    fetchSalesChannels().then(setSalesChannels);
  }, []);

  async function handleCreateCampaign() {
    await createCampaign(newCampaign);
    fetchCampaigns().then(setCampaigns);
    setNewCampaign({
      name: "",
      description: "",
      channel_id: "",
      segment_id: "",
      budget: 0,
      start_date: "",
      end_date: "",
    });
    toast({
      title: "Campaign created!",
    });
    setIsCreateDialogOpen(false);
  }

  function handleUpdateCampaign() {
    if (!currentCampaign) return;
    updateCampaign(currentCampaign).then(() => {
      fetchCampaigns().then(setCampaigns);
      toast({
        title: "Campaign updated!",
      });
      setIsEditDialogOpen(false);
    });
  }

  function handleDeleteCampaign() {
    if (!currentCampaign) return;
    deleteCampaign(currentCampaign.campaign_id).then(() => {
      fetchCampaigns().then(setCampaigns);
      toast({
        title: "Campaign deleted!",
      });
      setIsDeleteDialogOpen(false);
    });
  }

  function handleEditCampaign(campaign: Campaign) {
    setCurrentCampaign(campaign);
    setIsEditDialogOpen(true);
  }

  function handleDeleteCampaignPrompt(campaign: Campaign) {
    setCurrentCampaign(campaign);
    setIsDeleteDialogOpen(true);
  }

  function handleCampaignChange(field: string, value: string) {
    setNewCampaign((prev) => ({ ...prev, [field]: value }));
  }

  function handleEditCampaignChange(field: string, value: string) {
    setCurrentCampaign((prev) => (prev ? { ...prev, [field]: value } : null));
  }

  return (
    <>
      <p className="text-muted-foreground text-sm mb-5">Showing information about your campaigns</p>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <CampaignForm
            campaign={newCampaign}
            onChange={handleCampaignChange}
            segments={segments}
            salesChannels={salesChannels}
          />
          <DialogFooter>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign, index) => (
          <CampaignCard
            key={campaign.campaign_id}
            campaign={campaign}
            onEdit={() => handleEditCampaign(campaign)}
            onDelete={() => handleDeleteCampaignPrompt(campaign)}
            cardClassName={cardColors[index % cardColors.length]}
            progressClassName={progressColors[index % progressColors.length]}
          />
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {currentCampaign && (
            <CampaignForm
              campaign={currentCampaign}
              onChange={handleEditCampaignChange}
              segments={segments}
              salesChannels={salesChannels}
            />
          )}
          <DialogFooter>
            <Button onClick={handleUpdateCampaign}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCampaign}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
