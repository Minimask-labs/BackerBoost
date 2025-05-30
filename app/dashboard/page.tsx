"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/landing/header";
import { useCampaignStore } from "@/store/campaign";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { myCampaigns, userCampaigns } from "@/service/campaign";
import UserInfoCard from "@/components/user-info-card";

// Dynamically import wallet connect to avoid SSR issues
const CardanoWalletConnect = dynamic(
  () => import("@/components/auth/walletAuth/cardano/cardanoWalletConnect"),
  { ssr: false }
);

const DashboardPage = () => {
  //   const { fetchCampaigns, loading, error } = useCampaignStore();
  const [campaigns, setCampaigns] = useState<{ data: any[]; meta?: any }>({
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const campaignData = await userCampaigns();
        setCampaigns(campaignData.data);
        console.log("campaign", campaignData.data);
      } catch (err: any) {
        console.error("Error fetching campaigns:", err);
        setError(err.message || "Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Campaigns Section */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Campaigns</h2>
            <Link href="/campaigns/create">
              <Button size="lg">Create New Campaign</Button>
            </Link>
          </div>
          {loading && (
            <div className="text-center py-12 text-muted-foreground">
              Loading your campaigns...
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-12 text-destructive">
              Error: {error}
            </div>
          )}
          {!loading &&
            !error &&
            (!campaigns || !campaigns.data || campaigns.data.length === 0) && (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                <div className="text-6xl mb-4">📭</div>
                <div className="mb-2 font-semibold text-lg">
                  You haven't created any campaigns yet.
                </div>
                <div className="mb-4">
                  Start your first campaign to raise funds and reach your goals!
                </div>
                <Link href="/campaigns/create">
                  <Button size="lg">Create your first campaign</Button>
                </Link>
              </div>
            )}
          {!loading &&
            !error &&
            campaigns &&
            campaigns.data &&
            campaigns.data.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {campaigns.data.map((campaign: any) => (
                  <Card
                    key={campaign._id || campaign.id}
                    className="overflow-hidden"
                  >
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                          {campaign.category?.name || "General"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.paymentType === "Both"
                            ? "Crypto & Fiat"
                            : campaign.paymentType || "Crypto"}
                        </div>
                      </div>
                      <CardTitle className="mt-4">{campaign.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {campaign.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            ${campaign.currentAmount?.toLocaleString() || 0}
                          </span>
                          <span className="text-muted-foreground">
                            of ${campaign.targetAmount?.toLocaleString() || 0}
                          </span>
                        </div>
                        <Progress
                          value={
                            campaign.targetAmount
                              ? (campaign.currentAmount /
                                  campaign.targetAmount) *
                                100
                              : 0
                          }
                          className="h-2"
                        />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {campaign.targetAmount
                              ? Math.round(
                                  (campaign.currentAmount /
                                    campaign.targetAmount) *
                                    100
                                )
                              : 0}
                            % Funded
                          </span>
                          <span className="text-muted-foreground">
                            Ends{" "}
                            {campaign.deadline
                              ? new Date(campaign.deadline).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Link
                        href={`/campaigns/${campaign._id || campaign.id}`}
                        className="w-full"
                      >
                        <Button className="w-full" variant="outline">
                          View Campaign
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
        </section>
        {/* Wallet/User Info Section */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="sticky top-8">
            {/* <CardanoWalletConnect /> */}
            <UserInfoCard />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default DashboardPage;
