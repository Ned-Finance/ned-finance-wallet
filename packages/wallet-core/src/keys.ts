import { SLIP10Node } from "@metamask/key-tree";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha2";
import * as bip32 from "@scure/bip32";
import * as bip39 from "@scure/bip39";
// import "./crypto-setup";
import { DerivationRegistry } from "./derivations";
import type { Account, ChainId } from "./types";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

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
    const node = await SLIP10Node.fromDerivationPath({
      curve: "ed25519",
      derivationPath: [
        `bip39:${mnemonic}`,
        `slip10:44'`,
        `slip10:501'`,
        `slip10:0'`,
        `slip10:0'`,
      ],
    });

    const privateKey = node.privateKeyBytes;

    return {
      chainId,
      privateKey: privateKey!,
      publicKey: ed.getPublicKey(privateKey!),
      address: rule.pubToAddress(ed.getPublicKey(privateKey!)),
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
