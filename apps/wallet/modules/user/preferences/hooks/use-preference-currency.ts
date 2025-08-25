import { usePreferencesStore } from "../store/preferences-store";

export function usePreferenceCurrency() {
  const currencyCode = usePreferencesStore((state) => state.currencyCode);

  return currencyCode;
}
