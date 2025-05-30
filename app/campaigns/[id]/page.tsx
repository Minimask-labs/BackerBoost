"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Target,
  CreditCard,
  Bitcoin,
  Share2,
  Icon,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaignStore } from "@/store/campaign";
import CampaignContribution from "@/components/campaign/campaign-contribution";
import NotFound from "@/components/campaign/not-found";

export default function CampaignPage() {
  const { id } = useParams();
  const {
    fetchCampaignsDetails,
    campaign_details: campaign,
    loading,
  } = useCampaignStore();

  useEffect(() => {
    if (id) fetchCampaignsDetails({ _id: id as string });
  }, [id, fetchCampaignsDetails]);


  // BASICALLY A LOADING STATE...
  if (loading)
    return (
      <div className="container max-w-full py-10 text-center h-full">
        <Card key={`${campaign}`} className="overflow-hidden">
          <CardHeader className="p-6">
            <div className="h-6 bg-muted rounded animate-pulse mb-4"></div>
            <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-12 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-2 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
          </CardFooter>
        </Card>
      </div>
    );

  // if (!campaign)
  //   return (
  //     <NotFound />
  //   );

  // Calculate remaining time
const deadline = new Date(campaign.deadline || Date.now());
const currentDate = new Date();
const timeDifference = deadline.getTime() - currentDate.getTime();
const daysRemaining = Math.max(
  0,
  Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
);

  return (
    <div className="container max-w-full py-10">
      <Link href="/discover" className="inline-flex items-center text-sm mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Campaigns
      </Link>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Campaign Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <span className="inline-flex rounded-lg bg-muted px-3 py-1 text-sm mb-2">
                    {campaign.category || "General"}
                  </span>
                  <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                  <CardDescription>
                    Created on{" "}
                    {new Date(campaign.createdAt).toUTCString().split(" ").slice(0, 4).join(" ")}
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Campaign Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Stat
                  Icon={<Clock />}
                  label="Days Left"
                  value={daysRemaining}
                />
                <Stat
                  Icon={<Calendar />}
                  label="End Date"
                  value={`${deadline.toUTCString().split(" ").slice(0, 4).join(" ")}`}
                />
                <Stat
                  Icon={<Target />}
                  label="Goal"
                  value={`$${campaign.targetAmount.toLocaleString()}`}
                />
                <Stat
                  Icon={
                    <div className="flex">
                        <Bitcoin className="h-5 w-5 ml-1" />
                    </div>
                  }
                  label="Payment"
                  value="Crypto"
                />
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <p className="whitespace-pre-line">{campaign.description}</p>
                </TabsContent>

                <TabsContent value="updates" className="mt-4">
                  {campaign.updates?.length > 0 ? (
                    <div className="space-y-3">
                      {campaign.updates.map((update, i) => (
                        <div key={i} className="border-l-2 border-primary pl-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(update.date).toLocaleDateString()}
                          </p>
                          <p>{update.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No updates yet</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Contribution Form */}
        <div>
          <CampaignContribution campaign={campaign} />
        </div>
      </div>
    </div>
  );
}

// Reusable stat component
function Stat({ Icon, label, value }: {label: string ; value?: string | any; Icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg">
      {Icon}
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
