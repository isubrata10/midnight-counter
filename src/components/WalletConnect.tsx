import { useState } from "react";

declare global {
  interface Window {
    midnight?: Record<string, any>;
  }
}

interface WalletConnectProps {
  onConnect?: (api: any) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!window.midnight || Object.keys(window.midnight).length === 0) {
        throw new Error('No Midnight-compatible wallets detected. Ensure Lace is installed and unlocked.');
      }
      
      const walletKey = Object.keys(window.midnight)[0];
      const laceApi = window.midnight[walletKey];
      
      let api;
      try {
        // Try connecting to the current network the user is on by not specifying one,
        // or let the wallet decide.
        api = await laceApi.connect();
      } catch (connectErr: any) {
         throw new Error(`Wallet rejected connection: ${connectErr.message || JSON.stringify(connectErr)}`);
      }
      
      if (!api || !api.getUnshieldedAddress) {
         throw new Error("Connected successfully, but the wallet did not return the expected DApp API.");
      }
      const { unshieldedAddress } = await api.getUnshieldedAddress();
      
      setAddress(unshieldedAddress);
      if (onConnect) onConnect(api);
      
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setError(null);
    if (onConnect) onConnect(null);
  };

  return (
    <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.7)', border: '1px solid #444', color: 'white', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>Wallet Connection</h2>
      
      {error && <div style={{ color: '#ff5252', padding: '10px', background: 'rgba(255,0,0,0.1)', marginBottom: '10px', borderRadius: '4px' }}>
        <strong>Error:</strong> {error}
      </div>}
      
      {!address ? (
        <div>
          <p>Status: <span style={{ color: 'gray' }}>Disconnected</span></p>
          <button 
            onClick={connectWallet} 
            disabled={isLoading}
            style={{ padding: '8px 16px', cursor: isLoading ? 'wait' : 'pointer' }}
          >
            {isLoading ? 'Connecting...' : 'Connect Lace Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <p>Status: <strong style={{ color: '#4caf50' }}>Connected</strong></p>
          <p>Address: <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.1)', padding: '2px 4px' }}>{address}</span></p>
          <button 
            onClick={disconnectWallet} 
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
