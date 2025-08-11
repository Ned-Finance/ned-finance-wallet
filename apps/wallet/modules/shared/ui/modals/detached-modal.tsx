import { useTheme } from "@/modules/user/preferences/providers/theme-provider";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

export type DetachedModalMethods = {
  present: (index?: number) => void;
  close: () => void;
};

export type DetachedModalProps = {
  children: React.ReactNode;
  ref: React.RefObject<DetachedModalMethods | null>;
  enablePanDownToClose?: boolean;
  enableDismissOnClose?: boolean;
};

export const DetachedModal = ({
  children,
  ref,
  enablePanDownToClose,
  enableDismissOnClose,
}: DetachedModalProps) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { themeVars } = useTheme();

  const nedBackground = useMemo(
    () =>
      `rgb(${themeVars["--ned-background-secondary"].split(" ").join(",")})`,
    [themeVars]
  );

  const nedMuted = useMemo(
    () => `rgb(${themeVars["--ned-muted"].split(" ").join(",")})`,
    [themeVars]
  );

  // variables
  const snapPoints = useMemo(() => ["35%"], []);

  useImperativeHandle(
    ref,
    () => ({
      present: (index?: number) => {
        bottomSheetModalRef.current?.present(index);
      },
      close: () => {
        bottomSheetModalRef.current?.close();
      },
    }),
    []
  );

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="none"
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  // renders
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      index={0}
      detached={true}
      bottomInset={25}
      enableDismissOnClose={enableDismissOnClose}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={enablePanDownToClose}
      showHandle={enablePanDownToClose}
      backgroundStyle={{
        backgroundColor: nedBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: nedMuted,
      }}
      className="mx-8">
      <BottomSheetView className="p-4 text-ned-muted flex flex-1 h-full w-full">
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
