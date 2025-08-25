// services/vault-store.ts
import { secureStore } from "@/modules/shared/secure-store";
import type { SeedVault, VaultId } from "../types";

const VAULT_PREFIX = "ned:vault:";

function vaultKey(id: VaultId) {
  return `${VAULT_PREFIX}${id}`;
}

export async function saveSeedVault(vault: SeedVault): Promise<void> {
  await secureStore.setItem(vaultKey(vault.id), JSON.stringify(vault));
}

export async function loadSeedVault(id: VaultId): Promise<SeedVault | null> {
  const raw = await secureStore.getItem(vaultKey(id));
  return raw ? (JSON.parse(raw) as SeedVault) : null;
}

export async function deleteSeedVault(id: VaultId): Promise<void> {
  await secureStore.deleteItem(vaultKey(id));
}
