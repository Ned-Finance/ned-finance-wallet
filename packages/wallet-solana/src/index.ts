import type {
  AssetId,
  CapabilityFlags,
  ChainConnector,
  NftItem,
  PortfolioSnapshot,
  TokenBalance,
} from "@ned-finance/wallet-core";
import { getBase58Codec } from "@solana/codecs-strings";

export const SOLANA_CHAIN_ID = "solana" as const;
export type SolanaChainId = typeof SOLANA_CHAIN_ID;

export const SOLANA_DERIVATION = {
  curve: "ed25519" as const,
  path: (i: number) => `m/44'/501'/${i}'/0'`,
  pubToAddress: (pub: Uint8Array) => {
    const codec = getBase58Codec();
    return codec.decode(pub);
  },
};

const now = () => Date.now();

const makeToken = (sym: string, val: bigint, dec: number): TokenBalance => ({
  assetId: `sol:token:${sym}` as AssetId,
  amount: { value: val, decimals: dec },
  updatedAt: now(),
});

const makeNft = (slug: string, i: number): NftItem => ({
  assetId: `sol:nft:${slug}:${i}` as AssetId,
  mint: `Mint${slug}${i}`,
  name: `Mock ${slug} #${i}`,
  mediaUrl: `https://picsum.photos/seed/${slug}-${i}/300/300`,
  updatedAt: now(),
  ext: {
    "solana:metaplex": {
      schema: "schema:solana.metaplex/metadata@1",
      data: {
        collection: { address: `Coll${slug}`, verified: true },
        sellerFeeBps: 500,
      },
    },
  },
});

export function createSolanaConnector(_opts?: {
  rpcUrl?: string;
}): ChainConnector<SolanaChainId> {
  const capabilities: CapabilityFlags = {
    assets: { native: true, tokens: true, nfts: true, positions: false },
    tx: {
      transfers: true,
      tokenTransfers: true,
      contractCalls: true,
      batching: true,
      accountAbstraction: false,
    },
    fees: {
      dynamic: true,
      priorityLevels: ["low", "medium", "high"],
      eip1559Style: false,
    },
    nameService: true,
    simulation: true,
    subscriptions: { balance: true, transactions: true, mempool: false },
    pagination: true,
    pricesInline: false,
    standards: ["spl", "metaplex"],
  };

  return {
    chainId: SOLANA_CHAIN_ID,
    capabilities,

    async getSnapshot({
      address,
      include = { tokens: true, nfts: true },
    }): Promise<PortfolioSnapshot> {
      const t0 = now();
      return {
        chainId: SOLANA_CHAIN_ID,
        address,
        native: {
          assetId: "sol:native:SOL" as AssetId,
          amount: { value: 12_345_678n, decimals: 9 },
          updatedAt: t0,
        },
        tokens: include.tokens
          ? [
              makeToken("USDC", 5_000_000n, 6),
              makeToken("BONK", 123_456_789n, 5),
            ]
          : [],
        nfts: include.nfts
          ? [makeNft("CoolCats", 1), makeNft("PixelBirds", 1)]
          : [],
        updatedAt: t0,
      };
    },

    async getTokens({ address, cursor, limit = 200 }) {
      const page = cursor ? Number(cursor) : 0;
      const total = 450;
      const count = Math.min(limit, Math.max(0, total - page));
      const items: TokenBalance[] = Array.from({ length: count }, (_, i) =>
        makeToken(`MOCK${page + i}`, 1_000n + BigInt(page + i), 6)
      );
      const next = page + count < total ? String(page + count) : undefined;
      return { items, cursor: next, updatedAt: now() };
    },

    async getNFTs({ address, cursor, limit = 50 }) {
      const page = cursor ? Number(cursor) : 0;
      const total = 123;
      const count = Math.min(limit, Math.max(0, total - page));
      const items: NftItem[] = Array.from({ length: count }, (_, i) =>
        makeNft("MockColl", page + i + 1)
      );
      const next = page + count < total ? String(page + count) : undefined;
      return { items, cursor: next, updatedAt: now() };
    },

    async buildTransfer({ from, to, assetId, amount, memo }) {
      const enc = new TextEncoder();
      const payload = JSON.stringify({
        from,
        to,
        assetId,
        amount: amount.toString(),
        memo,
        ts: Date.now(),
      });
      return { unsignedTx: enc.encode("SOLANA_UNSIGNED:" + payload) };
    },

    async estimateFees({ unsignedTx, priority = "medium" }) {
      const base =
        priority === "low" ? 3000 : priority === "high" ? 10_000 : 5000;
      return {
        maxFee: String(base),
        suggestion: [
          { priority: "low", fee: "3000" },
          { priority: "medium", fee: "5000" },
          { priority: "high", fee: "10000" },
        ],
      };
    },

    async sendTransaction({ signedTx }) {
      const head = Array.from(signedTx.slice(0, 8))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return { txid: `SoTxMock_${head}_${Date.now()}` };
    },
  };
}
