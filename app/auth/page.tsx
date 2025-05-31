'use client';
import CardanoWalletConnect from '@/components/auth/walletAuth/cardano/cardanoWalletConnect';
import React from 'react';
export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <CardanoWalletConnect />
    </div>
  );
}
