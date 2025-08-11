import type { Address, ChainId, Signer } from "@wallet/core";

export type AccountRecord = { chainId: ChainId; address: Address };

export interface SignerProvider {
  canHandle(accountId: string): boolean;
  getSigner(accountId: string): Promise<Signer>;
}

export class LocalSignerProvider implements SignerProvider {
  constructor(private accounts: Record<string, AccountRecord>) {}
  canHandle(accountId: string) { return !!this.accounts[accountId]; }
  async getSigner(accountId: string): Promise<Signer> {
    const meta = this.accounts[accountId];
    if (!meta) throw new Error("Account not found");
    return {
      chainId: meta.chainId,
      async getAddress() { return meta.address; },
      async signMessage(msg: Uint8Array) {
        const h = [...msg].reduce((a, b) => (a * 31 + b) % 255, 7);
        return new Uint8Array([h, ...msg.slice(0, 15)]);
      },
      async signTransaction(unsignedTx: Uint8Array) {
        const enc = new TextEncoder();
        const prefix = enc.encode("SIGNED:");
        const out = new Uint8Array(prefix.length + unsignedTx.length);
        out.set(prefix, 0); out.set(unsignedTx, prefix.length);
        return out;
      },
    };
  }
}
