// modules/keyring/shared/services/mnemonic-store.ts
import { secureStore } from "@/modules/shared/secure-store";
import type { EncryptedSecretBlob } from "../types";

const MN_PREFIX = "ned:keyring:mnemonic:v1:";

function keyForWallet(walletId: string) {
  // walletId can be a "vaultId" or "keyringId" if multiple accounts share the same seed
  return `${MN_PREFIX}${walletId}`;
}

function isEncryptedSecretBlob(v: any): v is EncryptedSecretBlob {
  return (
    v &&
    v.alg === "xchacha20poly1305" &&
    v.version === 1 &&
    typeof v.nonce === "string" &&
    typeof v.box === "string" &&
    typeof v.createdAt === "number"
  );
}

export async function saveEncryptedMnemonic(
  walletId: string,
  blob: EncryptedSecretBlob
): Promise<void> {
  await secureStore.setItem(keyForWallet(walletId), JSON.stringify(blob));
}

export async function loadEncryptedMnemonic(
  walletId: string
): Promise<EncryptedSecretBlob | null> {
  const raw = await secureStore.getItem(keyForWallet(walletId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isEncryptedSecretBlob(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function deleteEncryptedMnemonic(walletId: string): Promise<void> {
  await secureStore.deleteItem(keyForWallet(walletId));
}
