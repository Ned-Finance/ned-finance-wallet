import * as bip32 from "@scure/bip32";
import * as bip39 from "@scure/bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { DerivationRegistry } from "./derivations";
import type { ChainId } from "./types";

// DEMO implementation: replace with real BIP39/SLIP-0010 in production.
export async function deriveAddressFromMnemonic(
  reg: DerivationRegistry,
  mnemonic: string,
  chainId: ChainId,
  index = 0
) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const rule = reg.get(chainId);
  if (!rule) throw new Error(`No derivation rule for ${chainId}`);
  if (rule.curve === "ed25519") {
    const hd = HDKey.fromMasterSeed(seed);
    const child = hd.derive(rule.path(index));
    return {
      privateKey: child.privateKey,
      publicKey: child.publicKey,
      address: rule.pubToAddress(child.publicKey),
    };
  }
  if (rule.curve === "secp256k1") {
    const node = bip32.HDKey.fromMasterSeed(seed);
    const child = node.derive(rule.path(index));
    if (!child.privateKey) throw new Error("No private key");
    return {
      privateKey: child.privateKey,
      publicKey: child.publicKey,
      address: rule.pubToAddress(child.publicKey!),
    };
  }
  throw new Error(`Unsupported curve: ${rule.curve}`);
}
