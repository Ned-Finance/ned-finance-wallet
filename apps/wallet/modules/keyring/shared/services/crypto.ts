import { fromB64, randomBytes, toB64 } from "@/modules/shared/crypto";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { scrypt } from "scrypt-js";
import { ScryptParams, WrappedMK } from "../types";

export const DEFAULT_SCRYPT: ScryptParams = {
  N: 2 ** 14, // ~16k; needs to be adjusted for device performance
  r: 8,
  p: 1,
  dkLen: 32,
};

// ============ KDF (PIN → KEK) ============

/**
 * Derives a Key Encryption Key (KEK) from a user-provided PIN using the scrypt key derivation function.
 *
 * @param pin - The user PIN as a string. This is converted to UTF-8 bytes before KDF.
 * @param salt - A cryptographically random salt (Uint8Array). Should be unique per user/device.
 * @param params - (Optional) Scrypt parameters (N, r, p, dkLen). Defaults to DEFAULT_SCRYPT.
 * @returns A Promise that resolves to the derived KEK as a Uint8Array.
 *
 * @remarks
 * - The PIN is zeroed out in memory after use (best effort).
 * - The returned KEK should be zeroed out after use to minimize the risk of memory disclosure.
 * - The salt and scrypt parameters must be stored to allow future key derivation for decryption.
 */
export async function deriveKEKFromPin(
  pin: string,
  salt: Uint8Array,
  params: ScryptParams = DEFAULT_SCRYPT
): Promise<Uint8Array> {
  const pinBytes = new TextEncoder().encode(pin);
  const out = await scrypt(
    pinBytes,
    salt,
    params.N,
    params.r,
    params.p,
    params.dkLen
  );
  // best-effort wipe of the PIN in memory
  pinBytes.fill(0);
  return out;
}

// ============ XChaCha20-Poly1305 ============

/**
 * Encrypts data using XChaCha20-Poly1305 AEAD.
 *
 * @param key - The 32-byte encryption key.
 * @param nonce - The 24-byte nonce (unique per encryption).
 * @param plaintext - The data to encrypt.
 * @param aad - (Optional) Additional authenticated data (AAD) to include in the authentication tag.
 * @returns The ciphertext, which includes the authentication tag.
 *
 * @remarks
 * - The returned ciphertext includes the Poly1305 authentication tag appended.
 * - The same key/nonce pair must never be reused for different plaintexts.
 * - If AAD is provided, it must also be provided for decryption.
 */
export function xchachaEncrypt(
  key: Uint8Array,
  nonce: Uint8Array,
  plaintext: Uint8Array,
  aad?: Uint8Array
): Uint8Array {
  const aead = xchacha20poly1305(key, nonce, aad);
  // ciphertext includes tag
  return aead.encrypt(plaintext);
}

/**
 * Decrypts data using XChaCha20-Poly1305 AEAD.
 *
 * @param key - The 32-byte decryption key.
 * @param nonce - The 24-byte nonce used during encryption.
 * @param box - The ciphertext to decrypt (includes the Poly1305 authentication tag).
 * @param aad - (Optional) Additional authenticated data (AAD) that was used during encryption.
 * @returns The decrypted plaintext as a Uint8Array.
 *
 * @throws {Error} If decryption fails (e.g., authentication tag does not match).
 *
 * @remarks
 * - The same key/nonce pair must never be reused for different plaintexts.
 * - If AAD was provided during encryption, it must also be provided here.
 */
export function xchachaDecrypt(
  key: Uint8Array,
  nonce: Uint8Array,
  box: Uint8Array,
  aad?: Uint8Array
): Uint8Array {
  const aead = xchacha20poly1305(key, nonce, aad);
  const out = aead.decrypt(box);
  if (!out) throw new Error("Decryption failed");
  return out;
}

/**
 * Encrypts data using XChaCha20-Poly1305 AEAD and returns the result as base64-encoded strings.
 *
 * @param key - The 32-byte encryption key.
 * @param plaintext - The data to encrypt.
 * @param aad - (Optional) Additional authenticated data (AAD) to include in the authentication tag.
 * @returns An object containing:
 *   - nonce: The randomly generated 24-byte nonce, base64-encoded.
 *   - box: The ciphertext (including the Poly1305 authentication tag), base64-encoded.
 *
 * @remarks
 * - The returned object is suitable for storage or transport as all fields are base64-encoded.
 * - The same key/nonce pair must never be reused for different plaintexts.
 * - If AAD is provided, it must also be provided for decryption.
 */
