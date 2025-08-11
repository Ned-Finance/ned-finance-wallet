import type {
  Address,
  AssetId,
  CapabilityFlags,
  ChainId,
  PortfolioSnapshot,
  TokenBalance,
} from "@ned-finance/wallet-core";

export type ChainSummary = {
  chainId: ChainId;
  displayName: string;
  capabilities: CapabilityFlags;
};

export type Account = {
  address: Address;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

export interface Wallet {
  listChains(): Promise<ChainSummary[]>;

  deriveFromMnemonic(
    mnemonic: string,
    selections: ChainId[],
    index?: number
  ): Promise<Record<ChainId, Account>>;

  getSnapshot(chainId: ChainId, address: Address): Promise<PortfolioSnapshot>;
  getTokens?(
    chainId: ChainId,
    p: {
      address: Address;
      cursor?: string;
      limit?: number;
      updatedAfter?: number;
    }
  ): Promise<{ items: TokenBalance[]; cursor?: string; updatedAt: number }>;

  buildTransfer(
    chainId: ChainId,
    p: {
      from: Address;
      to: Address;
      assetId: AssetId;
      amount: bigint;
      memo?: string;
    }
  ): Promise<{ unsignedTx: Uint8Array }>;
  estimateFees(
    chainId: ChainId,
    p: { unsignedTx: Uint8Array; priority?: "low" | "medium" | "high" }
  ): Promise<{
    maxFee?: string;
    suggestion?: Array<{ priority: "low" | "medium" | "high"; fee: string }>;
  }>;
  signTransaction(
    accountId: string,
    unsignedTx: Uint8Array
  ): Promise<{ signedTx: Uint8Array }>;
  sendTransaction(
    chainId: ChainId,
    signedTx: Uint8Array
  ): Promise<{ txid: string }>;

  signMessage(
    accountId: string,
    message: Uint8Array | string
  ): Promise<Uint8Array>;

  submitTransfer(p: {
    chainId: ChainId;
    fromAccountId: string;
    from: Address;
    to: Address;
    assetId: AssetId;
    amount: bigint;
    memo?: string;
    priority?: "low" | "medium" | "high";
  }): Promise<{ txid: string }>;
}
