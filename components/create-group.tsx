/* eslint-disable */
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
interface CustomerType {
  new: boolean;
  returning: boolean;
}

interface AgeRanges {
  "13-17": boolean;
  "18-24": boolean;
  "25-34": boolean;
  "35-44": boolean;
  "45-54": boolean;
  "55-64": boolean;
  "65+": boolean;
}

interface Gender {
  male: boolean;
  female: boolean;
}

interface CustomerGroupFormData {
  name: string;
  description: string;
  type: CustomerType;
  ageRanges: AgeRanges;
  gender: Gender;
}

interface CreateGroupProps {
  onGroupCreated: () => void;
}

const DEFAULT_FORM_DATA: CustomerGroupFormData = {
  name: "",
  description: "",
  type: { new: false, returning: false },
  ageRanges: {
    "13-17": false,
    "18-24": false,
    "25-34": false,
    "35-44": false,
    "45-54": false,
    "55-64": false,
    "65+": false,
  },
  gender: { male: false, female: false },
};

// Helper functions
function getAgeRangeQuery(range: string): { minDate: string; maxDate: string } {
  const today = new Date();
  const [min, max] = range === "65+" ? [65, 100] : range.split("-").map(Number);

  return {
    minDate: new Date(
      today.getFullYear() - max,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0],
    maxDate: new Date(
      today.getFullYear() - min,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0],
  };
}

// Form Component
function CreateGroupForm({ onGroupCreated }: CreateGroupProps) {
  const [formData, setFormData] =
    useState<CustomerGroupFormData>(DEFAULT_FORM_DATA);

  function updateFormField<K extends keyof CustomerGroupFormData>(
    field: K,
    value: CustomerGroupFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchCustomersByAgeRange(range: string) {
    const { minDate, maxDate } = getAgeRangeQuery(range);
    const query = supabase
      .from("customers")
      .select("customer_id, customer_profiles!inner(*)")
      .gte("customer_profiles.date_of_birth", minDate)
      .lt("customer_profiles.date_of_birth", maxDate);

    // Apply gender filter if selected
    if (formData.gender.male && !formData.gender.female) {
      query.eq("customer_profiles.gender", "M");
    } else if (formData.gender.female && !formData.gender.male) {
      query.eq("customer_profiles.gender", "F");
    }

    const { data, error } = await query;
    if (error)
      throw new Error(
        `Error fetching customers for range ${range}: ${error.message}`
      );
    return data || [];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Create segment
      const { data: segmentData, error: segmentError } = await supabase
        .from("segments")
        .insert({ name: formData.name, description: formData.description })
        .select();

      if (segmentError || !segmentData?.[0])
        throw new Error("Failed to create segment");
      const segmentId = segmentData[0].segment_id;

      // Fetch customers based on filters
      let customers: any[] = [];
      const selectedAgeRanges = Object.entries(formData.ageRanges)
        .filter(([_, isSelected]) => isSelected)
        .map(([range]) => range);

      if (selectedAgeRanges.length) {
        const customersByRange = await Promise.all(
          selectedAgeRanges.map(fetchCustomersByAgeRange)
        );
        customers = customersByRange.flat();
      } else {
        // Fetch all customers with gender filter only
        const query = supabase
          .from("customers")
          .select("customer_id, customer_profiles!inner(*)");

        if (formData.gender.male && !formData.gender.female) {
          query.eq("customer_profiles.gender", "M");
        } else if (formData.gender.female && !formData.gender.male) {
          query.eq("customer_profiles.gender", "F");
        }

        const { data, error } = await query;
        if (error) throw new Error("Failed to fetch customers");
        customers = data || [];
      }

      // Remove duplicates
      const uniqueCustomers = Array.from(
        new Set(customers.map((c) => c.customer_id))
      ).map((id) => customers.find((c) => c.customer_id === id));

      // Assign customers to segment
      const { error: assignError } = await supabase
        .from("customer_segments")
        .insert(
          uniqueCustomers.map((customer) => ({
            customer_id: customer.customer_id,
            segment_id: segmentId,
          }))
        );

      if (assignError) throw new Error("Failed to assign customers to segment");
      onGroupCreated();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormField
          label="Name"
          id="name"
          value={formData.name}
          onChange={(e) => updateFormField("name", e.target.value)}
        />

        <FormField
          label="Description"
          id="description"
          value={formData.description}
          onChange={(e) => updateFormField("description", e.target.value)}
        />

        <div className="space-y-2">
          <Label className="font-semibold">Type</Label>
          <div className="flex gap-4">
            <CheckboxField
              id="new"
              label="New"
              checked={formData.type.new}
              onCheckedChange={(checked) =>
                updateFormField("type", {
                  ...formData.type,
                  new: checked as boolean,
                })
              }
            />
            <CheckboxField
              id="returning"
              label="Returning"
              checked={formData.type.returning}
              onCheckedChange={(checked) =>
                updateFormField("type", {
                  ...formData.type,
                  returning: checked as boolean,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Age Range</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.ageRanges).map(([range, checked]) => (
              <CheckboxField
                key={range}
                id={range}
                label={range}
                checked={checked}
                onCheckedChange={(checked) =>
                  updateFormField("ageRanges", {
                    ...formData.ageRanges,
                    [range]: checked as boolean,
                  })
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Gender</Label>
          <div className="flex gap-4">
            <CheckboxField
              id="male"
              label="Male"
              checked={formData.gender.male}
              onCheckedChange={(checked) =>
                updateFormField("gender", {
                  ...formData.gender,
                  male: checked as boolean,
                })
              }
            />
            <CheckboxField
              id="female"
              label="Female"
              checked={formData.gender.female}
              onCheckedChange={(checked) =>
                updateFormField("gender", {
                  ...formData.gender,
                  female: checked as boolean,
                })
              }
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">Create Group</Button>
      </DialogFooter>
    </form>
  );
}

// Reusable form components
interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FormField({ label, id, value, onChange }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-semibold">
        {label}
      </Label>
      <Input id={id} value={value} onChange={onChange} />
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function CheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

// Main component
export default function CreateGroup({ onGroupCreated }: CreateGroupProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  function handleGroupCreated() {
    setOpen(false);
    toast({ title: "Group created!" });
    onGroupCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Customer Group</DialogTitle>
          <DialogDescription>
            Define a new customer segment based on specific criteria.
          </DialogDescription>
        </DialogHeader>
        <CreateGroupForm onGroupCreated={handleGroupCreated} />
      </DialogContent>
    </Dialog>
  );
}
