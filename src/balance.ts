import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import * as zswap from '@midnight-ntwrk/zswap';
import { firstValueFrom } from 'rxjs';

setNetworkId('preprod');

async function main() {
  const seed = process.env.SEED;
  if (!seed) throw new Error("SEED environment variable is required.");

  const indexerUrl = 'https://indexer.preprod.midnight.network/api/v3/graphql';
  const indexerWsUrl = 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws';
  const proverUrl = 'http://127.0.0.1:6300';
  const nodeUrl = 'https://rpc.preprod.midnight.network';
  
  console.log("Initializing Wallet...");
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

  console.log("Waiting for wallet state to sync...");
  let state = await firstValueFrom(wallet.state());
  while (state.syncProgress && !state.syncProgress.synced) {
     console.log(`Syncing... (source gap: ${state.syncProgress.lag.sourceGap}, apply gap: ${state.syncProgress.lag.applyGap})`);
     await new Promise(r => setTimeout(r, 2000));
     state = await firstValueFrom(wallet.state());
  }

  console.log("\n==============================");
  console.log("Wallet Sync Complete");
  console.log("==============================");
  console.log("Unshielded Address:", state.address);
  console.log("\nToken Balances:");
  
  const tokens = Object.keys(state.balances);
  if (tokens.length === 0) {
      console.log("No balances found (0 tDUST).");
  } else {
      for (const token of tokens) {
          const isDust = token === '0000000000000000000000000000000000000000000000000000000000000000000000'; // Note: the actual DUST token ID can vary by formatting, we'll just print them all
          const displayToken = isDust ? "tDUST" : token;
          console.log(`- ${displayToken}: ${state.balances[token]}`);
      }
  }
  
  await wallet.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
