export type TabLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TabElement = {
  text: string;
};

export type TabsProps<T extends TabElement> = {
  elements: T[];
  onIndexChange?: (index: number) => void;
};
