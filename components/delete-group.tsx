/* eslint-disable */
"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { CustomerGroup } from "@/types";

type DeleteGroupProps = {
  group: CustomerGroup;
  onGroupDeleted: () => void;
};

export default function DeleteGroup({
  group,
  onGroupDeleted,
}: DeleteGroupProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    // First check if segment_id exists in the campaigns table
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("campaign_id")
      .eq("segment_id", group.segment_id);
    if (campaigns && campaigns.length >= 1) {
      setIsOpen(false);
      toast({
        variant: "destructive",
        title: "Oops! Delete failed.",
        description:
          "You can't delete this group because it is used in a campaign.",
      });
      return;
    }

    const { error: deleteCustomerSegmentsError } = await supabase
      .from("customer_segments")
      .delete()
      .eq("segment_id", group.segment_id);
    if (deleteCustomerSegmentsError) {
      console.error(
        "Error deleting customer segments:",
        deleteCustomerSegmentsError
      );
      return;
    }

    const { error: deleteSegmentError } = await supabase
      .from("segments")
      .delete()
      .eq("segment_id", group.segment_id);
    if (deleteSegmentError) {
      console.error("Error deleting group:", deleteSegmentError);
      return;
    }

    setIsOpen(false);
    toast({
      title: "Group deleted!",
    });
    onGroupDeleted();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete customer group</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this group?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            customer group "{group.name}" and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
