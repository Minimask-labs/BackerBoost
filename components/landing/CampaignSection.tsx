import { featuredCampaigns } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Link, ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

const CampaignSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Featured Campaigns
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover campaigns that need your support. Every contribution
              makes a difference.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          {featuredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                    {campaign.category}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {campaign.paymentType === "Both"
                      ? "Crypto & Fiat"
                      : campaign.paymentType}
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
                      ${campaign.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      of ${campaign.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (campaign.currentAmount / campaign.targetAmount) * 100
                    }
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {Math.round(
                        (campaign.currentAmount / campaign.targetAmount) * 100
                      )}
                      % Funded
                    </span>
                    <span className="text-muted-foreground">
                      Ends {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/campaigns/${campaign.id}`} className="w-full">
                  <Button className="w-full">
                    View Campaign
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/discover">
            <Button variant="outline" size="lg">
              View All Campaigns
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