export function xchachaEncryptB64(
  key: Uint8Array,
  plaintext: Uint8Array,
  aad?: Uint8Array
): { nonce: string; box: string } {
  const nonce = randomBytes(24);
  const box = xchachaEncrypt(key, nonce, plaintext, aad);
  return { nonce: toB64(nonce), box: toB64(box) };
}

/**
 * Decrypts data that was encrypted with XChaCha20-Poly1305 AEAD and encoded as base64 strings.
 *
 * @param key - The 32-byte decryption key.
 * @param blob - An object containing:
 *   - nonce: The base64-encoded 24-byte nonce used during encryption.
 *   - box: The base64-encoded ciphertext (including the Poly1305 authentication tag).
 * @param aad - (Optional) Additional authenticated data (AAD) that was used during encryption.
 * @returns The decrypted plaintext as a Uint8Array.
 *
 * @throws {Error} If decryption fails (e.g., authentication tag does not match).
 *
 * @remarks
 * - The same key/nonce pair must never be reused for different plaintexts.
 * - If AAD was provided during encryption, it must also be provided here.
 * - This function is intended for use with data produced by {@link xchachaEncryptB64}.
 */
export function xchachaDecryptB64(
  key: Uint8Array,
  blob: { nonce: string; box: string },
  aad?: Uint8Array
): Uint8Array {
  const nonce = fromB64(blob.nonce);
  const box = fromB64(blob.box);
  return xchachaDecrypt(key, nonce, box, aad);
}

// ============ Wrap / Unwrap de Master Key (MK) con PIN ============

/**
 * Wraps (encrypts) a master key (MK) using a user-provided PIN and scrypt key derivation.
 *
 * @param mk - The master key to encrypt (32 bytes).
 * @param pin - The user PIN to derive the KEK.
 * @param params - (Optional) Scrypt parameters for key derivation. Defaults to DEFAULT_SCRYPT.
 * @returns A Promise that resolves to a WrappedMK object containing the encrypted MK, salt, scrypt params, and metadata.
 *
 * @remarks
 * - The salt is randomly generated for each invocation to ensure unique KEK derivation.
 * - The KEK is zeroed out in memory after use (best effort).
 * - The returned object includes all necessary data to later decrypt the MK with the correct PIN.
 */
export async function wrapMKWithPin(
  mk: Uint8Array,
  pin: string,
  params: ScryptParams = DEFAULT_SCRYPT
): Promise<WrappedMK> {
  const salt = await randomBytes(16);
  const kek = await deriveKEKFromPin(pin, salt, params);
  const { nonce, box } = xchachaEncryptB64(kek, mk);

  // best-effort wipe
  kek.fill(0);

  return {
    alg: "xchacha20poly1305",
    version: 1,
    nonce,
    box,
    salt: toB64(salt),
    params,
    createdAt: Date.now(),
  };
}

/**
 * Unwraps (decrypts) a master key (MK) using a user-provided PIN and scrypt key derivation.
 *
 * @param wrapped - The WrappedMK object containing the encrypted MK, salt, scrypt params, and metadata.
 * @param pin - The user PIN to derive the KEK.
 * @returns A Promise that resolves to the original master key (32 bytes).
 *
 * @remarks
 * - The KEK is zeroed out in memory after use (best effort).
 * - The returned master key is zeroed out in memory after use (best effort).
 */
export async function unwrapMKWithPin(
  wrapped: WrappedMK,
  pin: string
): Promise<Uint8Array> {
  const salt = fromB64(wrapped.salt);
  const kek = await deriveKEKFromPin(pin, salt, wrapped.params);
  try {
    const mk = xchachaDecryptB64(kek, {
      nonce: wrapped.nonce,
      box: wrapped.box,
    });
    return mk;
  } finally {
    kek.fill(0);
  }
}
