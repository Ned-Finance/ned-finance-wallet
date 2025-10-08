import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

type BottomTabDescriptorMap = BottomTabBarProps["descriptors"];
type BottomTabDescriptor = BottomTabDescriptorMap;

const TabBarItem = (descriptor: BottomTabBarProps["descriptors"]) => {
  return <View></View>;
};

export const TabBar = (descriptor: BottomTabBarProps) => {
  // console.log(props);

  return (
    <View>
      {/* {props.state.routes.map((route) => (
        <TabBarItem descriptor={props.descriptors[route.key]} />
      ))} */}
    </View>
  );
};
