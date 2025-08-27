import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useImperativeHandle, useRef } from "react";

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

  useImperativeHandle(
    ref,
    () => ({
      present: (index?: number) => {
        bottomSheetModalRef.current?.present(index);
        bottomSheetModalRef.current?.snapToIndex(index ?? 0);
      },
      dismiss: () => {
        bottomSheetModalRef.current?.close();
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
      bottomInset={80}
      enableDismissOnClose={enableDismissOnClose}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={enablePanDownToClose}
      showHandle={enablePanDownToClose}
      backgroundClassName="bg-ned-background-secondary flex-1"
      handleIndicatorClassName="bg-ned-muted"
      className="mx-8">
      <BottomSheetView
        className="flex-1 min-h-60 h-full w-full"
        // style={{
        // padding: 4,
        //   flex: 1,
        //   minHeight: 200,
        //   height: "100%",
        //   width: "100%",
        // }}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
