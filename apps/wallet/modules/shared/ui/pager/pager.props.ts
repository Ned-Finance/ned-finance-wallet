export type PageSizeProps = { height: number; width: number };
export type Page = {
  key: string;
  component: React.ReactNode | ((props: PageSizeProps) => React.ReactNode);
};
export type PagerProps = { pages: Page[]; showIndicator?: boolean };
