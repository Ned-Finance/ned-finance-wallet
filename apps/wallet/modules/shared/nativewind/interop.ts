import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { cssInterop } from "nativewind";
import { SafeAreaView } from "react-native";

cssInterop(SafeAreaView, {
  className: "style",
});

cssInterop(BottomSheet, {
  className: "style",
});

cssInterop(BottomSheetView, {
  className: "style",
});

cssInterop(BottomSheetModal, {
  className: "style",
});
