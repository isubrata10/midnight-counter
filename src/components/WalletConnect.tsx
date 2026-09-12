import { useState } from "react";
import { Wallet } from 'lucide-react';

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
  const [network, setNetwork] = useState<string>('Disconnected');

  const connectWallet = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!window.midnight || Object.keys(window.midnight).length === 0) {
        throw new Error('No compatible wallet found. Please install Lace.');
      }
      
      const walletKey = Object.keys(window.midnight)[0];
      const laceApi = window.midnight[walletKey];
      
      let api;
      let connectedNetwork = '';
      
      const networksToTry = ['preprod', 'preview', 'testnet'];
      for (const net of networksToTry) {
        try {
          api = await laceApi.connect(net);
          connectedNetwork = net;
          break;
        } catch (e) {
          // Continue to next network
        }
      }

      if (!api) {
         try {
           api = await laceApi.connect();
           connectedNetwork = 'unknown';
         } catch(e) {
           throw new Error('Connection rejected by wallet.');
         }
      }
      
      if (!api || !api.getUnshieldedAddress) {
         throw new Error("Invalid API returned from wallet.");
      }
      
      const { unshieldedAddress } = await api.getUnshieldedAddress();
      
      setAddress(unshieldedAddress);
      setNetwork(connectedNetwork);
      if (onConnect) onConnect(api);
      
    } catch (err: any) {
      setError(err.message || 'Connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setNetwork('Disconnected');
    setError(null);
    if (onConnect) onConnect(null);
  };

  const formatAddress = (addr: string) => {
    if (addr.length < 12) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--text-main)' }}></div>
        Midnight Counter
      </div>
      
      <div className="nav-controls">
        <span className="network-badge">{network}</span>
        
        {!address ? (
          <button className="btn btn-outline" onClick={connectWallet} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <button className="btn btn-outline" onClick={disconnectWallet} title={address}>
            <Wallet size={16} />
            {formatAddress(address)}
          </button>
        )}
      </div>
      
      {error && (
        <div style={{ position: 'absolute', top: 80, right: 20, zIndex: 100 }} className="alert alert-error">
          {error}
        </div>
      )}
    </nav>
  );
}
