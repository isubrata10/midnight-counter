import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/counter/contract/index.js';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { pipe } from 'effect';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import * as zswap from '@midnight-ntwrk/zswap';
import { firstValueFrom } from 'rxjs';
import path from 'path';

setNetworkId('preprod');

async function main() {
  const seed = process.env.SEED;
  if (!seed) throw new Error("SEED environment variable is required to deploy.");

  const indexerUrl = 'https://indexer.preprod.midnight.network/api/v3/graphql';
  const indexerWsUrl = 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws';
  const proverUrl = 'http://127.0.0.1:6300';
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
    'info'
  );

  wallet.start();

  const walletState = await firstValueFrom(wallet.state());

  const patchedWallet = Object.create(wallet);
  patchedWallet.balanceTx = async (tx: any, _ttl?: Date) => {
    return await wallet.balanceTransaction(tx, []);
  };
  patchedWallet.getCoinPublicKey = () => walletState.coinPublicKey;
  patchedWallet.getEncryptionPublicKey = () => walletState.encryptionPublicKey;
  patchedWallet.submitTx = async (tx: any) => {
    const txHash = await wallet.submitTransaction(tx);
    return txHash;
  };

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'deploy-wallet-state',
      privateStoragePasswordProvider: async () => process.env.MIDNIGHT_WALLET_PASSWORD || 'deploy_password',
      accountId: 'deployer'
    }),
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider: patchedWallet, 
    midnightProvider: patchedWallet,
  };

  console.log("Deploying Counter contract...");
  let exitCode = 0;
  try {
    const contract = await deployContract(providers as any, {
      compiledContract: pipe(CompiledContract.make('counter', Contract as any), CompiledContract.withVacantWitnesses) as any,
      initialPrivateState: undefined,
    } as any);

    console.log("Contract deployed!");
    console.log("Address:", contract.deployTxData.public.contractAddress);
  } catch (err) {
    console.error("Deployment failed:", err);
    exitCode = 1;
  } finally {
    await wallet.close();
    process.exit(exitCode);
  }
}

main().catch(console.error);
