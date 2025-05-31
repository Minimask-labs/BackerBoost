"use client";

import {
  Lucid,
  Koios,
  SpendingValidator,
  Data,
  UTxO,
  TxHash,
  Address,
  LucidEvolution,
  validatorToAddress,
  getAddressDetails,
} from "@lucid-evolution/lucid";
import { IWallet } from "@meshsdk/core";
import CrowdfundingScript from "@/public/validators/plutus.json";

// Define schemas with proper Data types
const CampaignSchema = Data.Object({
  boss: Data.Bytes(),
  goal: Data.Integer(),
  raised: Data.Integer(),
  alive: Data.Boolean(),
  vault: Data.Array(Data.Tuple([Data.Bytes(), Data.Integer()])),
});

const ActionSchema = Data.Enum([
  Data.Object({ Start: Data.Object({ 0: Data.Integer() }) }),
  Data.Object({ Fund: Data.Object({ 0: Data.Integer(), 1: Data.Bytes() }) }),
  Data.Object({ Claim: Data.Object({ 0: Data.Integer() }) }),
  Data.Object({
    Refund: Data.Object({
      0: Data.Integer(),
      1: Data.Bytes(),
      2: Data.Integer(),
    }),
  }),
  Data.Object({ Kill: Data.Object({ 0: Data.Integer() }) }),
]);

const RedeemerSchema = Data.Object({
  action: ActionSchema,
});

type Campaign = Data.Static<typeof CampaignSchema>;
type Action = Data.Static<typeof ActionSchema>;
type Redeemer = Data.Static<typeof RedeemerSchema>;

const validator: SpendingValidator = {
  type: "PlutusV3",
  script: CrowdfundingScript.validators[0].compiledCode,
};

class Crowdfund {
  private lucid: LucidEvolution;
  private validatorAddress: Address;

  constructor(lucid: LucidEvolution) {
    this.lucid = lucid;
    this.validatorAddress = validatorToAddress("Preprod", validator);
  }

  // Initialize Lucid with MeshJS wallet
  static async initialize(meshWallet: IWallet): Promise<Crowdfund> {
    const lucid = await Lucid(
      new Koios("https://preprod.koios.rest/api/v1"),
      "Preprod"
    );

    // Create a proper wallet adapter for Lucid Evolution
    const walletAdapter = {
      getNetworkId: async () => await meshWallet.getNetworkId(),
      getUtxos: async () => {
        const utxos = await meshWallet.getUtxos();
        return utxos.map(utxo => utxo.input.txHash);
      },
      getCollateral: async () => {
        const collateral = await meshWallet.getCollateral?.() || [];
        return collateral.map(utxo => utxo.input.txHash + "#" + utxo.input.outputIndex.toString());
      },
      getBalance: async () => {
        const balance = await meshWallet.getBalance();
        return balance[0]?.quantity || "0";
      },
      getUsedAddresses: async () => await meshWallet.getUsedAddresses(),
      getUnusedAddresses: async () => await meshWallet.getUnusedAddresses(),
      getChangeAddress: async () => await meshWallet.getChangeAddress(),
      getRewardAddresses: async () => await meshWallet.getRewardAddresses(),
      signTx: async (tx: string) => await meshWallet.signTx(tx, true),
      signData: async (addr: string, payload: string) => await meshWallet.signData(addr, payload),
      submitTx: async (tx: string) => await meshWallet.submitTx(tx),
      experimental: {
        getCollateral: async () => [],
        on: () => {},
        off: () => {},
      },
    };
    
    lucid.selectWallet.fromAPI(walletAdapter);

    return new Crowdfund(lucid);
  }

  // Start a new campaign
  async startCampaign(goal: bigint, campaignId: bigint): Promise<TxHash> {
    const bossKeyHash = getAddressDetails(await this.lucid.wallet().address())
      .paymentCredential?.hash;

    if (!bossKeyHash) throw new Error("Could not get boss key hash");

    const campaignDatum = {
      boss: bossKeyHash,
      goal: goal,
      raised: BigInt(0),
      alive: true,
      vault: [],
    };

    const tx = await this.lucid
      .newTx()
      .pay.ToAddressWithData(
        this.validatorAddress,
        {
          kind: "inline",
          value: Data.to(campaignDatum as any, CampaignSchema),
        },
        { lovelace: BigInt(2_000_000) }
      )
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return await signedTx.submit();
  }

