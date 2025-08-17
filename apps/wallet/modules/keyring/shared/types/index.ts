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

export type EncryptedKeyBlob = {
  alg: "xchacha20poly1305";
  version: 1;
  nonce: string;
  box: string;
  createdAt: number;
};
