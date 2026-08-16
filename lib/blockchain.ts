"use client";

import { ethers } from "ethers";

const CONTRACT_ADDRESS =
"0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
"function registerFile(bytes32 fileHash) public",
"function verifyFile(bytes32 fileHash) public view returns (bool exists, address uploader, uint256 timestamp)"
];

function getEthereum(): any {
if (typeof window === "undefined") {
throw new Error(
"Blockchain connection is only available in the browser."
);
}

const ethereum = (window as any).ethereum;

if (!ethereum) {
throw new Error("MetaMask is not installed.");
}

return ethereum;
}

function validateHash(hash: string): string {
const cleanHash = hash.trim();

if (!/^[0-9a-fA-F]{64}$/.test(cleanHash)) {
throw new Error("Invalid SHA-256 hash.");
}

return "0x" + cleanHash;
}

async function switchToHardhat(ethereum: any) {
try {
await ethereum.request({
method: "wallet_switchEthereumChain",
params: [
{
chainId: "0x7a69"
}
]
});
} catch (error: any) {
if (error.code === 4902) {
await ethereum.request({
method: "wallet_addEthereumChain",
params: [
{
chainId: "0x7a69",
chainName: "Hardhat Local",
nativeCurrency: {
name: "Ether",
symbol: "ETH",
decimals: 18
},
rpcUrls: [
"http://127.0.0.1:8545"
]
}
]
});
} else {
throw error;
}
}
}

async function getProvider(): Promise<ethers.BrowserProvider> {
const ethereum = getEthereum();

await ethereum.request({
method: "eth_requestAccounts"
});

let provider =
new ethers.BrowserProvider(ethereum);

let network =
await provider.getNetwork();

console.log(
"Current Chain ID:",
network.chainId.toString()
);

if (network.chainId.toString() !== "31337") {
await switchToHardhat(ethereum);


provider =
  new ethers.BrowserProvider(ethereum);

network =
  await provider.getNetwork();

console.log(
  "New Chain ID:",
  network.chainId.toString()
);


}

if (network.chainId.toString() !== "31337") {
throw new Error(
"MetaMask is not connected to Hardhat Local."
);
}

return provider;
}

export async function registerFileOnBlockchain(
sha256Hash: string
): Promise<string> {
const provider =
await getProvider();

const signer =
await provider.getSigner();

console.log(
"Connected wallet:",
await signer.getAddress()
);

const contract =
new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
signer
);

const hashBytes32 =
validateHash(sha256Hash);

console.log(
"Registering hash:",
hashBytes32
);

const transaction =
await contract.registerFile(
hashBytes32
);

console.log(
"Transaction:",
transaction.hash
);

await transaction.wait();

console.log(
"Transaction confirmed:",
transaction.hash
);

return transaction.hash;
}

export async function verifyFileOnBlockchain(
sha256Hash: string
) {
const provider =
await getProvider();

const contract =
new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
provider
);

const hashBytes32 =
validateHash(sha256Hash);

const result =
await contract.verifyFile(
hashBytes32
);

return {
exists: result[0],
uploader: result[1],
timestamp: result[2]
};
}
