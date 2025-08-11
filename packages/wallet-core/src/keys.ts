import { DerivationRegistry } from "./derivations";
import type { Address, ChainId } from "./types";

// DEMO implementation: replace with real BIP39/SLIP-0010 in production.
export async function deriveAddressFromMnemonic(
  reg: DerivationRegistry,
  _mnemonic: string,
  chainId: ChainId,
  index = 0
) {
  const rule = reg.get(chainId);
  if (!rule) throw new Error(`No derivation rule for ${chainId}`);
  const path = rule.path(index);
  // deterministic mock pubkey derived from chainId + path (for demo)
  const base = `${chainId}:${path}`;
  const bytes = new TextEncoder().encode(base);
  const pub = new Uint8Array(32);
  for (let i = 0; i < 32; i++) pub[i] = bytes[i % bytes.length];
  const address: Address = rule.pubToAddress(pub);
  return { address, derivationPath: path, pubkey: pub };
}
