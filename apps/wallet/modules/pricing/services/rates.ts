export const fetchFiatRates = async (currencyCode: string = "USD") => {
  return Promise.resolve({
    EUR: 0.9,
    PEN: 3.3,
  });
};
