import type {
  BlockchainName,
  ChainConnector,
  ChainId,
} from "@ned-finance/wallet-core";
import {
  SOLANA_BLOCKCHAIN_NAME,
  SOLANA_CHAIN_ID,
  SOLANA_DERIVATION,
  createSolanaConnector,
} from "@ned-finance/wallet-solana";

export const CONNECTOR_LOADERS: Record<
  ChainId,
  () => Promise<{
    chainId: ChainId;
    name: BlockchainName;
    derivation: {
      curve: "secp256k1" | "ed25519";
      path: (i: number) => string;
      pubToAddress: (pub: Uint8Array) => string;
    };
    create: () => ChainConnector;
    displayName: string;
  }>
> = {
  [SOLANA_CHAIN_ID]: async () => ({
    chainId: SOLANA_CHAIN_ID,
    name: SOLANA_BLOCKCHAIN_NAME,
    derivation: SOLANA_DERIVATION,
    create: () =>
      createSolanaConnector({ rpcUrl: process.env.EXPO_PUBLIC_SOL_RPC }),
    displayName: "Solana",
  }),
};
