'use client';
// import { UserTypeSelection } from '@/components/auth/walletAuth/aleo/walletAuth';
import CardanoWalletConnect from '@/components/auth/walletAuth/cardano/cardanoWalletConnect';
import React from 'react';
export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* <UserTypeSelection /> */}
      <CardanoWalletConnect />
    </div>
  );
}
