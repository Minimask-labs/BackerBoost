'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@meshsdk/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BackerBoostLogo } from '@/components/backerboost-logo';
import { ArrowLeft } from 'lucide-react';
import { createCampaign } from '@/service/campaign';
import { createCampaignOnChain } from '@/utils/cardano';
import * as z from 'zod';
import type { Campaign } from '@/types';
import { useCategoryStore } from '@/store/category';

const CampaignSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  targetAmount: z
    .number()
    .min(1, { message: 'Target amount must be a positive number' }),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().min(1, { message: 'End date is required' })
  });

export default function CreateCampaignPage() {
  const router = useRouter();
  const { wallet, connected } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAmount: 0,
     startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
   });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { fetchCategories, categories } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'targetAmount' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    console.log('Form data being validated:', formData);

    // Validate form data
    const result = CampaignSchema.safeParse(formData);
    console.log('Validation result:', result);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      console.log('Validation errors:', fieldErrors);
      setErrors(fieldErrors);
      return;
    }

    // Check if wallet is connected
    if (!connected) {
      console.log('Wallet not connected');
      setErrors({ paymentMethod: 'Please connect your wallet first' });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Attempting to create campaign with data:', formData);

      // Create campaign in backend with adjusted payload
      const response = await createCampaign({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        targetAmount: formData.targetAmount,
        startDate: formData.startDate,
        endDate: formData.endDate
      });

      console.log('Backend response:', response);

      if (response?.success && response.data) {
        // Create campaign on blockchain
        const { unsignedTx } = await createCampaignOnChain(response, wallet);
        console.log('Unsigned transaction created');

        // Sign and submit transaction
        const signedTx = await wallet.signTx(unsignedTx);
        console.log('Transaction signed');
        const txHash = await wallet.submitTx(signedTx);
        console.log('Transaction submitted with hash:', txHash);

        // Navigate to success page with transaction info
        router.push(
          `/campaigns/success?id=${response.data._id}&txHash=${txHash}`
        );
      } else {
        throw new Error('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setErrors({
        submit: 'Failed to create campaign. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <BackerBoostLogo className="h-12 w-12" />
        <div>
          <h1 className="text-3xl font-bold">Create Your Campaign</h1>
          <p className="text-muted-foreground">
            Set up your funding request and share it with the world
          </p>
        </div>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Provide information about your funding request. Be clear and
              specific to attract contributors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a clear, attention-grabbing title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Explain why you need funding and how it will be used"
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleChange}
                required
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Purpose Category</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange('category', value)
                  }
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category: any, index: number) => (
                      <SelectItem key={index} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  min="1"
                  placeholder="Enter amount in USD"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                />
                {errors.targetAmount && (
                  <p className="text-sm text-red-500">{errors.targetAmount}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={minDate}
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={minDate}
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="text-sm text-muted-foreground">
                This campaign will be created on the Cardano blockchain and
                accept crypto payments only.
              </div>
              {/* {errors.paymentMethod && (
                <p className="text-sm text-red-500">{errors.paymentMethod}</p>
              )} */}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
            </Button>
          </CardFooter>
          {errors.submit && (
            <p className="text-sm text-red-500 text-center mt-2">
              {errors.submit}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
