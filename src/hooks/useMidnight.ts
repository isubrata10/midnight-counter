import { useState } from 'react';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { parseCoinPublicKeyToHex, parseEncPublicKeyToHex } from '@midnight-ntwrk/midnight-js-utils';

const NETWORK = 'preprod';
setNetworkId(NETWORK);

export function useMidnight() {
  const [api, setApi] = useState<any>(null);
  const [providers, setProviders] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      if (!(window as any).midnight) throw new Error("Lace wallet not found");
      const walletKey = Object.keys((window as any).midnight)[0];
      const connector = (window as any).midnight[walletKey];
      const connectedWallet = await connector.connect(NETWORK);
      setApi(connectedWallet);
      
      const config = await connectedWallet.getConfiguration();
      
      const publicDataProvider = indexerPublicDataProvider(config.indexerUri, config.indexerWsUri);
      
      const zkConfigProvider = {
         getZKIR: async () => new Uint8Array(),
         getProverKey: async () => new Uint8Array(),
         getVerifierKey: async () => new Uint8Array(),
      };
      
      const proofProvider = httpClientProofProvider(config.proverServerUri || 'http://localhost:6300', zkConfigProvider as any);
      
      const shieldedAddr = await connectedWallet.getShieldedAddress();
      const walletProvider = {
         balanceTx: async () => {
             throw new Error("Use balanceUnsealedTransaction via DApp connector.");
         },
         getCoinPublicKey: () => parseCoinPublicKeyToHex(shieldedAddr.shieldedCoinPublicKey, config.networkId as any),
         getEncryptionPublicKey: () => parseEncPublicKeyToHex(shieldedAddr.shieldedEncryptionPublicKey, config.networkId as any),
      };

      setProviders({
        publicDataProvider,
        zkConfigProvider,
        proofProvider,
        walletProvider,
      });
      
      const { unshieldedAddress } = await connectedWallet.getUnshieldedAddress();
      setAddress(unshieldedAddress);
      setError(null);
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  return { connect, providers, address, api, error };
}
