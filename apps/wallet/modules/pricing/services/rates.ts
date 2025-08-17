import { FiatRates } from "../types/rate";

export const fetchFiatRates = async (): Promise<FiatRates> => {
  return Promise.resolve({
    USD: 1,
    EUR: 0.9,
    PEN: 3.3,
  });
};
