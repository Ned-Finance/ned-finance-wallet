import {
  Account,
  Address,
  ChainId,
  DerivationRegistry,
  deriveAddressFromMnemonic,
  PortfolioSnapshot,
  Token,
} from "@ned-finance/wallet-core";
import { AccountRecord, LocalSignerProvider } from "./signers";
import type { ChainSummary, ConnectorWithMetadata, Wallet } from "./types";

export class Web3Wallet implements Wallet {
  private reg = new DerivationRegistry();
  private connectors: Map<ChainId, ConnectorWithMetadata> = new Map();
  private accounts: Record<string, AccountRecord> = {};
  private signer = new LocalSignerProvider(this.accounts);

  private async ensureLoaded(chainId: ChainId) {
    // Lazy load the connector
    const { CONNECTOR_LOADERS } = await import("./plugins");
    const loader = CONNECTOR_LOADERS[chainId];

    if (!loader) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    const metadata = await loader();
    const connector = metadata.create();

    if (connector.chainId !== metadata.chainId) {
      throw new Error("Connector chainId mismatch");
    }

    this.connectors.set(chainId, {
      connector,
      derivation: metadata.derivation,
      displayName: metadata.displayName,
    });

    this.reg.add(metadata.chainId, metadata.derivation);
  }

  async listChains(): Promise<ChainSummary[]> {
    // In lazy loading, load all available chains
    const { CONNECTOR_LOADERS } = await import("./plugins");
    const chainIds = Object.keys(CONNECTOR_LOADERS) as ChainId[];

    // Load metadata for all chains
    const chainMetas = await Promise.all(
      chainIds.map(async (chainId) => {
        if (!this.connectors.has(chainId)) {
          await this.ensureLoaded(chainId);
        }
        return this.connectors.get(chainId)!;
      })
    );

    return chainMetas.map(({ connector, displayName }) => ({
      chainId: connector.chainId,
      displayName: displayName || connector.chainId,
      capabilities: connector.capabilities,
    }));
  }

  async deriveFromMnemonic(mnemonic: string, selections: ChainId[], index = 0) {
    // Load chains if necessary
    await Promise.all(selections.map((c) => this.ensureLoaded(c)));

    const entries = await Promise.all(
      selections.map(async (chainId) => {
        const r = await deriveAddressFromMnemonic(
          this.reg,
          mnemonic,
          chainId,
          index
        );
        const accountId = `${chainId}:${index}`;
        this.accounts[accountId] = { chainId, address: r.address };
        return [
          chainId,
          {
            address: r.address,
            privateKey: r.privateKey,
            publicKey: r.publicKey,
          },
        ] as const;
      })
    );

    return Object.fromEntries(entries) as Record<ChainId, Account>;
  }

  async getSnapshot(
    chainId: ChainId,
    address: Address
  ): Promise<PortfolioSnapshot> {
    await this.ensureLoaded(chainId);
    const connectorData = this.connectors.get(chainId)!;

    return connectorData.connector.getSnapshot({
      address,
      include: { tokens: true, nfts: true },
    });
  }

  async getTokens(
    chainId: ChainId,
    p: {
      address: Address;
      cursor?: string;
      limit?: number;
      updatedAfter?: number;
    }
  ) {
    await this.ensureLoaded(chainId);
    const connectorData = this.connectors.get(chainId)!;

    if (!connectorData.connector.getTokens)
      throw new Error("getTokens not supported");
    return connectorData.connector.getTokens(p);
  }

  async buildTransfer(
    chainId: ChainId,
    p: {
      from: Address;
      to: Address;
      token: Token;
      amount: bigint;
      memo?: string;
    }
  ) {
    await this.ensureLoaded(chainId);
    const connectorData = this.connectors.get(chainId)!;

    return connectorData.connector.buildTransfer(p);
  }

  async estimateFees(
    chainId: ChainId,
    p: { unsignedTx: Uint8Array; priority?: "low" | "medium" | "high" }
  ) {
    await this.ensureLoaded(chainId);
    const connectorData = this.connectors.get(chainId)!;

    return connectorData.connector.estimateFees(p);
  }

  async signTransaction(accountId: string, unsignedTx: Uint8Array) {
    const signer = await this.signer.getSigner(accountId);
    const signedTx = await signer.signTransaction(unsignedTx);
    return { signedTx };
  }

  async sendTransaction(chainId: ChainId, signedTx: Uint8Array) {
    await this.ensureLoaded(chainId);
    const connectorData = this.connectors.get(chainId)!;

    return connectorData.connector.sendTransaction({ signedTx });
  }

  async signMessage(accountId: string, message: Uint8Array | string) {
    const signer = await this.signer.getSigner(accountId);
    const bytes =
      typeof message === "string" ? new TextEncoder().encode(message) : message;
    return signer.signMessage(bytes);
  }

  async submitTransfer(p: {
    chainId: ChainId;
    fromAccountId: string;
    from: Address;
    to: Address;
    token: Token;
    amount: bigint;
    memo?: string;
    priority?: "low" | "medium" | "high";
  }) {
    const { unsignedTx } = await this.buildTransfer(p.chainId, {
      from: p.from,
      to: p.to,
      token: p.token,
      amount: p.amount,
      memo: p.memo,
    });
    const { signedTx } = await this.signTransaction(
      p.fromAccountId,
      unsignedTx
    );
    return this.sendTransaction(p.chainId, signedTx);
  }
}

export function createWeb3Wallet(): Web3Wallet {
  return new Web3Wallet();
}

export type {
  Account,
  Address,
  AssetId,
  BlockchainName,
  ChainId,
  PortfolioSnapshot,
  TokenBalance,
} from "@ned-finance/wallet-core";
