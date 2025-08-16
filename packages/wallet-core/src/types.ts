export type EvmCAIP2<T extends number = number> = `eip155:${T}`;
export type SolanaId = "solana";
export type ChainId = SolanaId | EvmCAIP2;

export type BlockchainName = string;

export type Address = string;
export type AssetId = string;

export type Amount = { value: bigint; decimals: number };

export type TokenBalance = {
  assetId: AssetId;
  amount: Amount;
  updatedAt: number;
};

export type Account = {
  chainId: ChainId;
  address: Address;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

export type NftItem = {
  assetId: AssetId;
  tokenId?: string; // EVM
  mint?: string; // Solana
  name?: string;
  mediaUrl?: string;
  updatedAt: number;
  ext?: Record<string, { schema: string; data: unknown }>;
};

export type Position = {
  protocolId: string;
  category: "lending" | "lp" | "stake" | "perp" | "other";
  valueUsd?: number;
  components: Array<{
    role: "supplied" | "borrowed" | "staked" | "rewards";
    assetId: AssetId;
    amount: Amount;
  }>;
  updatedAt: number;
  ext?: Record<string, { schema: string; data: unknown }>;
};

export type PortfolioSnapshot = {
  chainId: ChainId;
  address: Address;
  native?: TokenBalance;
  tokens: TokenBalance[];
  nfts?: NftItem[];
  positions?: Position[];
  priceMap?: Record<AssetId, number>;
  cursor?: string;
  ext?: Record<string, { schema: string; data: unknown }>;
  updatedAt: number;
};

export type CapabilityFlags = {
  assets: { native: true; tokens: boolean; nfts: boolean; positions: boolean };
  tx: {
    transfers: boolean;
    tokenTransfers: boolean;
    contractCalls?: boolean;
    batching?: boolean;
    accountAbstraction?: boolean;
  };
  fees: {
    dynamic: boolean;
    priorityLevels?: ("low" | "medium" | "high")[];
    eip1559Style?: boolean;
  };
  nameService: boolean;
  simulation: boolean;
  subscriptions: { balance: boolean; transactions: boolean; mempool?: boolean };
  pagination: boolean;
  pricesInline?: boolean;
  standards?: string[];
};

export type ChainUpdateEvent =
  | { type: "balance"; address: Address; assetId?: AssetId }
  | {
      type: "transaction";
      address: Address;
      txid: string;
      status?: "pending" | "confirmed" | "failed";
    }
  | { type: "nft"; address: Address }
  | { type: "positions"; address: Address };

// Blockchain connector contract lives here so everyone shares it
export interface ChainConnector<K extends ChainId = ChainId> {
  readonly chainId: K;
  readonly capabilities: CapabilityFlags;
  readonly name: BlockchainName;

  getSnapshot(params: {
    address: Address;
    include?: { tokens?: boolean; nfts?: boolean; positions?: boolean };
    cursor?: string;
    timeoutMs?: number;
    signal?: AbortSignal;
  }): Promise<PortfolioSnapshot>;

  getTokens?(params: {
    address: Address;
    cursor?: string;
    limit?: number;
    updatedAfter?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
  }): Promise<{ items: TokenBalance[]; cursor?: string; updatedAt: number }>;

  getNFTs?(params: {
    address: Address;
    cursor?: string;
    limit?: number;
    updatedAfter?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
  }): Promise<{ items: NftItem[]; cursor?: string; updatedAt: number }>;

  buildTransfer(params: {
    from: Address;
    to: Address;
    assetId: AssetId;
    amount: bigint;
    memo?: string;
  }): Promise<{ unsignedTx: Uint8Array }>;

  estimateFees(params: {
    unsignedTx: Uint8Array;
    priority?: "low" | "medium" | "high";
  }): Promise<{
    maxFee?: string;
    suggestion?: Array<{ priority: "low" | "medium" | "high"; fee: string }>;
  }>;

  sendTransaction(params: { signedTx: Uint8Array }): Promise<{ txid: string }>;
}
