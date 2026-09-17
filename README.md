# Midnight Counter dApp

A robust integration architecture for the Midnight Preprod Network. This repository provides a complete, working template to compile, deploy, and interact with a zero-knowledge counter contract using the official `@midnight-ntwrk/midnight-js` SDK.

**Note: No live Preprod contract is currently deployed by default. You must perform the deployment yourself using a funded Midnight wallet.**

## Deployment Documentation (Preprod)

To execute a genuine deployment to the public Preprod network, follow these exact steps:

1. **Prerequisites**: Node v22, a compatible Midnight wallet (Lace), and Docker (for the Compact compiler).
2. **Compact Toolchain**: You need access to the private `ghcr.io/midnight-ntwrk/compactc` registry using a valid Midnight GitHub PAT.
3. **Install**: Run `npm ci` to securely and deterministically install dependencies.
4. **Compile**: Compile the generated contract bindings via Docker: `docker run --rm -v $(pwd):/workspace -w /workspace ghcr.io/midnight-ntwrk/compactc:0.19.0 contracts/counter.compact -o managed/counter`.
5. **Proof Server**: Run the official compatible Midnight proof server locally at `http://127.0.0.1:6300`. This is explicitly required for the headless Node deployment script. (The frontend UI delegates proving securely to the Lace wallet's internal configuration).
6. **Wallet Setup**: Create a Midnight Lace wallet and configure it to the Preprod network.
7. **Faucet**: Fund your wallet with tDUST from the official Midnight Preprod Faucet.
8. **Deployment**: Export your seed phrase (`export SEED="..."`), set a secure local storage password (`export MIDNIGHT_WALLET_PASSWORD="..."`), and execute `npm run deploy`. If deployment fails, the script will cleanly exit with a non-zero code.
9. **Obtain Address**: Upon successful deployment, the script will output the real `ContractAddress`.
10. **Configure Frontend**: Set the address in your environment: `export VITE_COUNTER_CONTRACT_ADDRESS="your_address_here"`.
11. **Run Frontend**: Execute `npm run dev` or `npm run build && npm run preview`.

## Frontend Integration Flow

When interacting with the frontend, the application strictly respects the Preprod network's verification boundaries:

1. **callTx / Generated Contract**: The UI invokes the generated contract API via `findDeployedContract` and executes `contract.callTx.increment()`.
2. **Transaction Hash**: A real transaction hash is returned by `callTx` and displayed as "Transaction Submitted". The UI **does not** claim the contribution is confirmed at this stage.
3. **Indexer Confirmation**: The UI shifts to "Waiting for Indexer" and actively polls the Preprod Indexer's public GraphQL state (`/api/v3/graphql`) via `queryContractState`.
4. **True Confirmation**: Only when the indexer reports a mathematically verified, updated ledger count does the UI transition to the final "Confirmed" state.

## Architecture

- **Network**: Explicitly configured for the public `preprod` Midnight network.
- **Wallet Provider**: The Lace Wallet (via DApp Connector API) handles transaction balancing and user signatures via a custom adapter in `useMidnight.ts`.
- **Proof Provider**: Proofs are generated via the `httpClientProofProvider` (pointing to Lace in the frontend, or `127.0.0.1:6300` in scripts).
- **Indexer**: `indexerPublicDataProvider` actively queries the Preprod indexer for the verified ledger state.
- **Transaction Provider**: Broadcast uses the authentic Lace Wallet `submitTransaction` / `@midnight-ntwrk/wallet` implementation.

## Testing

Run local mathematical unit tests using:

```bash
npm test
```

These tests invoke the actual `compact-runtime` logic (via `createCircuitContext`) to verify that the ledger state legitimately updates from `0` to `5` to `8` without mocking the zero-knowledge mathematical transition.

For full network integration tests:
```bash
npm run test:integration
```
**Strict Requirements:** The integration suite will intentionally fail (exit code 1) unless `MIDNIGHT_NETWORK=preprod`, `MIDNIGHT_WALLET_SEED`, and `VITE_COUNTER_CONTRACT_ADDRESS` are explicitly provided in the environment. It connects to the live indexer, verifies the deployed contract, executes a real transaction, and polls for indexer confirmation.

## CI Workflows

- **`ci.yml`**: Uses `npm ci`, compiles via `ghcr.io/midnight-ntwrk/compactc:0.19.0`, executes native tests, builds the Vite application, and executes `oxlint`.
- **`integration.yml`**: Uses secure bash-level secrets verification to explicitly halt the workflow if the `MIDNIGHT_WALLET_SEED` or `MIDNIGHT_CONTRACT_ADDRESS` GitHub Action secrets are missing, perfectly preventing false integration successes.
