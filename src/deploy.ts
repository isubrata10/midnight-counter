import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/counter/contract/index.js';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { pipe } from 'effect';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import * as ledger from '@midnight-ntwrk/ledger-v8';

import { WalletFacade, WalletEntrySchema } from '@midnight-ntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { UnshieldedWallet, createKeystore, PublicKey } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { InMemoryTransactionHistoryStorage } from '@midnight-ntwrk/wallet-sdk-abstractions';
import path from 'path';

setNetworkId('preprod');

async function main() {
  const seedHex = process.env.SEED;
  if (!seedHex) {
    console.error("Missing SEED environment variable");
    process.exit(1);
  }
  
  const seedBuffer = Buffer.from(seedHex, 'hex');
  const hdWalletResult = HDWallet.fromSeed(seedBuffer);
  if (hdWalletResult.type !== 'seedOk') throw hdWalletResult.error;
  
  const hdWallet = hdWalletResult.hdWallet;
  const keysResult = hdWallet.selectAccount(0).selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust]).deriveKeysAt(0);
  if (keysResult.type !== 'keysDerived') throw new Error("Could not derive keys");

  const zswapKeys = ledger.ZswapSecretKeys.fromSeed(keysResult.keys[Roles.Zswap]);
  const dustKey = ledger.DustSecretKey.fromSeed(keysResult.keys[Roles.Dust]);
  
  const networkId = getNetworkId();

  const unshieldedKeystore = createKeystore(keysResult.keys[Roles.NightExternal], networkId);
  const unshieldedPublicKey = PublicKey.fromKeyStore(unshieldedKeystore);
  
  const indexerUrl = 'https://indexer.preprod.midnight.network/api/v3/graphql';
  const indexerWsUrl = 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws';
  const proverUrl = 'http://127.0.0.1:6300';
  const nodeUrl = 'https://rpc.preprod.midnight.network';

  console.log("Initializing Midnight Preprod wallet (Facade API)...");
  const txHistoryStorage = new InMemoryTransactionHistoryStorage(WalletEntrySchema);

  const configuration = {
    indexerClientConnection: { indexerHttpUrl: indexerUrl, indexerWsUrl: indexerWsUrl },
    nodeClientConnection: { nodeUrl },
    proofServerConnection: { proverUrl },
    provingServerUrl: new URL(proverUrl),
    txHistoryStorage,
    costParameters: { feeBlocksMargin: 10 },
    networkId,
    relayURL: nodeUrl as any
  };

  const wallet = await WalletFacade.init({
    configuration,
    shielded: (config) => ShieldedWallet(config).startWithSecretKeys(zswapKeys),
    unshielded: (config) => UnshieldedWallet(config).startWithPublicKey(unshieldedPublicKey),
    dust: (config) => DustWallet(config).startWithSecretKey(dustKey, ledger.LedgerParameters.initialParameters().dust),
  });

  await wallet.start(zswapKeys, dustKey);
  console.log("Waiting for wallet state to sync...");
  await wallet.waitForSyncedState();
  console.log("Wallet synced.");
  
  const publicDataProvider = indexerPublicDataProvider(indexerUrl, indexerWsUrl);
  const zkConfigProvider = new NodeZkConfigProvider(path.resolve('./managed/counter'));
  const proofProvider = httpClientProofProvider(proverUrl, zkConfigProvider as any);
  
  const walletProvider = {
    balanceTx: async (tx: any, ttl?: Date) => {
      const recipe = await wallet.balanceUnboundTransaction(tx, {
        shieldedSecretKeys: zswapKeys,
        dustSecretKey: dustKey
      }, { ttl: ttl || new Date(Date.now() + 60000) });
      const signedRecipe = await wallet.signRecipe(recipe, (data) => unshieldedKeystore.signData(data));
      return await wallet.finalizeRecipe(signedRecipe);
    },
    getCoinPublicKey: () => zswapKeys.coinPublicKey,
    getEncryptionPublicKey: () => zswapKeys.encryptionPublicKey
  };

  const midnightProvider = {
    submitTx: async (tx: any) => {
      return await wallet.submitTransaction(tx);
    }
  };

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'deploy-wallet-state-preprod',
      privateStoragePasswordProvider: async () => process.env.MIDNIGHT_WALLET_PASSWORD || 'secret',
      accountId: 'deployer'
    }),
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider
  };

  console.log("Deploying Counter contract to Midnight Preprod...");
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
    await wallet.stop();
    process.exit(exitCode);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
