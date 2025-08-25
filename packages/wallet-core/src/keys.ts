import * as ed25519 from "@noble/ed25519";
import * as bip32 from "@scure/bip32";
import * as bip39 from "@scure/bip39";
import { derivePath } from "ed25519-hd-key";
import { DerivationRegistry } from "./derivations";
import type { Account, ChainId } from "./types";

// DEMO implementation: replace with real BIP39/SLIP-0010 in production.
export async function deriveAddressFromMnemonic(
  reg: DerivationRegistry,
  mnemonic: string,
  chainId: ChainId,
  index = 0
): Promise<Account> {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const rule = reg.get(chainId);
  if (!rule) throw new Error(`No derivation rule for ${chainId}`);
  if (rule.curve === "ed25519") {
    const seedHex = Buffer.from(seed).toString("hex");
    const { key: privateKey } = derivePath(rule.path(index), seedHex);
    const publicKey = await ed25519.getPublicKey(privateKey);
    return {
      chainId,
      privateKey,
      publicKey,
      address: rule.pubToAddress(publicKey),
    };
  }
  if (rule.curve === "secp256k1") {
    const node = bip32.HDKey.fromMasterSeed(seed);
    const child = node.derive(rule.path(index));
    if (!child.privateKey) throw new Error("No private key");
    if (!child.publicKey) throw new Error("No public key");
    return {
      chainId,
      privateKey: child.privateKey,
      publicKey: child.publicKey,
      address: rule.pubToAddress(child.publicKey),
    };
  }
  throw new Error(`Unsupported curve: ${rule.curve}`);
}
