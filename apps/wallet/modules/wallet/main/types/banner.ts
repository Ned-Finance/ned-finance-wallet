export type BannerType = "fullImage" | "imageAndText" | "textOnly";

export type WalletBanner = {
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  type: BannerType;
};
