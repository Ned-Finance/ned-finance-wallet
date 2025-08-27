import { FC, useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { Icon } from "../icons";
import {
  KeyBoardButtonProps,
  SectionButtonsProps,
} from "./numeric-keyboard.props";
import { PinDots } from "./pin-dots";

const EmptyButton = () => {
  return (
    <View
      key={"empty"}
      className="py-4 my-1 mx-5 rounded flex-1 items-center"></View>
  );
};

const BiometricButton = ({ onBiometric }: { onBiometric: () => void }) => {
  return (
    <Pressable
      className="py-4 my-1 mx-5 rounded flex-1 items-center w-1/3"
      onPress={() => onBiometric()}>
      {Platform.OS === "ios" ? (
        <Icon
          name="ScanFace"
          strokeWidth={1}
          className="text-white w-10 h-10 mt-1"
        />
      ) : (
        <Icon
          name="Fingerprint"
          strokeWidth={1}
          className="text-white w-10 h-10 mt-1"
        />
      )}
    </Pressable>
  );
};

const DeleteBackspaceButton = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <Pressable
      className="py-4 my-1 mx-5 rounded flex-1 items-center w-1/3"
      onPress={() => onDelete()}>
      <Icon
        name="Delete"
        strokeWidth={1.5}
        className="text-white w-10 h-10 mt-1"
      />
    </Pressable>
  );
};

const NumericButton = ({
  value,
  onPress,
}: {
  value: number;
  onPress: (value: string) => void;
}) => {
  return (
    <Pressable
      key={value}
      className="w-1/3 py-8 my-1 rounded items-center"
      onPress={() => onPress(value.toString())}>
      <Text className="text-white text-3xl">{value}</Text>
    </Pressable>
  );
};

const SectionButtons: FC<SectionButtonsProps> = ({
  onDigit,
  onBiometric,
  onDelete,
  data,
  showBiometric = false,
}) => {
  return (
    <View className="flex-row flex-wrap justify-center">
      {data.map((val: number) => {
        if (val >= 0) {
          return (
            <NumericButton
              key={val}
              value={val}
              onPress={onDigit}
            />
          );
        } else {
          switch (val) {
            case -1:
              if (showBiometric) {
                return (
                  <BiometricButton
                    key={val}
                    onBiometric={onBiometric}
                  />
                );
              } else {
                return <EmptyButton key={val} />;
              }
            case -2:
              return (
                <DeleteBackspaceButton
                  key={val}
                  onDelete={onDelete}
                />
              );
          }
        }
      })}
    </View>
  );
};

export const CustomKeyboard: FC<KeyBoardButtonProps> = ({
  onChange,
  onBiometric,
  showBiometric = false,
}) => {
  const [pin, setPin] = useState("");

  const handlePinChange = (value: string) => {
    setPin((prev) => prev + value);
  };
  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (onChange) {
      onChange(pin);
    }
  }, [pin, onChange]);

  return (
    <View className="flex flex-1 w-full">
      <PinDots
        repeat={4}
        code={pin}
      />
      <SectionButtons
        showBiometric={showBiometric}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, -2]}
        onBiometric={onBiometric}
        onDelete={handleDelete}
        onDigit={handlePinChange}
      />
    </View>
  );
};
