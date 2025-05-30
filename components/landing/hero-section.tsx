import Link from "next/link";
import { Button } from "../ui/button";
import { Heart, Share2, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Fund Your Dreams with BackerBoost
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Create funding requests for your goals and share them online. No
              authentication needed for contributors. Funds remain locked until
              your target date or goal is achieved.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/campaigns/create">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Start a Campaign
                </Button>
              </Link>
              <Link href="/discover">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-[400px]:w-auto"
                >
                  Discover Campaigns
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -left-4 -top-4 h-72 w-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -right-4 -bottom-4 h-72 w-72 bg-secondary/20 rounded-full blur-3xl" />
              <div className="relative bg-background rounded-xl border shadow-lg p-6">
                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-bold">How It Works</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple, transparent, and secure crowdfunding
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Create a Campaign</h4>
                      <p className="text-sm text-muted-foreground">
                        Set your goal, deadline, and share your story
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Receive Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Contributors can fund without authentication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Share2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Share & Succeed</h4>
                      <p className="text-sm text-muted-foreground">
                        Funds unlock when your deadline is reached
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
