import { useState } from 'react';
import type { NextPage } from 'next';
import { useWallet, CardanoWallet } from '@meshsdk/react';
 import { BlockfrostProvider } from '@meshsdk/core';

const key = process.env.NEXT_PUBLIC_CARDANO_PROJECT_ID;

const provider = new BlockfrostProvider(key as string);

const Home: NextPage = () => {
    const {
      wallet,
      state,
      connected,
      name,
      connecting,
      connect,
      disconnect,
      error
    } = useWallet();  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      const balance = await wallet.getBalance();
      console.log('Balance:', balance);
      console.log('_assets:', _assets);
      setAssets(_assets);
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>Connect Wallet</h1>
      <CardanoWallet
        label={'Connect a Wallet'}
        persist={true}
        onConnected={() => {
          console.log('on connected');
        }}
        cardanoPeerConnect={{
          dAppInfo: {
            name: 'Mesh SDK',
            url: 'https://meshjs.dev/'
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
      {connected && (
        <>
          <h1>Get Wallet Assets</h1>
          {assets ? (
            <pre>
              <code className="language-js">
                {JSON.stringify(assets, null, 2)}
              </code>
            </pre>
          ) : (
            <button
              type="button"
              onClick={() => getAssets()}
              disabled={loading}
              style={{
                margin: '8px',
                backgroundColor: loading ? 'orange' : 'grey'
              }}
            >
              Get Wallet Assets
            </button>
          )}
          <div>
            <p>
              <b>State: </b> {state}
            </p>
            <p>
              <b>Connected?: </b> {connected ? 'Is connected' : 'Not connected'}
            </p>
            <p>
              <b>Connecting wallet?: </b> {connecting ? 'Connecting...' : 'No'}
            </p>
            <p>
              <b>Name of connected wallet: </b>
              {name}
            </p>
            <button onClick={() => disconnect()}>Disconnect Wallet</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
