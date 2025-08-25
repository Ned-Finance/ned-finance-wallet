// modules/keyring/shared/crypto/mnemonic-secret.ts
import { fromB64, randomBytes, toB64 } from "@/modules/shared/crypto";
import type { EncryptedSecretBlob } from "../types";
import { xchachaDecrypt, xchachaEncrypt } from "./crypto";

/**
 * Cipher the mnemonic with the Master Key (MK).
 * @param mk - 32 bytes (already unlocked)
 * @param mnemonic - string BIP39
 * @param aad - optional, for example new TextEncoder().encode("mnemonic:v1")
 */
export async function encryptMnemonicWithMK(
  mk: Uint8Array,
  mnemonic: string,
  aad?: Uint8Array
): Promise<EncryptedSecretBlob> {
  const enc = new TextEncoder();
  const mnemonicBytes = enc.encode(mnemonic);
  const nonce = await randomBytes(24);
  const box = xchachaEncrypt(mk, nonce, mnemonicBytes, aad);

  // best-effort wipe de los bytes
  mnemonicBytes.fill(0);

  return {
    alg: "xchacha20poly1305",
    version: 1,
    nonce: toB64(nonce),
    box: toB64(box),
    createdAt: Date.now(),
  };
}

/**
 * Decrypts the mnemonic with the MK (returns string).
 */
export function decryptMnemonicWithMK(
  mk: Uint8Array,
  blob: EncryptedSecretBlob,
  aad?: Uint8Array
): string {
  const nonce = fromB64(blob.nonce);
  const box = fromB64(blob.box);
  const out = xchachaDecrypt(mk, nonce, box, aad);
  // Convert to string as soon as possible
  const dec = new TextDecoder();
  const phrase = dec.decode(out);
  // best-effort wipe of the buffer
  out.fill(0);
  return phrase;
}
