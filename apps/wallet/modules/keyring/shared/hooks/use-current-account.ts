// modules/keyring/shared/hooks/use-accounts.ts
import { useKeyringStore } from "../store/keyring.store";

export const useAccounts = () => useKeyringStore((s) => s.accounts);

export const useCurrentAccount = () => {
  const accounts = useKeyringStore((s) => s.accounts);
  const currentAccountAddress = useKeyringStore((s) => s.currentAccountAddress);
  return accounts.find((a) => a.address === currentAccountAddress) ?? null;
};
