# Midnight Counter dApp

A robust, true-to-life integration with the Midnight Preprod Network. This application uses the official Midnight-JS SDK to compile, deploy, and interact with a zero-knowledge counter contract.

## Deployment Documentation (Preprod)

To deploy to the real public Preprod network, follow these exact steps:

1. **Prerequisites**: Node v22, a compatible Midnight wallet (Lace), and Docker (for compiler).
2. **Compact Toolchain**: You need access to the private `ghcr.io/midnight-ntwrk/compactc` registry using a valid Midnight GitHub PAT.
3. **Install**: Run `npm ci` to cleanly install dependencies.
4. **Compile**: Run the compiler via Docker: `docker run --rm -v $(pwd):/workspace -w /workspace ghcr.io/midnight-ntwrk/compactc:0.19.0 contracts/counter.compact -o managed/counter`.
5. **Proof Server**: Run the official compatible Midnight proof server locally at `http://127.0.0.1:6300` (required for node deployment scripts; frontend relies on Lace's prover configuration).
6. **Wallet Setup**: Create a Midnight Lace wallet and configure it to the Preprod network.
7. **Faucet**: Fund your wallet with tDUST from the official Midnight Preprod Faucet.
8. **Deployment**: Export your seed phrase `export SEED="..."` and run `npm run deploy`.
9. **Obtain Address**: The deploy script will log the real `ContractAddress`.
10. **Configure Frontend**: Set the address in your environment: `export VITE_COUNTER_CONTRACT_ADDRESS="your_address_here"`.
11. **Run Frontend**: Execute `npm run dev` or `npm run build && npm run preview`.
12. **Real Increment**: Open the frontend, connect your wallet, input an increment amount, and click "Submit".
13. **Verify Hash**: The UI will output the actual transaction hash returned by the Preprod network.
14. **Verify Indexer**: The UI polls the Preprod Indexer. Wait for confirmation and watch the Public Total accurately increase!

*Note: Preprod and Preview are real public test networks. Undeployed/local standalone environments are only for development testing.*

## Architecture

- **Preprod Network**: Connected to the public Preprod indexer (`/api/v3/graphql`) and your local/Lace proving servers.
- **deployContract()**: Deployment uses the SDK's `deployContract` function from a node script (`src/deploy.ts`).
- **Wallet Provider**: The Lace Wallet (via DApp Connector API) handles transaction balancing and user signatures via a custom `WalletProvider` adapter in `useMidnight.ts`.
- **Proof Provider**: Proofs are generated via the configured `httpClientProofProvider` pointing to the Preprod prover server.
- **Indexer**: `indexerPublicDataProvider` actively queries the Preprod indexer (`queryContractState`) for the most up-to-date, verified ledger state.
- **Transaction Provider**: Broadcast uses the Lace Wallet's `submitTransaction`.
- **callTx/callCircuit**: The frontend invokes the generated contract API via `findDeployedContract` and executes `contract.callTx.increment()`, conforming precisely to the Midnight architecture.

## Testing

Run unit and integration tests using:

```bash
npm test
```

These tests invoke the actual `compact-runtime` logic (via `createCircuitContext` and `contract.circuits.increment`) to mathematically verify that the ledger state updates from `0` to `5` to `8` upon providing the secret increment witness.

For full network integration tests:
```bash
npm run test:integration
```
*(Requires MIDNIGHT_NETWORK=preprod, MIDNIGHT_WALLET_SEED, and VITE_COUNTER_CONTRACT_ADDRESS to be set).*

## CI

The `.github/workflows/ci.yml` pipeline strictly compiles the `contracts/counter.compact` file using the official Midnight Docker image. Compilation failure will immediately halt CI.
