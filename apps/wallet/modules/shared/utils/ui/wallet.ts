import { Decimal } from "decimal.js";

export const getWalletAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const formatAmount = (amount: bigint, decimals: number) => {
  const valueInDecimals = Decimal(amount.toString()).div(10 ** decimals);
  if (valueInDecimals.decimalPlaces() > 9) {
    return valueInDecimals.toFixed(4);
  } else {
    return valueInDecimals.toFixed(2);
  }
};
