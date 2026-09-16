# Midnight Counter dApp

A robust, true-to-life integration with the Midnight Preprod Network. This application uses the official Midnight-JS SDK to compile, deploy, and interact with a zero-knowledge counter contract.

## Architecture

This dApp is structured around Midnight's real infrastructure:

- **Preprod Network**: Connected to the public Preprod indexer and proving servers.
- **deployContract()**: Deployment uses the SDK's `deployContract` function from a node script (`deploy.ts`).
- **Wallet Provider**: The Lace Wallet (via DApp Connector API) handles transaction balancing and user signatures.
- **Proof Provider**: Due to DApp connector constraints, proofs are generated via the Lace Wallet's native `prove` functionality, using `createUnprovenCallTx()` or the DApp provider directly. (Proofs are generated locally by the Lace extension or the prover server it relies upon, not solely inside the webpage).
- **Indexer**: `indexerPublicDataProvider` actively queries the Preprod indexer (`queryContractState`) for the most up-to-date, verified ledger state. React state only mirrors this ground truth.
- **Transaction Provider**: Broadcast uses the Lace Wallet's `submitTransaction`.
- **callTx/callCircuit**: The frontend invokes the generated contract API via `findDeployedContract` and executes `contract.callTx.increment()`, conforming precisely to the Midnight v4 architecture.

## Deployment

1. Make sure you have the Lace Wallet installed and funded with tDUST from the Midnight Preprod faucet.
2. Export your wallet's seed phrase to the environment:
   ```bash
   export SEED="your_seed_hex_string_here"
   ```
3. Run the deployment script:
   ```bash
   npm run deploy
   ```
4. Copy the deployed `ContractAddress` output in your console and paste it into `src/components/CircuitCall.tsx`.

## Testing

Run unit and integration tests using:

```bash
npm test
```

These tests invoke the actual `compact-runtime` logic (via `createConstructorContext` and `Contract.initialState`) to verify that the public count initializes to `0` and that the private `increment` circuit correctly applies to the state transitions.

## CI

The `.github/workflows/ci.yml` pipeline strictly compiles the `contracts/counter.compact` file using the official Midnight Docker image (`ghcr.io/midnight-ntwrk/compactc`). Compilation failure will immediately halt CI, preventing invalid contracts from reaching production.
