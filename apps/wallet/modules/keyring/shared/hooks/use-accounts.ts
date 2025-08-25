// modules/keyring/shared/hooks/use-accounts.ts
import { useKeyringStore } from "../store/keyring.store";

export const useAccounts = () => useKeyringStore((s) => s.accounts);
