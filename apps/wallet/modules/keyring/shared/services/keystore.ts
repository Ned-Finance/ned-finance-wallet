import { fromB64, toB64 } from "@/modules/shared/crypto/base64";
import { secureStore } from "@/modules/shared/secure-store";
import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import * as Crypto from "expo-crypto";
import type { Address, EncryptedKeyBlob } from "../types";

const MK_KEY = "ned:keyring:mk:v1"; // where we store the master key
const ACC_PREF = "ned:keyring:pk:v1:"; // prefix for per-account blobs

async function randomBytes(len: number): Promise<Uint8Array> {
  const arr = await Crypto.getRandomBytesAsync(len);
  return Uint8Array.from(arr);
}

// Create or recover the 32-byte master key (MK). It's stored *encrypted at rest*
// on native (Keychain/Keystore) and in IndexedDB on web.
async function getOrCreateMasterKey(): Promise<Uint8Array> {
  let mkB64 = await secureStore.getItem(MK_KEY);
  if (!mkB64) {
    const mk = await randomBytes(32); // symmetric key
    mkB64 = toB64(mk);
    await secureStore.setItem(MK_KEY, mkB64);
  }
  return fromB64(mkB64);
}

export async function encryptPrivateKey(
  privateKey: Uint8Array
): Promise<EncryptedKeyBlob> {
  const mk = await getOrCreateMasterKey();
  const nonce = await randomBytes(24); // XChaCha20 needs 24-byte nonce
  const aead = xchacha20poly1305(mk, nonce);
  const box = aead.encrypt(privateKey); // ciphertext + tag
  return {
    alg: "xchacha20poly1305",
    version: 1,
    nonce: toB64(nonce),
    box: toB64(box),
    createdAt: Date.now(),
  };
}

export async function decryptPrivateKey(
  blob: EncryptedKeyBlob
): Promise<Uint8Array> {
  const mk = await getOrCreateMasterKey();
  const nonce = fromB64(blob.nonce);
  const box = fromB64(blob.box);
  const aead = xchacha20poly1305(mk, nonce);
  const out = aead.decrypt(box);
  if (!out) throw new Error("Decryption failed");
  return out;
}

export async function saveEncryptedKey(
  address: Address,
  blob: EncryptedKeyBlob
) {
  await secureStore.setItem(ACC_PREF + address, JSON.stringify(blob));
}

export async function loadEncryptedKey(
  address: Address
): Promise<EncryptedKeyBlob | null> {
  const raw = await secureStore.getItem(ACC_PREF + address);
  return raw ? (JSON.parse(raw) as EncryptedKeyBlob) : null;
}

export async function deleteEncryptedKey(address: Address) {
  await secureStore.deleteItem(ACC_PREF + address);
}
