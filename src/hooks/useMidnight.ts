import { useState } from 'react';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { parseCoinPublicKeyToHex, parseEncPublicKeyToHex, toHex, fromHex } from '@midnight-ntwrk/midnight-js-utils';
import { Transaction, NetworkId } from '@midnight-ntwrk/zswap';

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
      
      const fetchBytes = async (path: string) => {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load artifact: ${path}`);
        return new Uint8Array(await res.arrayBuffer());
      };

      const zkConfigProvider = {
         getZKIR: async (id: string) => fetchBytes(`/counter/zkir/${id}.zkir`),
         getProverKey: async (id: string) => fetchBytes(`/counter/keys/${id}.pk`),
         getVerifierKey: async (id: string) => fetchBytes(`/counter/keys/${id}.vk`),
      };
      
      if (!config.proverServerUri) {
        throw new Error("Lace wallet did not provide a proverServerUri. A valid Midnight Preprod Proof Server is required.");
      }
      const proofProvider = httpClientProofProvider(config.proverServerUri, zkConfigProvider as any);
      
      const shieldedAddr = await connectedWallet.getShieldedAddress();
      const walletProvider = {
         balanceTx: async (tx: any, _ttl?: Date) => {
             const serialized = toHex(tx.serialize(NetworkId.TestNet as any));
             const balancedHex = await connectedWallet.balanceUnsealedTransaction(serialized);
             return Transaction.deserialize(fromHex(balancedHex), NetworkId.TestNet as any) as any;
         },
         getCoinPublicKey: () => parseCoinPublicKeyToHex(shieldedAddr.shieldedCoinPublicKey, NetworkId.TestNet as any),
         getEncryptionPublicKey: () => parseEncPublicKeyToHex(shieldedAddr.shieldedEncryptionPublicKey, NetworkId.TestNet as any),
      };

      const midnightProvider = {
         submitTx: async (tx: any) => {
             const serialized = toHex(tx.serialize(NetworkId.TestNet as any));
             await connectedWallet.submitTransaction(serialized);
             return tx.transactionHash();
         }
      };

      setProviders({
        publicDataProvider,
        zkConfigProvider,
        proofProvider,
        walletProvider,
        midnightProvider
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
