import { CryptoPrices } from "../types/price";

export const fetchTokenPrice = async (
  tokens: string[],
  nativeTokenSymbol?: string
): Promise<CryptoPrices> => {
  // TODO: fetch from api, return should be a map of token symbol to price
  // TODO: use multiple endpoints to add also dex prices for tokens that are not listed on coingecko for example

  const prices = tokens.reduce((acc, token) => {
    acc[token] = 0.9;
    return acc;
  }, {} as CryptoPrices);

  return prices;
};
