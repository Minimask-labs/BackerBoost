"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackerBoostLogo } from "@/components/backerboost-logo"
import { ArrowRight, Search, Filter } from "lucide-react"
import {useCampaignStore} from "@/store/campaign"
import {useCategoryStore} from "@/store/category"
export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const { fetchCampaigns, campaigns } = useCampaignStore();
  const { fetchCategories, categories } = useCategoryStore();
useEffect(() => {
  fetchCampaigns();
}, []);
useEffect(() => {
  fetchCategories();
 }, []);
  console.log(categories);

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <BackerBoostLogo className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">Discover Campaigns</h1>
            <p className="text-muted-foreground">
              Find and support campaigns that matter to you
            </p>
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
               {categories?.map((category: any, index: number) => (
                <SelectItem key={index} value={category?._id}>{category?.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setPaymentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="fiat">Fiat</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {campaigns?.data?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns?.data?.map((campaign: any, index: number) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                    {campaign?.category}
                  </div>
                  <div className="text-sm capitalize text-muted-foreground">
                    {campaign?.paymentMethod}
                  </div>
                </div>
                <CardTitle className="mt-4">{campaign?.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {campaign?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      ${campaign?.currentAmount?.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      of ${campaign?.targetAmount?.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (campaign?.currentAmount / campaign?.targetAmount) * 100
                    }
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {Math.round(
                        (campaign?.currentAmount / campaign?.targetAmount) * 100
                      )}
                      % Funded
                    </span>
                    <span className="text-muted-foreground">
                      Ends {new Date(campaign?.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/campaigns/${campaign?._id}`} className="w-full">
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
          <p className="text-muted-foreground mt-2 mb-6">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setPaymentFilter('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

