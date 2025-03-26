import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BackerBoostLogo } from "@/components/backerboost-logo"
import { ArrowRight, TrendingUp, Heart, Share2 } from "lucide-react"

// Mock data for featured campaigns
const featuredCampaigns = [
  {
    id: "1",
    title: "College Tuition Fund",
    description: "Help me fund my computer science degree at a top university.",
    category: "Education",
    targetAmount: 15000,
    currentAmount: 8750,
    deadline: "2025-06-15",
    paymentType: "Both",
  },
  {
    id: "2",
    title: "Medical Treatment Support",
    description: "Supporting my mother's cancer treatment and recovery process.",
    category: "Medical",
    targetAmount: 25000,
    currentAmount: 18200,
    deadline: "2025-04-30",
    paymentType: "Fiat",
  },
  {
    id: "3",
    title: "Sustainable Fashion Startup",
    description: "Launching an eco-friendly clothing line with recycled materials.",
    category: "Startup",
    targetAmount: 50000,
    currentAmount: 12500,
    deadline: "2025-08-20",
    paymentType: "Crypto",
  },
]



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BackerBoostLogo className="h-10 w-10" />
            <span className="text-xl font-bold">BackerBoost</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/discover" className="text-sm font-medium hover:underline underline-offset-4">
              Discover
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/campaigns/create">
              <Button>Start a Campaign</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Fund Your Dreams with BackerBoost
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Create funding requests for your goals and share them online. No authentication needed for
                  contributors. Funds remain locked until your target date or goal is achieved.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/campaigns/create">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Start a Campaign
                    </Button>
                  </Link>
                  <Link href="/discover">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
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
                      <p className="text-sm text-muted-foreground">Simple, transparent, and secure crowdfunding</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Create a Campaign</h4>
                          <p className="text-sm text-muted-foreground">Set your goal, deadline, and share your story</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Receive Support</h4>
                          <p className="text-sm text-muted-foreground">Contributors can fund without authentication</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Share2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Share & Succeed</h4>
                          <p className="text-sm text-muted-foreground">Funds unlock when your deadline is reached</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Campaigns</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover campaigns that need your support. Every contribution makes a difference.
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
                        {campaign.paymentType === "Both" ? "Crypto & Fiat" : campaign.paymentType}
                      </div>
                    </div>
                    <CardTitle className="mt-4">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">${campaign.currentAmount.toLocaleString()}</span>
                        <span className="text-muted-foreground">of ${campaign.targetAmount.toLocaleString()}</span>
                      </div>
                      <Progress value={(campaign.currentAmount / campaign.targetAmount) * 100} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {Math.round((campaign.currentAmount / campaign.targetAmount) * 100)}% Funded
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to boost your project?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Create your campaign in minutes and start receiving support from contributors around the world.
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
                    <p className="text-sm text-muted-foreground">Contributors can fund without creating an account</p>
                  </div>
                  <div className="bg-background rounded-lg border p-4">
                    <h3 className="text-xl font-bold">Locked Funds</h3>
                    <p className="text-sm text-muted-foreground">Funds remain secure until your target date</p>
                  </div>
                  <div className="bg-background rounded-lg border p-4">
                    <h3 className="text-xl font-bold">Multiple Payments</h3>
                    <p className="text-sm text-muted-foreground">Accept both crypto and traditional payments</p>
                  </div>
                  <div className="bg-background rounded-lg border p-4">
                    <h3 className="text-xl font-bold">Easy Sharing</h3>
                    <p className="text-sm text-muted-foreground">Share your campaign across social platforms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 md:flex-1">
            <Link href="/" className="flex items-center gap-2">
              <BackerBoostLogo className="h-8 w-8" />
              <span className="text-lg font-bold">BackerBoost</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A decentralized crowdfunding platform that enables individuals to create funding requests for specific
              goals.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:flex-1">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/discover" className="text-sm text-muted-foreground hover:underline">
                    Discover
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-sm text-muted-foreground hover:underline">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/campaigns/create" className="text-sm text-muted-foreground hover:underline">
                    Start a Campaign
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:underline">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container flex flex-col gap-4 border-t py-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground md:flex-1">
            © {new Date().getFullYear()} BackerBoost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