  // Fund a campaign
  async fundCampaign(
    campaignUtxo: UTxO,
    fundAmount: bigint,
    campaignId: bigint
  ): Promise<TxHash> {
    const currentDatum = Data.from(campaignUtxo.datum!, CampaignSchema);
    const funderKeyHash = getAddressDetails(await this.lucid.wallet().address())
      .paymentCredential?.hash;

    if (!funderKeyHash) throw new Error("Could not get funder key hash");

    const updatedDatum = {
      boss: currentDatum.boss,
      goal: currentDatum.goal,
      alive: currentDatum.alive,
      raised: currentDatum.raised + fundAmount,
      vault: [...currentDatum.vault, [funderKeyHash, fundAmount]],
    };

    const redeemer = {
      action: { Fund: { 0: campaignId, 1: funderKeyHash } },
    };

    const tx = await this.lucid
      .newTx()
      .collectFrom([campaignUtxo], Data.to(redeemer as any, RedeemerSchema))
      .pay.ToAddressWithData(
        this.validatorAddress,
        {
          kind: "inline",
          value: Data.to(updatedDatum as any, CampaignSchema),
        },
        { lovelace: campaignUtxo.assets.lovelace + fundAmount }
      )
      .attach.SpendingValidator(validator)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return await signedTx.submit();
  }

  // Claim funds (for campaign boss when goal is reached)
  async claimFunds(campaignUtxo: UTxO, campaignId: bigint): Promise<TxHash> {
    const currentDatum = Data.from(campaignUtxo.datum!, CampaignSchema);

    const callerKeyHash = getAddressDetails(await this.lucid.wallet().address())
      .paymentCredential?.hash;

    if (callerKeyHash !== currentDatum.boss) {
      throw new Error("Only campaign boss can claim funds");
    }

    if (currentDatum.raised < currentDatum.goal) {
      throw new Error("Campaign goal not reached");
    }

    const redeemer = {
      action: { Claim: { 0: campaignId } },
    };

    const tx = await this.lucid
      .newTx()
      .collectFrom([campaignUtxo], Data.to(redeemer as any, RedeemerSchema))
      .pay.ToAddress(await this.lucid.wallet().address(), {
        lovelace: campaignUtxo.assets.lovelace,
      })
      .attach.SpendingValidator(validator)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return await signedTx.submit();
  }

  // Refund contribution
  async refundContribution(
    campaignUtxo: UTxO,
    campaignId: bigint,
    refundAmount: bigint
  ): Promise<TxHash> {
    const currentDatum = Data.from(campaignUtxo.datum!, CampaignSchema);
    const refunderKeyHash = getAddressDetails(await this.lucid.wallet().address())
      .paymentCredential?.hash;

    if (!refunderKeyHash) throw new Error("Could not get refunder key hash");

    const updatedVault = currentDatum.vault.filter(
      ([contributor, amount]: [string, bigint]) =>
        !(contributor === refunderKeyHash && amount === refundAmount)
    );

    const updatedDatum = {
      boss: currentDatum.boss,
      goal: currentDatum.goal,
      alive: currentDatum.alive,
      raised: currentDatum.raised - refundAmount,
      vault: updatedVault,
    };

    const redeemer = {
      action: {
        Refund: { 0: campaignId, 1: refunderKeyHash, 2: refundAmount },
      },
    };

    const tx = await this.lucid
      .newTx()
      .collectFrom([campaignUtxo], Data.to(redeemer as any, RedeemerSchema))
      .pay.ToAddressWithData(
        this.validatorAddress,
        {
          kind: "inline",
          value: Data.to(updatedDatum as any, CampaignSchema),
        },
        { lovelace: campaignUtxo.assets.lovelace - refundAmount }
      )
      .pay.ToAddress(await this.lucid.wallet().address(), {
        lovelace: refundAmount,
      })
      .attach.SpendingValidator(validator)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return await signedTx.submit();
  }

  // Kill campaign (for boss)
  async killCampaign(campaignUtxo: UTxO, campaignId: bigint): Promise<TxHash> {
    const currentDatum = Data.from(campaignUtxo.datum!, CampaignSchema);

    const callerKeyHash = getAddressDetails(await this.lucid.wallet().address())
      .paymentCredential?.hash;

    if (callerKeyHash !== currentDatum.boss) {
      throw new Error("Only campaign boss can kill campaign");
    }

    const redeemer = {
      action: { Kill: { 0: campaignId } },
    };

    const tx = await this.lucid
      .newTx()
      .collectFrom([campaignUtxo], Data.to(redeemer as any, RedeemerSchema))
      .pay.ToAddress(await this.lucid.wallet().address(), {
        lovelace: campaignUtxo.assets.lovelace,
      })
      .attach.SpendingValidator(validator)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    return await signedTx.submit();
  }

  // Get all campaign UTxOs
  async getAllCampaigns(): Promise<UTxO[]> {
    return await this.lucid.utxosAt(this.validatorAddress);
  }

  // Get specific campaign by checking datum
  async getCampaignById(campaignId: bigint): Promise<UTxO | null> {
    const utxos = await this.getAllCampaigns();

    for (const utxo of utxos) {
      if (utxo.datum) {
        try {
          const datum = Data.from(utxo.datum, CampaignSchema);
          return utxo;
        } catch (e) {
          continue;
        }
      }
    }
    return null;
  }
}

export default Crowdfund;