import {
  Address,
  AssetId,
  ChainConnector,
  ChainId,
  DerivationRegistry,
  deriveAddressFromMnemonic,
  PortfolioSnapshot,
} from "@ned-finance/wallet-core";
import { AccountRecord, LocalSignerProvider } from "./signers";
import type { Account, ChainSummary, Wallet } from "./types";

// Interface for connectors with metadata
interface ConnectorWithMetadata {
  connector: ChainConnector;
  derivation: {
    curve: "secp256k1" | "ed25519";
    path: (i: number) => string;
    pubToAddress: (pub: Uint8Array) => string;
  };
  displayName: string;
}

export class DefaultWallet implements Wallet {
  private reg = new DerivationRegistry();
  private connectors: Map<ChainId, ConnectorWithMetadata> = new Map();
  private accounts: Record<string, AccountRecord> = {};
  private signer = new LocalSignerProvider(this.accounts);
  private lazyLoadingEnabled: boolean = false;

  constructor(
    connectors?: ConnectorWithMetadata[],
    enableLazyLoading: boolean = false
  ) {
    if (connectors) {
      // Static mode - initialize passed connectors
      this.initializeConnectors(connectors);
    } else if (enableLazyLoading) {
      // Lazy loading mode - load connectors when needed
      this.lazyLoadingEnabled = true;
    }
  }

  private initializeConnectors(connectors: ConnectorWithMetadata[]) {
    connectors.forEach(({ connector, derivation, displayName }) => {
      this.connectors.set(connector.chainId, {
        connector,
        derivation,
        displayName,
      });
      this.reg.add(connector.chainId, derivation);
    });
  }

  private async ensureLoaded(chainId: ChainId) {
    if (this.connectors.has(chainId)) return;

    if (!this.lazyLoadingEnabled) {
      throw new Error(
        `Chain not supported: ${chainId}. Enable lazy loading or pass connectors in constructor.`
      );
    }

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
    if (this.lazyLoadingEnabled) {
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
    } else {
      // Static mode - only already loaded chains
      return Array.from(this.connectors.values()).map(
        ({ connector, displayName }) => ({
          chainId: connector.chainId,
          displayName: displayName || connector.chainId,
          capabilities: connector.capabilities,
        })
      );
    }
  }

  async deriveFromMnemonic(mnemonic: string, selections: ChainId[], index = 0) {
    // Load chains if necessary
    if (this.lazyLoadingEnabled) {
      await Promise.all(selections.map((c) => this.ensureLoaded(c)));
    } else {
      // Validate that selections are available in static mode
      const unavailable = selections.filter((id) => !this.connectors.has(id));
      if (unavailable.length > 0) {
        throw new Error(`Unsupported chains: ${unavailable.join(", ")}`);
      }
    }

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
      assetId: AssetId;
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
    assetId: AssetId;
    amount: bigint;
    memo?: string;
    priority?: "low" | "medium" | "high";
  }) {
    const { unsignedTx } = await this.buildTransfer(p.chainId, {
      from: p.from,
      to: p.to,
      assetId: p.assetId,
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

// Helper function to create wallet with all connectors pre-loaded (static mode)
export async function createWalletWithLoaders(): Promise<DefaultWallet> {
  const { CONNECTOR_LOADERS } = await import("./plugins");

  const connectors: ConnectorWithMetadata[] = [];

  for (const [chainId, loader] of Object.entries(CONNECTOR_LOADERS)) {
    const metadata = await loader();
    const connector = metadata.create();

    connectors.push({
      connector,
      derivation: metadata.derivation,
      displayName: metadata.displayName,
    });
  }

  return new DefaultWallet(connectors, false); // false = static mode
}

// Helper function to create wallet with lazy loading enabled
export function createWalletWithLazyLoading(): DefaultWallet {
  return new DefaultWallet(undefined, true); // true = lazy loading
}
