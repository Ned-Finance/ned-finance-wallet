import { Text, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

const MessageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="w-full flex flex-row">
      <View className="flex flex-1 bg-ned-background border-ned-danger border-2 rounded-lg p-4 mx-4">
        {children}
      </View>
    </View>
  );
};

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: BaseToastProps) => (
    <MessageWrapper>
      <Text className="text-ned-primary text-lg">{props.text1}</Text>
      {props.text2 && <Text className="text-ned-muted">{props.text2}</Text>}
    </MessageWrapper>
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: BaseToastProps) => (
    <MessageWrapper>
      <Text className="text-ned-danger text-lg">{props.text1}</Text>
      {props.text2 && <Text className="text-ned-muted">{props.text2}</Text>}
    </MessageWrapper>
  ),
};
