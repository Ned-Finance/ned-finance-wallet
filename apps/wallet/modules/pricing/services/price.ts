export const fetchTokenPrice = async (tokens: string[]) => {
  return tokens.map((token) => {
    return {
      token,
      price: 0.9,
    };
  });
};
