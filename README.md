# Auction System

A small React + TypeScript frontend for interacting with an on-chain auction system. Built with Bun and Material UI, it provides UI components to create auctions, place and withdraw bids, and check winners.

---

## Prerequisites

- bun: https://bun.sh
  - This project was initialized with Bun — use `bun` for installing dependencies and running scripts.
- A supported browser (Chrome, Firefox, Edge) with a web3 wallet extension (e.g. MetaMask) for signing transactions.

---

## Quick start

1. Install dependencies:

```bash
bun install
```

2. Start the development server:

```bash
bun dev
```

3. Open your browser at the address printed by the dev server (usually `http://localhost:3000` or similar).


---

## Environment variables

Place environment variables in a `.env` (or `.env.local`) file at the project root. The app expects values related to blockchain connectivity and optional API endpoints. Example:

```
# .env.local (example)
BUN_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```
