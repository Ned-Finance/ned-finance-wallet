import {
  Address as WalletAddress,
  ChainId as WalletChainId,
} from "@ned-finance/wallet";

export type ChainId = WalletChainId;
export type Address = WalletAddress;
export type VaultId = string;

export type PublicAccount = {
  address: string;
  publicKey: string;
  chainId: ChainId;
  vaultId: VaultId;
  derivationPath: string;
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

export type EncryptedBlob = {
  alg: "xchacha20poly1305";
  version: 1;
  nonce: string;
  box: string;
  createdAt: number;
};

export type EncryptedKeyBlob = EncryptedBlob;

export type EncryptedSecretBlob = EncryptedBlob;

export type SeedVault = {
  id: VaultId;
  mnemonic: EncryptedSecretBlob;
  label?: string;
  createdAt: number;
};
