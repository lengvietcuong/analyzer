/* eslint-disable */
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CustomerGroup } from "@/types";

interface DownloadGroupProps {
  group: CustomerGroup;
}

export default function DownloadGroup({ group }: DownloadGroupProps) {
  async function downloadCsv() {
    const { data, error } = await supabase
      .from("customer_segments")
      .select(
        `
        customer_id,
        customers!inner(
          customer_profiles!inner(name, phone, email, gender, date_of_birth)
        )
      `
      )
      .eq("segment_id", group.segment_id);

    if (error) {
      console.error("Error fetching customer data:", error);
      return;
    }

    const csvContent = [
      ["Customer ID", "Name", "Phone", "Email", "Gender", "Date of Birth"].join(
        ","
      ),
      ...data.map((row: any) =>
        [
          row.customer_id,
          row.customers.customer_profiles.name,
          row.customers.customer_profiles.phone,
          row.customers.customer_profiles.email,
          row.customers.customer_profiles.gender,
          row.customers.customer_profiles.date_of_birth,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${group.name}_customers.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={downloadCsv}>
      <Download className="h-4 w-4" />
      <span className="sr-only">Download customer list</span>
    </Button>
  );
}
