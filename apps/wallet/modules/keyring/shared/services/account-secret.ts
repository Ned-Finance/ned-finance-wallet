// modules/keyring/shared/crypto/account-secret.ts

import { fromB64, randomBytes, toB64 } from "@/modules/shared/crypto";
import type { EncryptedKeyBlob } from "../types";
import { xchachaDecrypt, xchachaEncrypt } from "./crypto";

/**
 * Encrypt a private key with MK.
 */
export async function encryptPrivateKeyWithMK(
  mk: Uint8Array,
  privateKey: Uint8Array,
  aad?: Uint8Array
): Promise<EncryptedKeyBlob> {
  const nonce = await randomBytes(24);
  const box = xchachaEncrypt(mk, nonce, privateKey, aad);
  return {
    alg: "xchacha20poly1305",
    version: 1,
    nonce: toB64(nonce),
    box: toB64(box),
    createdAt: Date.now(),
  };
}

/**
 * Decrypt a private key with MK.
 */
export function decryptPrivateKeyWithMK(
  mk: Uint8Array,
  blob: EncryptedKeyBlob,
  aad?: Uint8Array
): Uint8Array {
  const nonce = fromB64(blob.nonce);
  const box = fromB64(blob.box);
  return xchachaDecrypt(mk, nonce, box, aad);
}
