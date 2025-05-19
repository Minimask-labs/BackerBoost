'use client';
// import { UserTypeSelection } from '@/components/aleo/walletAuth';
import CardanoWalletConnect from '@/components/cardanoWalletConnect';
import React from 'react';
export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <CardanoWalletConnect />
    </div>
  );
}
