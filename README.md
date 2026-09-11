# Midnight Counter Contract
> A privacy-preserving counter smart contract on the Midnight Network.

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preview  | 02c4070a55bb2807fd2b3592860e2cf767959d507cb95fc02df50f72f1e68998 |
| Preprod  | [PASTE ADDRESS AFTER DEPLOY]     |

## What This Does
This contract acts as a simple cumulative counter on the blockchain. Users can increment the total count by a specific amount without ever revealing how much they individually added. Only the newly updated total is publicly updated.

## Privacy Model
- What is PUBLIC (on-chain, visible to anyone): The `count` variable, which stores the total running sum.
- What is PRIVATE (private witness, never on-chain): The `secretIncrement` value, which is the specific amount added by the user.
- What the user PROVES without revealing: The user proves they correctly added their secret amount to the current public total and accurately reported the new total without disclosing their individual addition.

## Tech Stack
- Midnight network, Compact language, Node.js v22, Docker

## Prerequisites
- Node.js v22
- Docker (for local proof server)
- Compact Compiler
- Midnight Network Wallet (Lace)

## Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Ensure Docker is running the Midnight Proof Server:
   `docker run -d -p 6300:6300 midnightnetwork/proof-server`
4. Compile the contract:
   `compact compile contracts/counter.compact managed/counter`

## Run Tests
Run the following command to execute the test suite:
`npm test`

## Initial Idea
[LEAVE PLACEHOLDER — I will fill this in manually]

## Screenshots
[LEAVE PLACEHOLDER — I will add compile output and contract address screenshots]
