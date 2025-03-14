import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BackerBoostLogo } from "@/components/backerboost-logo"
import { CheckCircle, Share2, ArrowLeft } from "lucide-react"

export default function CampaignSuccessPage() {
  return (
    <div className="container max-w-md py-20">
      <div className="flex flex-col items-center text-center mb-8">
        <BackerBoostLogo className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold">Campaign Created!</h1>
        <p className="text-muted-foreground mt-2">Your campaign has been successfully created and is now live.</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Ready to Share</CardTitle>
          <CardDescription>
            Share your campaign with friends, family, and social networks to start receiving contributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-sm font-medium">Your Campaign Link</p>
            <p className="text-xs text-muted-foreground mt-1 break-all">https://backerboost.com/campaigns/1</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="w-full">
              Copy Link
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/campaigns/1" className="w-full">
            <Button className="w-full">View My Campaign</Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

