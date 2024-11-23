/* eslint-disable */
"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { CustomerGroup } from "@/types";
import CreateGroup from "../create-group";
import GroupCard from "../cards/group-card";

const cardColors = [
  "bg-chart-blue/[7.5%] border-chart-blue/5",
  "bg-chart-red/[7.5%] border-chart-red/5",
  "bg-chart-green/[7.5%] border-chart-green/5",
  "bg-chart-orange/[7.5%] border-chart-orange/5",
  "bg-chart-purple/[7.5%] border-chart-purple/5",
];

export default function GroupsTab() {
  const [groups, setGroups] = useState<CustomerGroup[]>([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    const { data, error } = await supabase
      .from("segments")
      .select("*, customer_segments(count)");

    if (error) {
      console.error("Error fetching groups:", error);
    } else {
      setGroups(data as CustomerGroup[]);
    }
  }

  return (
    <>
      <p className="text-muted-foreground text-sm mb-5">Showing information about different customer groups</p>
      <CreateGroup onGroupCreated={fetchGroups}/>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, index) => (
          <GroupCard
            key={group.segment_id}
            group={group}
            onGroupsChanged={fetchGroups}
            className={cardColors[index % cardColors.length]}
          />
        ))}
      </div>
    </>
  );
}