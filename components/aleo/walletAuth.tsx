'use client';

import { useEffect, useState } from 'react';
import {
  useConnect,
  useAccount,
  useDisconnect,
  useRequestSignature,
  Network
} from '@puzzlehq/sdk';
import { useToast } from "@/hooks/use-toast"

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Briefcase, User, Loader2 } from 'lucide-react';
import { walletAuth } from '@/service/auth';
import { useStore } from '@/store/user';

export function UserTypeSelection() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'connecting' | 'signing' | 'authenticating'
  >('idle');
  const { toast } = useToast();

  const router = useRouter();

  // Zustand store hooks
  const { saveUserToken, saveUserData, saveUserType, loadUserData } =
    useStore();

  // Puzzle wallet hooks
  const { account } = useAccount();

  const {
    connect,
    error: connectError,
    loading: connectLoading
  } = useConnect({
    dAppInfo: {
      name: 'BackerBoost',
      description:
        '',
      iconUrl: 'https://backerboost.com/logo.png',
    },
    permissions: {
      programIds: {
        [Network.AleoMainnet]: [
          'dapp_1.aleo',
          'dapp_2.aleo',
          'dapp_2_imports.aleo'
        ],
        [Network.AleoTestnet]: [
          'crowdfund_aleo.aleo',
        ]
      }
    }
  });

  const { disconnect } = useDisconnect();

  const {
    requestSignature,
    response: requestSignatureResponse,
    loading: requestSignatureLoading,
    error: requestSignatureError
  } = useRequestSignature({
    message: account?.address ?? 'BackerBoost Authentication'
  });

  // Handle errors from wallet interactions
  useEffect(() => {
    if (connectError) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: String(connectError)
      });
      setIsProcessing(false);
      setCurrentStep('idle');
    }

    if (requestSignatureError) {
      toast({
        variant: "destructive",
        title: "Signature error",
        description: String(requestSignatureError)
      });
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  }, [connectError, requestSignatureError]);
  const handleSignatureResponse = async () => {
    // Process signature if available, regardless of currentStep to handle auto-login cases
    if (requestSignatureResponse?.signature && account?.address) {
      try {
        setCurrentStep('authenticating');

        const body = {
          walletAddress: account.address,
          signature: requestSignatureResponse.signature,
          nonce: '977ce29a-a5f7-4e90-88d7-a4aeba8278ce' // Consider generating a proper nonce
        };

        const response = await walletAuth(body);

        if (response?.data) {
          // Save user data and token
          saveUserData(response);
          saveUserToken(response.data.token);
          saveUserType(response.data.user.role);

          // Navigate based on user role and new user status
          const isNewUser = response.data.isNewUser;
          const userRole = response.data.user.role;

          toast({
            title: "Success",
            description: response.message || 'Login successful',
            variant: "default"
          });

          // if (userRole === 'USER') {
          //   router.replace(
          //     isNewUser ? '/onboarding/freelancer' : '/freelancer'
          //   );
          // } else if (userRole === 'employer') {
          //   router.replace(isNewUser ? '/onboarding/employer' : '/employer');
          // }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        const errorMessage =
          (error as any)?.response?.data?.message || 'Authentication failed';
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: errorMessage,
        });
      } finally {
        setIsProcessing(false);
        setCurrentStep('idle');
      }
    }else {
      await requestSignature();
    }
  };
  // Handle signature response
  useEffect(() => {
    handleSignatureResponse();
  }, [
    requestSignatureResponse,
    account,
     router,
    saveUserData,
    saveUserToken,
    saveUserType
  ]);

  // Main authentication flow
  const handleAuthentication = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // If account is already connected, skip to signature request
      if (account?.address) {
        setCurrentStep('signing');
        await requestSignature();
        // The signature response will be handled in the useEffect above
      } else {
        // Connect wallet first
        setCurrentStep('connecting');
        await connect();
        // Wait a moment for the connection to be established
        await new Promise((resolve) => setTimeout(resolve, 100));

        // After connection, request signature
        if (account?.address) {
          setCurrentStep('signing');
          await requestSignature();
        }
      }
    } catch (error) {
      console.error('Authentication flow error:', error);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "Authentication process failed"
      });
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  };

  // Check if wallet is already connected on component mount and load user data
  useEffect(() => {
    loadUserData();

    // If wallet is already connected, update the button state
    if (account?.address) {
      console.log('Wallet already connected:', account.address);
    }
  }, [loadUserData, account]);

  // Auto-login if wallet is already connected
  // useEffect(() => {
  //   // Check if wallet is already connected but user is not logged in
  //   const attemptAutoLogin = async () => {
  //     // Only attempt auto-login if wallet is connected and we're not already processing
  //     if (account?.address && !isProcessing && currentStep === 'idle') {
  //       console.log('Wallet already connected, attempting auto-login');
  //       // Don't set isProcessing here to avoid UI changes until user clicks the button
  //       // This just prepares for a faster login when they do click
  //       handleAuthentication();
  //     }
  //   };

  //   attemptAutoLogin();
  // }, [account, isProcessing, currentStep]);

  // Button text based on current step
  const getButtonText = () => {
    switch (currentStep) {
      case 'connecting':
        return 'Connecting Wallet...';
      case 'signing':
        return 'Waiting for Signature...';
      case 'authenticating':
        return 'Authenticating...';
      default:
        return account
          ? 'Continue with Puzzle Wallet'
          : 'Connect Puzzle Wallet';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle
          className={`text-2xl font-bold animate-pulse text-blue-70  `}
        >
          BackerBoost
        </CardTitle>
        <CardDescription>
          BackerBoost is a decentralised crowdfunding platform that enables
          individuals to create funding requests for specific goals and share
          them online.{' '}
        </CardDescription>
      </CardHeader>

      <CardContent></CardContent>

      <CardFooter>
        <Button
          onClick={handleAuthentication}
          disabled={isProcessing}
          className={`w-full bg-blue-600 hover:bg-blue-700`}
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
}
