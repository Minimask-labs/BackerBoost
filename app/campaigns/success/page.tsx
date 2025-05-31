'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { BackerBoostLogo } from '@/components/backerboost-logo';
import { CheckCircle, Share2, ArrowLeft, ExternalLink } from 'lucide-react';

export default function CampaignSuccessPage() {
  const searchParams = useSearchParams();
  const [campaignId, setCampaignId] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    const id = searchParams.get('id');
    const hash = searchParams.get('txHash');
    if (id) setCampaignId(id);
    if (hash) setTxHash(hash);
  }, [searchParams]);

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/campaigns/${campaignId}`;
      await navigator.clipboard.writeText(url);
      alert('Campaign link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="container max-w-md py-20">
      <div className="flex flex-col items-center text-center mb-8">
        <BackerBoostLogo className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold">Campaign Created!</h1>
        <p className="text-muted-foreground mt-2">
          Your campaign has been successfully created and is now live.
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Ready to Share</CardTitle>
          <CardDescription>
            Share your campaign with friends, family, and social networks to
            start receiving contributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-sm font-medium">Your Campaign Link</p>
            <p className="text-xs text-muted-foreground mt-1 break-all">
              {`${window.location.origin}/campaigns/${campaignId}`}
            </p>
          </div>
          {txHash && (
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm font-medium">Blockchain Transaction</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <a
                  href={`https://preview.cardanoscan.io/transaction/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center"
                >
                  View on Explorer
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href={`/campaigns/${campaignId}`}>
              <Button variant="default" className="w-full">
                View Campaign
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-muted-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
