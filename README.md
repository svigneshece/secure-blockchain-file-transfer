# 🔐 SecureTransfer

### Blockchain-Based File Integrity & Secure Transfer Platform

**SecureTransfer** is a full-stack web application that combines **SHA-256 cryptographic hashing, Firebase, Ethereum smart contracts, Hardhat, and MetaMask** to provide verifiable file integrity.

Instead of trusting only a centralized database, SecureTransfer creates a unique cryptographic fingerprint for every uploaded file and records that fingerprint on the blockchain.

> **Upload → Hash → Blockchain Registration → Firebase Record → Verification**

---

## 🚀 Demo

### 🖥️ Local Demo

The project currently runs with a local Hardhat blockchain and MetaMask.

```text
Frontend      → Next.js
Authentication → Firebase
Database      → Firebase Firestore
Blockchain    → Hardhat Local
Wallet        → MetaMask
Smart Contract → Solidity
```

### ▶️ Run the Demo

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For blockchain functionality, start the local Hardhat network:

```bash
npx hardhat node
```

Then connect MetaMask to:

```text
Network: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency: ETH
```

> ⚠️ The current blockchain demo uses a local Hardhat network. The blockchain data is therefore intended for development and demonstration purposes.

### 🌐 GitHub

[View the source code on GitHub](https://github.com/svigneshece/secure-blockchain-file-transfer)

---

# ✨ Why SecureTransfer?

Traditional file systems can tell you **where a file is stored**, but they don't necessarily provide an independently verifiable proof that the file hasn't been modified.

SecureTransfer solves this using cryptographic hashing and blockchain verification.

For every uploaded file:

```text
Original File
     │
     ▼
SHA-256
     │
     ▼
64-character cryptographic fingerprint
     │
     ▼
Ethereum Smart Contract
     │
     ▼
Blockchain transaction
     │
     ▼
Firebase file record
```

If the file changes by even a single byte, its SHA-256 hash changes.

Therefore:

```text
Original File Hash ≠ Modified File Hash
```

This makes the blockchain record useful as an integrity reference.

---

# 🧠 Core Features

| Feature                    | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| 🔐 SHA-256 Hashing         | Generates a cryptographic fingerprint for every file          |
| ⛓️ Blockchain Registration | Stores the file hash on an Ethereum-compatible smart contract |
| 🦊 MetaMask                | Connects the user's wallet to the blockchain                  |
| 🔥 Firebase Authentication | Handles user authentication                                   |
| ☁️ Firestore               | Stores file metadata and blockchain transaction information   |
| 🔎 File Verification       | Checks whether a file hash has been registered                |
| 📊 Dashboard               | Provides a centralized view of the user's files               |
| 🧾 Transaction Tracking    | Stores the blockchain transaction hash                        |
| 🛡️ Duplicate Detection    | Prevents the same file hash from being registered twice       |
| ⚡ Next.js                  | Provides the full-stack web application                       |
| 💎 Solidity                | Implements the blockchain integrity contract                  |

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User / Client   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Next.js App     │
                    │   React + TypeScript  │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │    Firebase     │          │    SHA-256      │
       │ Authentication  │          │    Hashing      │
       │   + Firestore   │          └────────┬────────┘
       └─────────────────┘                   │
                                             ▼
                                  ┌────────────────────┐
                                  │      MetaMask      │
                                  │       Wallet       │
                                  └─────────┬──────────┘
                                            │
                                            ▼
                                  ┌────────────────────┐
                                  │    Hardhat Local   │
                                  │  Ethereum Network  │
                                  └─────────┬──────────┘
                                            │
                                            ▼
                                  ┌────────────────────┐
                                  │  FileIntegrity.sol │
                                  │  Solidity Contract  │
                                  └────────────────────┘
```

---

# 🔄 File Security Workflow

## 1. Select a file

The user selects a file from the browser.

```text
Test.pdf
393.15 KB
```

## 2. Generate SHA-256

The browser calculates the SHA-256 digest using the Web Crypto API.

Example:

```text
2e59b5dc774f...e58cb33450f5
```

The complete SHA-256 value contains:

```text
64 hexadecimal characters
```

## 3. Connect MetaMask

The application connects to the user's MetaMask wallet.

For the current development environment:

```text
Chain ID: 31337
Network: Hardhat Local
```

## 4. Register the hash

The SHA-256 hash is converted into `bytes32` and sent to the Solidity contract.

```solidity
registerFile(bytes32 fileHash)
```

## 5. Blockchain confirmation

After the transaction is confirmed, the transaction hash is returned.

```text
Transaction recorded
```

## 6. Store metadata

Firebase Firestore stores information such as:

```text
File name
File size
File type
SHA-256 hash
Blockchain transaction hash
User ID
Timestamp
```

## 7. Verify

The verification system can query the blockchain:

```solidity
verifyFile(bytes32 fileHash)
```

and retrieve:

```text
Exists
Uploader wallet
Blockchain timestamp
```

---

# ⛓️ Smart Contract

The core blockchain logic is implemented in:

```text
contracts/FileIntegrity.sol
```

The contract maintains a mapping between a file hash and its blockchain record.

```solidity
mapping(bytes32 => FileRecord) private files;
```

Each record contains:

```text
File Hash
Uploader Address
Blockchain Timestamp
Existence Status
```

### Register

```solidity
registerFile(bytes32 fileHash)
```

Registers a file hash on the blockchain.

### Verify

```solidity
verifyFile(bytes32 fileHash)
```

Returns:

```text
exists
uploader
timestamp
```

### Duplicate protection

The contract prevents the same hash from being registered twice:

```solidity
require(
    !files[fileHash].exists,
    "File hash already registered"
);
```

---

# 🛠️ Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Authentication & Database

* Firebase Authentication
* Firebase Firestore

### Blockchain

* Solidity
* Ethereum-compatible smart contract
* Hardhat
* ethers.js
* MetaMask

### Cryptography

* SHA-256
* Web Crypto API

### Development

* Node.js
* npm
* Git
* GitHub
* VS Code

---

# 📁 Project Structure

```text
secure-blockchain-file-transfer/
│
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── files/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── upload/
│   │   └── page.tsx
│   │
│   ├── verify/
│   │   └── page.tsx
│   │
│   └── page.tsx
│
├── contracts/
│   └── FileIntegrity.sol
│
├── ignition/
│   └── modules/
│       └── FileIntegrity.ts
│
├── lib/
│   ├── blockchain.ts
│   ├── firebase.ts
│   └── firestore.ts
│
├── scripts/
│   └── send-op-tx.ts
│
├── test/
│
├── types/
│   └── ethers-contracts/
│
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── next-env.d.ts
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

Install:

* Node.js
* npm
* Git
* MetaMask browser extension

Then clone the repository:

```bash
git clone https://github.com/svigneshece/secure-blockchain-file-transfer.git
```

Enter the project:

```bash
cd secure-blockchain-file-transfer
```

Install dependencies:

```bash
npm install
```

---

# 🔥 Firebase Configuration

Create a Firebase project and configure Authentication and Firestore.

Create:

```text
.env.local
```

Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Important

Never commit:

```text
.env.local
```

The project `.gitignore` already excludes local environment files.

---

# ⛓️ Start Hardhat

Open a terminal:

```bash
npx hardhat node
```

Keep this terminal running.

Hardhat provides a local Ethereum network:

```text
RPC:
http://127.0.0.1:8545

Chain ID:
31337

Network:
Hardhat Local
```

---

# 🦊 MetaMask Configuration

Connect MetaMask to:

```text
Network Name:
Hardhat Local

RPC URL:
http://127.0.0.1:8545

Chain ID:
31337

Currency Symbol:
ETH
```

For development, Hardhat provides test accounts with local ETH.

> Never use Hardhat private keys or development accounts with real funds.

---

# 📜 Deploy the Smart Contract

Compile the contract:

```bash
npx hardhat compile
```

Deploy using the project's Hardhat configuration/deployment setup.

After deployment, update the contract address in:

```text
lib/blockchain.ts
```

Example:

```typescript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

---

# ▶️ Start the Application

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Example Demo

### Input

```text
File:
Test.pdf

Size:
393.15 KB
```

### SHA-256

```text
2e59b5dc774f...e58cb33450f5
```

### Blockchain

```text
Network:
Hardhat Local

Chain ID:
31337
```

### Result

```text
SHA-256 Secured

Blockchain:
Transaction recorded
```

The transaction hash is stored alongside the file metadata in Firestore.

---

# 🔎 File Verification

The verification flow compares the cryptographic identity of a file against the blockchain record.

```text
Select File
     │
     ▼
Generate SHA-256
     │
     ▼
Query Smart Contract
     │
     ▼
Hash Registered?
     │
 ┌───┴────┐
 │        │
 YES      NO
 │        │
 ▼        ▼
Verified  Not Registered
```

If a file is modified, its SHA-256 fingerprint changes.

Therefore, a modified file will not match the original blockchain fingerprint.

---

# 🔐 Security Model

SecureTransfer uses multiple security layers:

### Layer 1 — Authentication

Firebase Authentication identifies the user.

### Layer 2 — Cryptographic Integrity

SHA-256 generates a deterministic fingerprint of the file.

### Layer 3 — Blockchain Verification

The fingerprint is registered through a Solidity smart contract.

### Layer 4 — Transaction Proof

The blockchain transaction provides a verifiable record of the registration.

### Layer 5 — Database Metadata

Firestore stores application-level metadata associated with the file.

---

# ⚠️ Current Limitations

This project is currently a **development/prototype implementation**.

The current version uses:

```text
Hardhat Local
```

Therefore, blockchain records are not currently stored on a public Ethereum testnet or mainnet.

The project also currently stores file metadata and cryptographic fingerprints rather than implementing decentralized file storage.

---

# 🚀 Future Improvements

Planned improvements include:

* [ ] Deploy smart contract to Sepolia
* [ ] Add public blockchain explorer links
* [ ] Add decentralized storage using IPFS
* [ ] Add encrypted file storage
* [ ] Add file download functionality
* [ ] Add QR-code based verification
* [ ] Add blockchain transaction explorer
* [ ] Add role-based access control
* [ ] Add file sharing permissions
* [ ] Add email notifications
* [ ] Add production deployment
* [ ] Add automated smart-contract testing
* [ ] Add CI/CD using GitHub Actions
* [ ] Add comprehensive security testing

---

# 📊 Project Status

```text
Frontend                 ✅ Working
Firebase Authentication  ✅ Working
Firestore                ✅ Working
SHA-256 Hashing          ✅ Working
MetaMask Integration     ✅ Working
Hardhat Local Network    ✅ Working
Smart Contract           ✅ Working
Blockchain Registration  ✅ Working
File Verification        ✅ Working
GitHub Repository        ✅ Available
Public Testnet           🚧 Planned
Production Deployment    🚧 Planned
```

---

# 🎯 Learning Outcomes

This project demonstrates practical experience with:

```text
Blockchain Development
        +
Smart Contracts
        +
Web3 Wallet Integration
        +
Cryptographic Hashing
        +
Next.js
        +
TypeScript
        +
Firebase
        +
Database Design
        +
Full-Stack Development
```

It is designed as a practical demonstration of how blockchain can be used as a **tamper-evident integrity layer for digital files**.

---

# 👨‍💻 Author

**Vignesh S**

Electronics & Communication Engineering

Interested in:

```text
Embedded Systems
IoT
Blockchain
Web3
Hardware Development
Software Engineering
```

---

# 📄 License

This project is currently provided for educational and demonstration purposes.

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

**Repository:**

https://github.com/svigneshece/secure-blockchain-file-transfer
