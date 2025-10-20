import { WalletBanner } from "../types/banner";

export const fetchBanners = async (): Promise<WalletBanner[]> => {
  // TODO: fetch from api, return should be an array of banners
  return Promise.resolve([
    {
      imageUrl: "https://picsum.photos/seed/696/3000/2000",
      link: "https://www.google.com",
      type: "fullImage",
    },
    {
      title: "Welcome to the wallet",
      description: "This is a welcome banner",
      imageUrl: "https://picsum.photos/seed/696/3000/2000",
      link: "https://www.google.com",
      type: "textOnly",
    },
    {
      title: "Welcome to the wallet",
      description: "This is a welcome banner",
      imageUrl: "https://picsum.photos/seed/696/3000/2000",
      link: "https://www.google.com",
      type: "imageAndText",
    },
  ]);
};
