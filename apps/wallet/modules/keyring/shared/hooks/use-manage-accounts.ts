import { useKeyringStore } from "../store/keyring.store";
import type { Address, PublicAccount } from "../types";

export function useManageAccounts() {
  const add = useKeyringStore((s) => s.addAccountWithPrivateKey);
  const remove = useKeyringStore((s) => s.removeAccount);
  const setCurrent = useKeyringStore((s) => s.setCurrentAccount);
  const getPK = useKeyringStore((s) => s.getDecryptedPrivateKey);

  return {
    addAccountWithPrivateKey: (a: PublicAccount, pk: Uint8Array) => add(a, pk),
    removeAccount: (address: Address) => remove(address),
    setCurrentAccount: (address: Address) => setCurrent(address),
    getDecryptedPrivateKey: (address: Address) => getPK(address),
  };
}
