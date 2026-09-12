# Product Proposal

## What is the product, and who uses it?

**Private Impact Pool** is a privacy-preserving contribution tracker for communities, DAOs, nonprofits, crowdfunding campaigns, and other groups where participants want to contribute toward a shared goal without publicly revealing their individual contribution amounts.

The core problem is simple: traditional blockchain-based contribution systems make individual transactions and amounts transparent. While this provides accountability, it can also expose sensitive financial information about participants.

Private Impact Pool separates **collective transparency from individual privacy**.

A campaign creator defines a public target, such as:

* Community fund: 100,000 units
* Relief campaign: 50,000 units
* DAO treasury goal: 1,000,000 units
* Research funding target: 250,000 units

Participants then contribute a private amount.

The blockchain publicly records the evolving **total contribution**, allowing everyone to verify the campaign's progress. However, the amount contributed by any individual participant is kept private.

The product therefore answers an important question:

> **"Can a community prove how much it has achieved without forcing every individual to reveal how much they contributed?"**

The primary users are:

* **Community organizers** who need transparent progress tracking.
* **DAOs and Web3 communities** running private contribution campaigns.
* **Nonprofits and mutual-aid groups** where donors may prefer financial privacy.
* **Crowdfunding and grant communities** where collective progress matters more than publicizing individual contributions.
* **Participants** who want to contribute and verify the campaign's progress without exposing their personal contribution amount.

## Why Midnight specifically?

A transparent blockchain creates a difficult trade-off: everyone can independently verify the state of the system, but sensitive information such as individual contribution amounts can become permanently public.

Private Impact Pool is designed around the opposite principle:

**The outcome should be transparent; the individual contribution does not have to be.**

Midnight's privacy-preserving smart contract model allows the application to maintain a public cumulative total while keeping each participant's individual contribution private.

For example, suppose three participants contribute:

* Alice: 100
* Bob: 500
* Charlie: 50

The blockchain should reveal:

**Total = 650**

but should not reveal:

**Alice = 100, Bob = 500, Charlie = 50**

Each participant can privately prove that their contribution was correctly incorporated into the public total without publishing the secret contribution itself.

This makes Midnight particularly suitable for applications where **verifiability and privacy must coexist**, rather than forcing developers to choose one over the other.

## Data Model

| Data Point                    | Type                     | Disclosed To                              |
| ----------------------------- | ------------------------ | ----------------------------------------- |
| Campaign target               | Public                   | Everyone                                  |
| Current cumulative total      | Public                   | Everyone                                  |
| Campaign status               | Public                   | Everyone                                  |
| Individual contribution       | Private                  | Contributor                               |
| Previous private contribution | Private                  | Contributor                               |
| New cumulative total          | Public                   | Everyone                                  |
| Proof of valid contribution   | Zero-knowledge proof     | Network / verifier                        |
| Contributor identity          | Wallet-level information | According to wallet/network privacy model |

The key design principle is that the application does **not** need to publish the private contribution itself.

Instead, the participant provides a cryptographic proof that their private contribution was correctly incorporated into the public cumulative state.

## Mainnet Feasibility

The MVP is intentionally designed around a relatively simple privacy primitive: maintaining a public cumulative value while privately proving updates to that value.

This makes the initial version realistic to evolve toward Mainnet because the core smart-contract logic is narrow and can be tested independently from the user interface.

The project can progressively evolve from a single demonstration counter into a multi-campaign contribution platform with:

1. Campaign creation
2. Public funding targets
3. Private contributions
4. Zero-knowledge verification
5. Campaign progress dashboards
6. Contribution receipts without revealing amounts
7. Multiple independent campaigns
8. Wallet-based participation
9. Campaign completion and settlement
10. Analytics based only on publicly disclosed aggregate data

The initial implementation therefore serves as the **privacy primitive** for a broader product rather than being the final product itself.

The long-term vision is:

> **A privacy-preserving public-goods funding layer where communities can prove collective impact without exposing individual financial behavior.**
