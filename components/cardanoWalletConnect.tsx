import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet, CardanoWallet } from "@meshsdk/react";
import { BlockfrostProvider } from "@meshsdk/core";
import { walletAuth } from "@/service/auth";

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

  // Load saved auth data on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("cardano_auth_token");
    const savedUserData = localStorage.getItem("cardano_user_data");

    if (savedToken && savedUserData) {
      setUserToken(savedToken);
      setUserData(JSON.parse(savedUserData));
      setIsAuthenticated(true);
    }
  }, []);

  // Auto-authenticate when wallet connects (optional)
  useEffect(() => {
    if (connected && wallet && !isAuthenticated && !isAuthenticating) {
      console.log("Wallet connected, ready for authentication");
    }
  }, [connected, wallet, isAuthenticated, isAuthenticating]);

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
    if (!wallet || !connected || isAuthenticating) return;

    setIsAuthenticating(true);
    setAuthError(null);
    setCurrentStep("signing");

    try {
      console.log("wallet", address);
      // Get wallet address
      // const usedAddresses = await wallet.getUsedAddresses();
      // const walletAddress = usedAddresses[0];

      if (!address) {
        throw new Error("No wallet address found");
      }

      // Generate nonce for signature
      const nonce = generateNonce();
      console.log("nonce", nonce)
      const message = `BackerBoost Authentication\nNonce: ${nonce}\nAddress: ${address}`;

      // Request signature from wallet
      const signature = await wallet.signData(
        address
      );

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
          // router.push('/dashboard');
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
    localStorage.removeItem("cardano_auth_token");
    localStorage.removeItem("cardano_user_data");
    disconnect();
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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>BackerBoost - Cardano Wallet Authentication</h1>

      {/* Wallet Connection Section */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>Wallet Connection</h2>
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

        <div style={{ marginTop: "10px" }}>
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
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h2>Authentication</h2>

          {!isAuthenticated ? (
            <div>
              <p>Connect your wallet to access BackerBoost features</p>
              <button
                onClick={handleAuthentication}
                disabled={isAuthenticating}
                style={{
                  padding: "10px 20px",
                  backgroundColor: isAuthenticating ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isAuthenticating ? "not-allowed" : "pointer",
                  marginTop: "10px",
                }}
              >
                {isAuthenticating && "⏳ "}
                {getAuthButtonText()}
              </button>

              {authError && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  Error: {authError}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: "green" }}>✅ Authenticated successfully!</p>
              <p>
                <b>User ID:</b> {userData?.id}
              </p>
              <p>
                <b>Role:</b> {userData?.role}
              </p>
              <p>
                <b>Wallet:</b> {userData?.walletAddress?.slice(0, 50)}...
              </p>

              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Assets Section - Only show if authenticated */}
      {connected && isAuthenticated && (
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h2>Wallet Assets</h2>
          {assets ? (
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
                overflow: "auto",
              }}
            >
              <code>{JSON.stringify(assets, null, 2)}</code>
            </pre>
          ) : (
            <button
              type="button"
              onClick={getAssets}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: loading ? "#ffc107" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
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
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Disconnect Wallet
        </button>
      )}
    </div>
  );
};

export default Home;
