import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useWallet, CardanoWallet } from '@meshsdk/react';
import { BlockfrostProvider } from '@meshsdk/core';
import { walletAuth } from '@/service/auth';
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
import { useStore } from '@/store/user';

const key = process.env.NEXT_PUBLIC_CARDANO_PROJECT_ID;
const provider = new BlockfrostProvider(key as string);

// Generate a random nonce for signature
const generateNonce = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const Home: NextPage = () => {
  const {
    wallet,
    state,
    connected,
    name,
    address,
    connecting,
    connect,
    disconnect,
    error
  } = useWallet();
  const { saveUserToken, saveUserData, saveUserType, loadUserData, logout } =
    useStore();

  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Authentication states
  // const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  // const [userToken, setUserToken] = useState<string | null>(null);
  // const [userData, setUserData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'signing' | 'authenticating'
  >('idle');

  // Load saved auth data on mount
  // useEffect(() => {
  //   const savedToken = localStorage.getItem('cardano_auth_token');
  //   const savedUserData = localStorage.getItem('cardano_user_data');

  //   if (savedToken && savedUserData) {
  //     saveUserToken(savedToken);
  //     saveUserData(JSON.parse(savedUserData));
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (connected && wallet) {
      console.log('Wallet connected, initiating automatic authentication');
      handleAuthentication();
    }
  }, [connected, wallet]);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      try {
        const _assets = await wallet.getAssets();
        const balance = await wallet.getBalance();
        console.log('Balance:', balance);
        console.log('_assets:', _assets);
        setAssets(_assets);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleAuthentication = async () => {
    if (!wallet || !connected ) return;

    // setIsAuthenticating(true);
    setAuthError(null);
    setCurrentStep('signing');

    try {
      console.log('wallet', address);
      // Get wallet address
      // const usedAddresses = await wallet.getUsedAddresses();
      // const walletAddress = usedAddresses[0];

      if (!address) {
        throw new Error('No wallet address found');
      }

      // Generate nonce for signature
      const nonce = generateNonce();
      console.log('nonce', nonce);
      const message = `BackerBoost Authentication\nNonce: ${nonce}\nAddress: ${address}`;

      // Request signature from wallet
      const signature = await wallet.signData(address);

      setCurrentStep('authenticating');

      // Prepare authentication data
      const authData = {
        walletAddress: address,
        signature: signature.signature,
        nonce
      };

      // Send to backend for verification
      const response = await walletAuth(authData);

      if (response?.data) {
        // Save authentication data
        saveUserToken(response.data.token);
        saveUserData(response.data.user);
        // setIsAuthenticated(true);

        // Persist to localStorage
        // localStorage.setItem('cardano_auth_token', response.data.token);
        // localStorage.setItem(
        //   'cardano_user_data',
        //   JSON.stringify(response.data.user)
        // );

        console.log('Authentication successful:', response);

        // Handle new user vs returning user logic here
        if (response.data.isNewUser) {
          console.log('New user, redirect to onboarding');
          // router.push('/onboarding');
        } else {
          console.log('Returning user, redirect to dashboard');
          // router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthError(error.message || 'Authentication failed');
    } finally {
      // setIsAuthenticating(false);
      setCurrentStep('idle');
    }
  };

  const handleLogout = () => {
    // setIsAuthenticated(false);
    disconnect();
        logout();

  };

  const getAuthButtonText = () => {
    switch (currentStep) {
      case 'signing':
        return 'Waiting for Signature...';
      case 'authenticating':
        return 'Authenticating...';
      default:
        return 'Authenticate with Cardano Wallet';
    }
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle
            className={`text-2xl font-bold ${
              !connected ? 'animate-pulse' : ''
            } text-blue-70`}
          >
            BackerBoost
          </CardTitle>
          <CardDescription>
            BackerBoost is a decentralised crowdfunding platform that enables
            individuals to create funding requests for specific goals and share
            them online.{' '}
          </CardDescription>
          {connecting && (
            <div className="flex items-center justify-center gap-2 mt-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{getAuthButtonText()}</span>
            </div>
          )}
          {connected && (
            <div className="flex items-center justify-center gap-2 mt-2 text-green-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Authenticated Successfully</span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Keep the CardContent empty as in original */}
        </CardContent>

        <CardFooter>
          <div className="w-full space-y-4">
            {!connected && (
              <div className="flex justify-center items-center w-full">
                <CardanoWallet
                  label="Connect a Wallet"
                  persist={true}
                  onConnected={() => {
                    console.log('Wallet connected');
                  }}
                  cardanoPeerConnect={{
                    dAppInfo: {
                      name: 'BackerBoost',
                      url: 'https://backerboost.com/'
                    },
                    announce: [
                      'wss://dev.btt.cf-identity-wallet.metadata.dev.cf-deployments.org'
                    ]
                  }}
                  burnerWallet={{
                    networkId: 0,
                    provider: provider
                  }}
                />
              </div>
            )}

            {/* {connected  && (
              <Button
                onClick={handleAuthentication}
                disabled={connecting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {connecting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {getAuthButtonText()}
              </Button>
            )} */}

            {connected && (
              <Button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Disconnect & Logout
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default Home;
