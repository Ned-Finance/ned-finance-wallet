// modules/keyring/shared/hooks/use-accounts.ts
import { useKeyringStore } from "../store/keyring.store";

export const useMasterKey = () => {
  const mk = useKeyringStore((s) => s.mk);
  const setMK = useKeyringStore((s) => s.setMasterKey);

  return { mk, setMK };
};
