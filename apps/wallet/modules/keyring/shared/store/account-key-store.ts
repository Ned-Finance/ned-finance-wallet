import { secureStore } from "@/modules/shared/secure-store";
import type { EncryptedKeyBlob } from "../types";

const ACC_PREFIX = "ned:keyring:pk:v1:";

function storageKey(address: string) {
  return `${ACC_PREFIX}${address}`;
}

function isEncryptedKeyBlob(v: any): v is EncryptedKeyBlob {
  return (
    v &&
    v.alg === "xchacha20poly1305" &&
    v.version === 1 &&
    typeof v.nonce === "string" &&
    typeof v.box === "string" &&
    typeof v.createdAt === "number"
  );
}

/**
 * Saves the encrypted key blob for an address.
 */
export async function saveEncryptedKey(
  address: string,
  blob: EncryptedKeyBlob
): Promise<void> {
  const key = storageKey(address);
  await secureStore.setItem(key, JSON.stringify(blob));
}

/**
 * Reads the encrypted key blob for an address.
 */
export async function loadEncryptedKey(
  address: string
): Promise<EncryptedKeyBlob | null> {
  const key = storageKey(address);
  const raw = await secureStore.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return isEncryptedKeyBlob(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Deletes the encrypted key blob for an address.
 */
export async function deleteEncryptedKey(address: string): Promise<void> {
  const key = storageKey(address);
  await secureStore.deleteItem(key);
}
