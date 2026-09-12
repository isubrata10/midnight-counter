# Midnight Counter dApp
[![CI Status](https://github.com/isubrata10/midnight-counter/actions/workflows/ci.yml/badge.svg)](https://github.com/isubrata10/midnight-counter/actions/workflows/ci.yml)
> A privacy-preserving counter application on the Midnight Network where users can increment the total without revealing their individual additions.

## Live Demo
https://midnight-counter-omega.vercel.app

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | 02c4070a55bb2807fd2b3592860e2cf767959d507cb95fc02df50f72f1e68998 |

## What This Does
This dApp acts as a cumulative counter on the Midnight blockchain. Users can interact with the web interface to increment the total count by a specific secret amount. The application generates a zero-knowledge proof locally in the browser, submitting only the proof and the new total to the network, keeping the individual contribution completely hidden.

## Privacy Model
- PUBLIC: The `count` variable, which stores the total running sum visible to anyone on-chain.
- PRIVATE: The `secretIncrement` value, which is the specific amount added by the user (never sent on-chain).
- PROVED without revealing: The user proves they correctly added their secret amount to the current public total and accurately reported the new total, without disclosing their individual addition.

## Privacy Claim
An on-chain observer can see that the counter's total value has increased, and they can see exactly what the new total is. However, they **cannot see** how much was added during the specific transaction, nor can they deduce the user's private input.

## Tech Stack
- Midnight network, Compact, Midnight.js SDK, React/Vite, Lace wallet

## Prerequisites
- Lace wallet installed (with Midnight Network support enabled)
- Node.js v22

## Setup & Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/isubrata10/midnight-counter.git
   cd midnight-counter
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

## Run Tests
```bash
npm test
```

## CI/CD
This repository is configured with a GitHub Actions CI/CD pipeline that automatically triggers on every push and pull request to the `main` branch. The pipeline checks out the code, installs Node.js v22 and project dependencies, downloads the Midnight Compact compiler, successfully compiles the smart contract (`compact compile`), and runs the automated test suite to ensure contract logic and privacy guarantees are maintained.

## Product Proposal
See PROPOSAL.md

## Demo Video
https://drive.google.com/drive/folders/1xmOdmozS5VXBbA8zDFm2z0b6LBYRwcNz

