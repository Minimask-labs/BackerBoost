import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet, CardanoWallet } from "@meshsdk/react";
import { BlockfrostProvider } from "@meshsdk/core";
import { walletAuth } from "@/service/auth";
import { useRouter } from "next/navigation";
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
    error
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
    'idle' | 'signing' | 'authenticating'
  >('idle');

  const router = useRouter();

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
    if (connected && wallet && !isAuthenticated && !isAuthenticating) {
      const authenticate = async () => {
        setIsAuthenticating(true);
        setAuthError(null);
        setCurrentStep("signing");
        try {
          if (!address) {
            throw new Error("No wallet address found");
          }
          const nonce = generateNonce();
          const message = `BackerBoost Authentication\nNonce: ${nonce}\nAddress: ${address}`;
          const signature = await wallet.signData(address);
          setCurrentStep("authenticating");
          const authData = {
            walletAddress: address,
            signature: signature.signature,
            nonce,
          };
          const response = await walletAuth(authData);
          if (response?.data) {
            setUserToken(response.data.token);
            setUserData(response.data.user);
            setIsAuthenticated(true);
            localStorage.setItem("cardano_auth_token", response.data.token);
            localStorage.setItem(
              "cardano_user_data",
              JSON.stringify(response.data.user)
            );
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
      authenticate();
    }
  }, [connected, wallet, isAuthenticated, isAuthenticating, address, router]);

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
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        BackerBoost - Cardano Wallet Authentication
      </h1>

      {/* Wallet Connection Section */}
      <div className="mb-8 p-5 border rounded-lg bg-muted">
        <h2 className="text-xl font-semibold mb-2">Wallet Connection</h2>
        <CardanoWallet
          label={"Connect a Wallet"}
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

        <div className="mt-2 space-y-1">
          <p>
            <b>State:</b> {state}
          </p>
          <p>
            <b>Connected:</b> {connected ? "Yes" : "No"}
          </p>
          <p>
            <b>Connecting:</b> {connecting ? "Yes" : "No"}
          </p>
          <p>
            <b>Wallet Name:</b> {name || "None"}
          </p>
        </div>
      </div>

      {/* Authentication Section */}
      {connected && (
        <div className="mb-8 p-5 border rounded-lg bg-muted">
          <h2 className="text-xl font-semibold mb-2">Authentication</h2>

          {!isAuthenticated ? (
            <div>
              <p>Connect your wallet to access BackerBoost features</p>
              {isAuthenticating && (
                <p className="text-primary mt-2">{getAuthButtonText()}</p>
              )}
              {authError && (
                <p className="text-destructive mt-2">Error: {authError}</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-green-600">✅ Authenticated successfully!</p>
              <p>
                <b>User ID:</b> {userData?.id}
              </p>
              <p>
                <b>Role:</b> {userData?.role}
              </p>
              <p>
                <b>Wallet:</b>{" "}
                <span className="break-all">
                  {userData?.walletAddress?.slice(0, 50)}...
                </span>
              </p>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive text-white rounded mt-2 hover:bg-destructive/90"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Assets Section - Only show if authenticated */}
      {connected && isAuthenticated && (
        <div className="mb-8 p-5 border rounded-lg bg-muted">
          <h2 className="text-xl font-semibold mb-2">Wallet Assets</h2>
          {assets ? (
            <pre className="bg-background p-2 rounded overflow-auto">
              <code>{JSON.stringify(assets, null, 2)}</code>
            </pre>
          ) : (
            <button
              type="button"
              onClick={getAssets}
              disabled={loading}
              className={`px-4 py-2 rounded text-white mt-2 ${
                loading
                  ? "bg-secondary cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {loading ? "⏳ Loading..." : "Get Wallet Assets"}
            </button>
          )}
        </div>
      )}

      {/* Disconnect Section */}
      {connected && (
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
        >
          Disconnect Wallet
        </button>
      )}
    </div>
  );
};

export default Home;
