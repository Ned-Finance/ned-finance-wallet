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
  dismiss: () => void;
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

  useImperativeHandle(
    ref,
    () => ({
      present: (index?: number) => {
        bottomSheetModalRef.current?.present(index);
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
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
      detached={true}
      bottomInset={25}
      enableDismissOnClose={enableDismissOnClose}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={enablePanDownToClose}
      showHandle={enablePanDownToClose}
      backgroundStyle={{
        backgroundColor: nedBackground,
        flex: 1,
      }}
      handleIndicatorStyle={{
        backgroundColor: nedMuted,
      }}
      style={{
        marginHorizontal: 32,
      }}>
      <BottomSheetView
        style={{
          padding: 4,
          flex: 1,
          minHeight: 200,
          height: "100%",
          width: "100%",
        }}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
