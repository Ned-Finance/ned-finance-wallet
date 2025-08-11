export type KeyBoardButtonProps = {
  onChange: (digit: string) => void;
  onBiometric: () => void;
  showBiometric?: boolean;
};

export type SectionButtonsProps = Omit<KeyBoardButtonProps, "onChange"> & {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  data: number[];
};
