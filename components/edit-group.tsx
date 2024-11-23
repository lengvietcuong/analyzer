import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { CustomerGroup } from "@/types";

interface EditGroupProps {
  group: CustomerGroup | null;
  onGroupUpdated: () => void;
}

export default function EditGroup({ group, onGroupUpdated }: EditGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });

  useEffect(() => {
    if (group) {
      setFormData({ name: group.name, description: group.description });
    }
  }, [group]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!group) return;

    supabase
      .from("segments")
      .update({ name: formData.name, description: formData.description })
      .eq("segment_id", group.segment_id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating group:", error);
        } else {
          setIsOpen(false);
          toast({
            title: "Group updated!",
          });
          onGroupUpdated();
        }
      });
  }

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit customer group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Customer Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="font-semibold">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="font-semibold">
                Description
              </Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
