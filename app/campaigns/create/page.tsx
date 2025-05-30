"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BackerBoostLogo } from "@/components/backerboost-logo";
import { ArrowLeft } from "lucide-react";
import { createCampaign } from "@/service/campaign";
import * as z from "zod";

const CampaignSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  targetAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Target amount must be a positive number",
    }),
  deadline: z.string().min(1, { message: "Deadline is required" }),
  paymentType: z.enum(["crypto", "fiat", "both"]),
});

export default function CreateCampaignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetAmount: "",
    deadline: "",
    paymentType: "both",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = CampaignSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      console.log("Campaign data:", formData);
      const campaign = await createCampaign(formData);
      if (campaign) {
        router.push("/campaigns/success");
      }
    } catch (error) {
      console.log("Error creating campaign");
    }
  };

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

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
                    handleSelectChange("category", value)
                  }
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="charity">Charity</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={minDate}
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
                {errors.deadline && (
                  <p className="text-sm text-red-500">{errors.deadline}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <RadioGroup
                  defaultValue="both"
                  className="flex gap-4"
                  onValueChange={(value) =>
                    handleSelectChange("paymentType", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="crypto" id="crypto" />
                    <Label htmlFor="crypto" className="cursor-pointer">
                      Crypto
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fiat" id="fiat" />
                    <Label htmlFor="fiat" className="cursor-pointer">
                      Fiat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="cursor-pointer">
                      Both
                    </Label>
                  </div>
                </RadioGroup>
                {errors.paymentType && (
                  <p className="text-sm text-red-500">{errors.paymentType}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Campaign</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
