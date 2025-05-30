import Link from "next/link";
import { Button } from "../ui/button";

const FundCampaign = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to boost your project?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Create your campaign in minutes and start receiving support from
              contributors around the world.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/campaigns/create">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Start a Campaign
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg border p-4">
                <h3 className="text-xl font-bold">No Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Contributors can fund without creating an account
                </p>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <h3 className="text-xl font-bold">Locked Funds</h3>
                <p className="text-sm text-muted-foreground">
                  Funds remain secure until your target date
                </p>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <h3 className="text-xl font-bold">Multiple Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Accept both crypto and traditional payments
                </p>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <h3 className="text-xl font-bold">Easy Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Share your campaign across social platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



export default FundCampaign