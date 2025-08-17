// modules/keyring/shared/hooks/use-set-accounts.ts
import { useKeyringStore } from "../store/keyring.store";

export const useSetAccounts = () => {
  const setAccounts = useKeyringStore((s) => s.setAccounts);
  const addAccount = useKeyringStore((s) => s.addAccount);
  const removeAccount = useKeyringStore((s) => s.removeAccount);
  const setCurrentAccount = useKeyringStore((s) => s.setCurrentAccount);

  return { setAccounts, addAccount, removeAccount, setCurrentAccount };
};
