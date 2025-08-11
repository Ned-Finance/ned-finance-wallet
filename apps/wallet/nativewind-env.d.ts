/// <reference types="nativewind/types" />

import "@gorhom/bottom-sheet";
import { ComponentProps } from "react";

declare module "@gorhom/bottom-sheet" {
  interface BottomSheetModalProps extends ComponentProps<any> {
    className?: string;
  }

  interface BottomSheetViewProps extends ComponentProps<any> {
    className?: string;
  }

  interface BottomSheetProps extends ComponentProps<any> {
    className?: string;
  }
}
