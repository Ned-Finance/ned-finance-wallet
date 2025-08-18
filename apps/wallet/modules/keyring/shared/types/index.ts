import {
  Address as WalletAddress,
  ChainId as WalletChainId,
} from "@ned-finance/wallet";

export type ChainId = WalletChainId;
export type Address = WalletAddress;

export type PublicAccount = {
  address: Address;
  publicKey: string;
  chainId: ChainId;
  label?: string;
};

export type ScryptParams = {
  N: number;
  r: number;
  p: number;
  dkLen: number;
};

export type WrappedMK = {
  alg: "xchacha20poly1305";
  version: 1;
  // AEAD
  nonce: string; // base64 (24 bytes)
  box: string; // base64 (ciphertext+tag)
  // KDF
  salt: string; // base64 (scrypt salt)
  params: ScryptParams;
  createdAt: number;
};

export type EncryptedKeyBlob = {
  alg: "xchacha20poly1305";
  version: 1;
  nonce: string;
  box: string;
  createdAt: number;
};
