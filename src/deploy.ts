import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/counter/contract/index.js';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import * as zswap from '@midnight-ntwrk/zswap';
import { randomBytes } from 'crypto';
import path from 'path';

setNetworkId('preprod');

async function main() {
  const seed = randomBytes(32).toString('hex');
  
  const indexerUrl = 'https://indexer.preprod.midnight.network/api/v1/graphql';
  const indexerWsUrl = 'wss://indexer.preprod.midnight.network/api/v1/graphql';
  const proverUrl = 'https://prover.preprod.midnight.network/api/v1';
  const nodeUrl = 'https://rpc.preprod.midnight.network';
  
  const publicDataProvider = indexerPublicDataProvider(indexerUrl, indexerWsUrl);
  const zkConfigProvider = new NodeZkConfigProvider(path.resolve('./managed/counter'));
  const proofProvider = httpClientProofProvider(proverUrl, zkConfigProvider as any);
  
  const wallet = await WalletBuilder.build(
    indexerUrl,
    indexerWsUrl,
    proverUrl,
    nodeUrl,
    seed,
    zswap.NetworkId.TestNet,
    'warn'
  );

  wallet.start();

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'deploy-wallet-state',
      privateStoragePasswordProvider: async () => 'super_secret_strong_password_1234',
      accountId: 'deployer'
    }),
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider: wallet, 
    midnightProvider: wallet,
  };

  console.log("Deploying Counter contract...");
  const contract = await deployContract(providers as any, {
    compiledContract: Contract as any,
    initialPrivateState: undefined,
  } as any);

  console.log("Contract deployed!");
  console.log("Address:", contract.deployTxData.public.contractAddress);
  
  await wallet.close();
}

main().catch(console.error);
