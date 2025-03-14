"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackerBoostLogo } from "@/components/backerboost-logo"
import { ArrowRight, Search, Filter } from "lucide-react"

// Mock data for campaigns
const allCampaigns = [
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
  {
    id: "4",
    title: "Community Garden Project",
    description: "Creating a sustainable garden in our neighborhood for fresh produce.",
    category: "Charity",
    targetAmount: 8000,
    currentAmount: 3200,
    deadline: "2025-05-10",
    paymentType: "Both",
  },
  {
    id: "5",
    title: "Independent Film Production",
    description: "Funding my first short film about climate change awareness.",
    category: "Creative",
    targetAmount: 12000,
    currentAmount: 4800,
    deadline: "2025-07-25",
    paymentType: "Both",
  },
  {
    id: "6",
    title: "Emergency Home Repair",
    description: "Need help with urgent repairs after storm damage to my roof.",
    category: "Personal",
    targetAmount: 7500,
    currentAmount: 6000,
    deadline: "2025-03-15",
    paymentType: "Fiat",
  },
]

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")

  // Filter campaigns based on search and filters
  const filteredCampaigns = allCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "" || campaign.category.toLowerCase() === categoryFilter.toLowerCase()

    const matchesPayment =
      paymentFilter === "" ||
      campaign.paymentType.toLowerCase() === paymentFilter.toLowerCase() ||
      (paymentFilter === "both" && campaign.paymentType === "Both")

    return matchesSearch && matchesCategory && matchesPayment
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <BackerBoostLogo className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">Discover Campaigns</h1>
            <p className="text-muted-foreground">Find and support campaigns that matter to you</p>
          </div>
        </div>
        <Link href="/campaigns/create">
          <Button>Start a Campaign</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr] mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setPaymentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="fiat">Fiat</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCampaigns.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
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
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center rounded-full bg-muted p-6 mb-4">
            <Filter className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">No campaigns found</h2>
          <p className="text-muted-foreground mt-2 mb-6">Try adjusting your search or filters</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setCategoryFilter("")
              setPaymentFilter("")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

