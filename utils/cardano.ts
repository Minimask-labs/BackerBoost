import { Transaction } from '@meshsdk/core';
import type { Campaign, CampaignResponse } from '@/types';

// This should be replaced with your actual validator script address
const scriptAddress =
  'addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8';

export async function createCampaignOnChain(
  campaignResponse: CampaignResponse,
  wallet: any
) {
  try {
    const campaign = campaignResponse.data;

    // Create the campaign parameters
    const campaignData = {
      boss: wallet.address,
      goal: Math.floor(campaign.targetAmount * 1000000).toString(), // Convert to lovelace
      raised: '0',
      alive: true,
      vault: []
    };

    // Create the transaction using raw builder
    const txBuilder = await wallet.getTransactionBuilder();

    // Add output with minimum ADA
    txBuilder.sendLovelace(scriptAddress, '2000000');

    // Add campaign data as datum
    txBuilder.attachDatum(campaignData);

    // Add metadata
    txBuilder.attachMetadata(1, {
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      deadline: campaign.endDate,
      paymentType: campaign.paymentMethod
    });

    // Build the transaction
    const unsignedTx = await txBuilder.build();

    // Return the unsigned transaction
    return {
      unsignedTx,
      datum: campaignData
    };
  } catch (error) {
    console.error('Error creating campaign on chain:', error);
    throw error;
  }
}
