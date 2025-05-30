"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Share2, Clock, Calendar, Target, CreditCard, Bitcoin } from "lucide-react"
import { useCampaignStore } from '@/store/campaign';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
// Mock campaign data - in a real app, this would come from an API

export default function CampaignPage() {
  const [contributionAmount, setContributionAmount] = useState("")
  const [contributorName, setContributorName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const { fetchCampaignsDetails, campaign_details } = useCampaignStore();
    const params = useParams();
  const campaignId = params.id;

  // Calculate days remaining
  const deadline = new Date(campaign_details?.deadline)
  const today = new Date()
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate progress percentage
  const progressPercentage = (campaign_details?.currentAmount / campaign_details?.targetAmount) * 100

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would process the payment
    alert(`Thank you for your contribution of $${contributionAmount}!`)
    setContributionAmount("")
    setContributorName("")
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href)
    alert("Campaign link copied to clipboard!")
  }
      console.log(campaign_details);

useEffect(() => {
  if(campaignId){
    fetchCampaignsDetails({ _id: campaignId as string });
    console.log(campaign_details);
  }
}, []);
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm mb-2">
                    {campaign_details?.category}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">{campaign_details?.title}</CardTitle>
                  <CardDescription>
                    Created by {campaign_details?.creator} on {new Date(campaign_details?.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">${campaign_details?.currentAmount.toLocaleString()}</span>
                    <span className="text-muted-foreground">of ${campaign_details?.targetAmount.toLocaleString()}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{Math.round(progressPercentage)}% Funded</span>
                    <span className="text-muted-foreground">{daysRemaining} days left</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Days Left</p>
                      <p className="text-lg font-bold">{daysRemaining}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-lg font-bold">{new Date(campaign_details?.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Goal</p>
                      <p className="text-lg font-bold">${campaign_details?.targetAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      {campaign_details?.paymentType === "Both" && (
                        <Bitcoin className="h-5 w-5 text-muted-foreground ml-1" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment</p>
                      <p className="text-lg font-bold">
                        {campaign_details?.paymentType === "Both" ? "Crypto & Fiat" : campaign_details?.paymentType}
                      </p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="description">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="contributors">Contributors</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4">
                    <p className="whitespace-pre-line">{campaign_details?.description}</p>
                  </TabsContent>
                  <TabsContent value="updates" className="mt-4">
                    {campaign_details?.updates.length > 0 ? (
                      <div className="space-y-4">
                        {campaign_details?.updates?.map((update: any, index: number) => (
                          <div key={index} className="border-l-2 border-primary pl-4">
                            <p className="text-sm text-muted-foreground">
                              {new Date(update.date).toLocaleDateString()}
                            </p>
                            <p className="mt-1">{update.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No updates yet.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="contributors" className="mt-4">
                    <div className="space-y-4">
                      {campaign_details?.contributors?.map((contributor: any, index: number) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">{contributor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(contributor.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="font-bold">${contributor.amount.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contribute</CardTitle>
              <CardDescription>Support this campaign with a contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContribute} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Contribution Amount ($)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name (Optional)
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name or 'Anonymous'"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={paymentMethod === "card" ? "default" : "outline"}
                      className="flex items-center justify-center gap-2"
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard className="h-4 w-4" />
                      Card
                    </Button>
                    <Button
                      type="button"
                      variant={paymentMethod === "crypto" ? "default" : "outline"}
                      className="flex items-center justify-center gap-2"
                      onClick={() => setPaymentMethod("crypto")}
                    >
                      <Bitcoin className="h-4 w-4" />
                      Crypto
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Contribute Now
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start text-xs text-muted-foreground">
              <p>No account required to contribute.</p>
              <p>Funds will be locked until the campaign deadline.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

