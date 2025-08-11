import type { ChainId, Address } from "./types";

export type DerivationRule = {
  curve: "secp256k1" | "ed25519";
  path: (i: number) => string;
  pubToAddress: (pub: Uint8Array) => Address;
};

export class DerivationRegistry {
  private map = new Map<ChainId, DerivationRule>();
  add(chainId: ChainId, rule: DerivationRule) { this.map.set(chainId, rule); }
  get(chainId: ChainId) { return this.map.get(chainId); }
  list(): ChainId[] { return [...this.map.keys()]; }
}
