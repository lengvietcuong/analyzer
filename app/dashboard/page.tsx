"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/components/tabs/overview-tab";
import CustomersTab from "@/components/tabs/customers-tab";
import GroupsTab from "@/components/tabs/groups-tab";
import CampaignsTab from "@/components/tabs/campaigns-tab";
import Logo from "@/components/logo";
import { User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background px-4 md:px-12 lg:px-24 h-16 flex justify-between items-center border-b">
        <Logo />
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>
            <User className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
      </header>
      <main className="flex-1 px-4 md:px-12 lg:px-24 py-4 md:py-5 lg:py-6">
        <Tabs defaultValue="overview">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 md:gap-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <TabsList className="w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>
          <TabsContent value="groups">
            <GroupsTab />
          </TabsContent>
          <TabsContent value="campaigns">
            <CampaignsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
