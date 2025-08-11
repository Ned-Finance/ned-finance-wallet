import { useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../icons/icon.nativewind";

type ScreenWrapperProps = {
  children: React.ReactNode;
  showBack?: boolean;
  onBackPress?: () => void;
  title?: string;
};

export const ScreenWrapper = ({
  children,
  showBack = false,
  title,
  onBackPress,
}: ScreenWrapperProps) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 p-4">
      {showBack && (
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="p-2 -ml-5"
            onPress={onBackPress || navigation.goBack}>
            <Icon
              name="ChevronLeft"
              className="text-white w-10 h-10 mt-1"
            />
          </TouchableOpacity>
        </View>
      )}
      {title && (
        <View className="flex-row items-center">
          <Text className="text-white text-4xl">{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
};
