import { useState } from "react";


declare global {
  interface Window {
    midnight?: {
      mnLace?: any;
    };
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
      if (!window.midnight || !window.midnight.mnLace) {
        throw new Error('Lace wallet is not installed or the Midnight extension is disabled.');
      }
      
      const laceApi = window.midnight.mnLace;
      
      // Connect to the Preview network
      let api;
      try {
        api = await laceApi.connect('preview');
      } catch (connectErr: any) {
        // User rejection or network mismatch
        if (connectErr.message?.includes('network')) {
          throw new Error('Network mismatch. Please switch to the Preview network in Lace.');
        } else {
          throw new Error('Connection was rejected by the user or an internal error occurred.');
        }
      }
      
      // Fetch the unshielded address
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
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>Wallet Connection</h2>
      
      {error && <div style={{ color: '#d32f2f', padding: '10px', background: '#ffebee', marginBottom: '10px', borderRadius: '4px' }}>
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
          <p>Status: <strong style={{ color: 'green' }}>Connected</strong></p>
          <p>Address: <span style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '2px 4px' }}>{address}</span></p>
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
