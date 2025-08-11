import {
  DerivationRegistry, deriveAddressFromMnemonic,
  ChainId, Address, AssetId, PortfolioSnapshot, TokenBalance, ChainConnector
} from "@wallet/core";
import type { WalletOrchestrator, ChainSummary } from "./types";
import { CONNECTOR_LOADERS } from "./plugins";
import { LocalSignerProvider, AccountRecord } from "./signers";

export class DefaultWalletOrchestrator implements WalletOrchestrator {
  private reg = new DerivationRegistry();
  private connectors = new Map<string, ChainConnector>();
  private accounts: Record<string, AccountRecord> = {};
  private signer = new LocalSignerProvider(this.accounts);

  async listChains(): Promise<ChainSummary[]> {
    const keys = Object.keys(CONNECTOR_LOADERS) as ChainId[];
    const metas = await Promise.all(keys.map(k => CONNECTOR_LOADERS[k]()));
    return metas.map(m => ({
      chainId: m.chainId,
      displayName: m.displayName,
      capabilities: this.connectors.get(m.chainId)?.capabilities ?? {},
    }));
  }

  private async ensureLoaded(chainId: ChainId) {
    if (this.connectors.has(chainId)) return;
    const loader = CONNECTOR_LOADERS[chainId];
    if (!loader) throw new Error(`Unsupported chain: ${chainId}`);
    const mod = await loader();
    this.reg.add(mod.chainId, mod.derivation);
    const conn: ChainConnector = mod.create();
    if (conn.chainId !== mod.chainId) throw new Error("Connector chainId mismatch");
    this.connectors.set(chainId, conn);
  }

  async deriveFromMnemonic(mnemonic: string, selections: ChainId[], index = 0) {
    await Promise.all(selections.map(c => this.ensureLoaded(c)));
    const entries = await Promise.all(
      selections.map(async chainId => {
        const r = await deriveAddressFromMnemonic(this.reg, mnemonic, chainId, index);
        const accountId = `${chainId}:${index}`;
        this.accounts[accountId] = { chainId, address: r.address };
        return [chainId, { address: r.address, derivationPath: r.derivationPath }] as const;
      })
    );
    return Object.fromEntries(entries) as Record<ChainId, { address: Address; derivationPath: string }>;
  }

  async getSnapshot(chainId: ChainId, address: Address): Promise<PortfolioSnapshot> {
    await this.ensureLoaded(chainId);
    const c = this.connectors.get(chainId)!;
    return c.getSnapshot({ address, include: { tokens: true, nfts: true } });
  }

  async getTokens(chainId: ChainId, p: { address: Address; cursor?: string; limit?: number; updatedAfter?: number }) {
    await this.ensureLoaded(chainId);
    const c: any = this.connectors.get(chainId)!;
    if (!c.getTokens) throw new Error("getTokens not supported");
    return c.getTokens(p);
  }

  async buildTransfer(chainId: ChainId, p: { from: Address; to: Address; assetId: AssetId; amount: bigint; memo?: string }) {
    await this.ensureLoaded(chainId);
    const c = this.connectors.get(chainId)!;
    return c.buildTransfer(p);
  }

  async estimateFees(chainId: ChainId, p: { unsignedTx: Uint8Array; priority?: "low" | "medium" | "high" }) {
    await this.ensureLoaded(chainId);
    const c = this.connectors.get(chainId)!;
    return c.estimateFees(p);
  }

  async signTransaction(accountId: string, unsignedTx: Uint8Array) {
    const signer = await this.signer.getSigner(accountId);
    const signedTx = await signer.signTransaction(unsignedTx);
    return { signedTx };
  }

  async sendTransaction(chainId: ChainId, signedTx: Uint8Array) {
    await this.ensureLoaded(chainId);
    const c = this.connectors.get(chainId)!;
    return c.sendTransaction({ signedTx });
  }

  async signMessage(accountId: string, message: Uint8Array | string) {
    const signer = await this.signer.getSigner(accountId);
    const bytes = typeof message === "string" ? new TextEncoder().encode(message) : message;
    return signer.signMessage(bytes);
  }

  async submitTransfer(p: {
    chainId: ChainId; fromAccountId: string; from: Address; to: Address; assetId: AssetId; amount: bigint; memo?: string; priority?: "low"|"medium"|"high";
  }) {
    const { unsignedTx } = await this.buildTransfer(p.chainId, { from: p.from, to: p.to, assetId: p.assetId, amount: p.amount, memo: p.memo });
    const { signedTx } = await self.signTransaction(p.fromAccountId, unsignedTx);
    return this.sendTransaction(p.chainId, signedTx);
  }
}
