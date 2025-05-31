import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet, CardanoWallet } from "@meshsdk/react";
import { BlockfrostProvider } from "@meshsdk/core";
import { walletAuth } from "@/service/auth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Briefcase, User, Loader2 } from "lucide-react";
import { useStore } from "@/store/user";

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
    error,
  } = useWallet();
  const { saveUserToken, saveUserData, saveUserType, loadUserData, logout } =
    useStore();

  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Authentication states
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<
    "idle" | "signing" | "authenticating"
  >("idle");

  // NEW: Track if we've completed initial setup
  const [hasInitializedAuth, setHasInitializedAuth] = useState<boolean>(false);
  
  const router = useRouter();

  // Load saved auth data on mount and check for previous authentication
  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('cardano_auth_token');
      const savedUserData = localStorage.getItem('cardano_user_data');

      if (savedToken && savedUserData) {
        try {
          const parsedUserData = JSON.parse(savedUserData);
          saveUserToken(savedToken);
          saveUserData(parsedUserData);
          setUserToken(savedToken);
          setUserData(parsedUserData);
          setIsAuthenticated(true);
          console.log("Restored previous authentication");
        } catch (error) {
          console.error("Error parsing saved user data:", error);
          // Clear corrupted data
          localStorage.removeItem('cardano_auth_token');
          localStorage.removeItem('cardano_user_data');
        }
      }
      
      setHasInitializedAuth(true);
    };

    initializeAuth();
  }, [saveUserToken, saveUserData]);

  // IMPROVED: Only auto-authenticate when conditions are right
  useEffect(() => {
    // Don't auto-authenticate until we've initialized and checked for existing auth
    if (!hasInitializedAuth) return;
    
    // Only auto-authenticate if:
    // 1. Wallet is connected
    // 2. We have a wallet instance
    // 3. User is not already authenticated
    // 4. We're not currently authenticating
    // 5. User hasn't manually disconnected (indicated by having no saved token but wallet is connected)
    
    const shouldAutoAuthenticate = 
      connected && 
      wallet && 
      !isAuthenticated && 
      !isAuthenticating &&
      address; // Make sure we actually have an address

    if (shouldAutoAuthenticate) {
      console.log("Wallet connected, initiating automatic authentication");
      handleAuthentication();
    }
  }, [connected, wallet, isAuthenticated, isAuthenticating, hasInitializedAuth, address]);

  // Log out when wallet disconnects (but only if we were authenticated)
  useEffect(() => {
    if (hasInitializedAuth && !connected && isAuthenticated) {
      console.log("Wallet disconnected, logging out...");
      handleLogout();
    }
  }, [connected, isAuthenticated, hasInitializedAuth]);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      try {
        const _assets = await wallet.getAssets();
        const balance = await wallet.getBalance();
        console.log("Balance:", balance);
        console.log("_assets:", _assets);
        setAssets(_assets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleAuthentication = async () => {
    if (!wallet || !connected) return;

    setIsAuthenticating(true);
    setAuthError(null);
    setCurrentStep("signing");

    try {
      console.log("wallet address:", address);

      if (!address) {
        throw new Error("No wallet address found");
      }

      // Generate nonce for signature
      const nonce = generateNonce();
      console.log("nonce", nonce);
      const message = `BackerBoost Authentication\nNonce: ${nonce}\nAddress: ${address}`;

      // Request signature from wallet
      const signature = await wallet.signData(address);

      setCurrentStep("authenticating");

      // Prepare authentication data
      const authData = {
        walletAddress: address,
        signature: signature.signature,
        nonce,
      };

      // Send to backend for verification
      const response = await walletAuth(authData);

      if (response?.data) {
        // Save authentication data
        saveUserToken(response.data.token);
        saveUserData(response.data.user);
        setUserToken(response.data.token);
        setUserData(response.data.user);
        setIsAuthenticated(true);

        // Persist to localStorage
        localStorage.setItem("cardano_auth_token", response.data.token);
        localStorage.setItem(
          "cardano_user_data",
          JSON.stringify(response.data.user)
        );

        console.log("Authentication successful:", response);

        // Handle new user vs returning user logic here
        if (response.data.isNewUser) {
          console.log("New user, redirect to onboarding");
          // router.push('/onboarding');
        } else {
          console.log("Returning user, redirect to dashboard");
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "Authentication failed");
    } finally {
      setIsAuthenticating(false);
      setCurrentStep("idle");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserToken(null);
    setUserData(null);
    setAuthError(null);
    
    // Clear localStorage
    localStorage.removeItem("cardano_auth_token");
    localStorage.removeItem("cardano_user_data");
    
    // Disconnect wallet and clear store
    disconnect();
    logout();
  };

  const handleManualAuthentication = () => {
    if (connected && wallet && address) {
      handleAuthentication();
    }
  };

  const getAuthButtonText = () => {
    switch (currentStep) {
      case "signing":
        return "Waiting for Signature...";
      case "authenticating":
        return "Authenticating...";
      default:
        return "Authenticate with Cardano Wallet";
    }
  };

  // IMPROVED: Better initial state handling
  const renderWalletStatus = () => {
    // Show loading during initial setup
    if (!hasInitializedAuth) {
      return (
        <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Initializing...</span>
        </div>
      );
    }

    // Show connecting state
    if (connecting) {
      return (
        <div className="flex items-center justify-center gap-2 mt-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Connecting wallet...</span>
        </div>
      );
    }

    // Show authenticated state
    if (connected && isAuthenticated) {
      return (
        <div className="flex items-center justify-center gap-2 mt-2 text-green-600">
          <Shield className="h-4 w-4" />
          <span className="text-sm">Authenticated Successfully</span>
        </div>
      );
    }

    // Show authenticating state
    if (connected && isAuthenticating) {
      return (
        <div className="flex items-center justify-center gap-2 mt-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{getAuthButtonText()}</span>
        </div>
      );
    }

    // Show connected but not authenticated
    if (connected && !isAuthenticated && !isAuthenticating) {
      return (
        <div className="flex items-center justify-center gap-2 mt-2 text-orange-600">
          <User className="h-4 w-4" />
          <span className="text-sm">Wallet Connected - Ready to Authenticate</span>
        </div>
      );
    }

    // Default state for new visitors - neutral message
    return (
      <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
        <Briefcase className="h-4 w-4" />
        <span className="text-sm">Connect your wallet to get started</span>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle
            className={`text-2xl font-bold ${
              !connected ? "animate-pulse" : ""
            } text-blue-70`}
          >
            BackerBoost
          </CardTitle>
          <CardDescription>
            BackerBoost is a decentralised crowdfunding platform that enables
            individuals to create funding requests for specific goals and share
            them online.{" "}
          </CardDescription>

          {/* IMPROVED: Status Indicators */}
          {renderWalletStatus()}

          {/* Show errors only for actual errors, not initial states */}
          {authError && (
            <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              Error: {authError}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Keep the CardContent empty as in original */}
        </CardContent>

        <CardFooter>
          <div className="w-full space-y-4">
            {/* Show wallet connection if not connected */}
            {!connected && hasInitializedAuth && (
              <div className="flex justify-center items-center w-full">
                <CardanoWallet
                  label="Connect a Wallet"
                  persist={true}
                  onConnected={() => {
                    console.log("Wallet connected");
                  }}
                  cardanoPeerConnect={{
                    dAppInfo: {
                      name: "BackerBoost",
                      url: "https://backerboost.com/",
                    },
                    announce: [
                      "wss://dev.btt.cf-identity-wallet.metadata.dev.cf-deployments.org",
                    ],
                  }}
                  burnerWallet={{
                    networkId: 0,
                    provider: provider,
                  }}
                />
              </div>
            )}

            {/* Manual authentication button for connected but not authenticated users */}
            {connected && !isAuthenticated && !isAuthenticating && (
              <Button
                onClick={handleManualAuthentication}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {getAuthButtonText()}
              </Button>
            )}

            {/* Disconnect & Logout for authenticated users */}
            {connected && isAuthenticated && (
              <Button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Disconnect & Logout
              </Button>
            )}

            {/* Simple disconnect for connected but not authenticated users */}
            {connected && !isAuthenticated && !isAuthenticating && (
              <Button onClick={disconnect} variant="outline" className="w-full">
                Disconnect Wallet
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default Home;