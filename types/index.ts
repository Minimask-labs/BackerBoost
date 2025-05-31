import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}




export interface Campaign {
  _id?: string;
  category: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  walletAddress?: string;
  paymentMethod: 'crypto' | 'fiat' | 'both';
  updates: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CampaignResponse {
  success: boolean;
  data: Campaign;
  message: string;
}

export interface CampaignParams {
  boss: string;
  goal: number;
  raised: number;
  alive: boolean;
  vault: Array<[string, number]>;
}
