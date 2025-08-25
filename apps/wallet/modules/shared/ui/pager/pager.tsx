import React, { useCallback, useRef, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Dot } from "./dot";
import { Page, PagerProps } from "./pager.props";

export const Pager = ({ pages, showIndicator = true }: PagerProps) => {
  const { width } = useWindowDimensions();

  const x = useSharedValue(0);
  const listRef = useRef<FlatList<Page>>(null);

  const [height, setHeight] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      x.value = e.contentOffset.x;
    },
  });

  // Lazy render: solo monta si está cerca del viewport
  const renderItem = useCallback(
    ({ item, index }: { item: Page; index: number }) => {
      return (
        <View
          className="flex-1"
          style={{ width, height }}>
          {/*
          Monta si la página está a ±1 del índice visible
          (FlatList ya virtualiza, esto es “extra perezoso” si tu contenido es pesado)
        */}
          <MaybeMount
            index={index}
            x={x}>
            {typeof item.component === "function"
              ? item.component({ height, width })
              : item.component}
          </MaybeMount>
        </View>
      );
    },
    [x, width, height]
  );

  return (
    <View
      className="flex-1"
      onLayout={(event) => {
        setHeight(event.nativeEvent.layout.height);
      }}>
      <Animated.FlatList
        ref={listRef}
        data={pages}
        keyExtractor={(i) => i.key}
        renderItem={renderItem}
        horizontal
        decelerationRate="fast"
        pagingEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialNumToRender={1}
        windowSize={3}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
      />

      {/* Indicador simple */}
      {showIndicator && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 8,
          }}>
          {pages.map((_, i) => {
            return (
              <Dot
                key={i}
                index={i}
                x={x}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

function MaybeMount({
  index,
  x,
  children,
}: {
  index: number;
  x: SharedValue<number>;
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const style = useAnimatedStyle(() => {
    const current = x.value / width;
    const visible = Math.abs(current - index) <= 1 ? 1 : 0;
    return { opacity: visible ? 1 : 0 };
  });
  // Podrías condicionar el render si quieres extremo ahorro:
  // if (Math.abs(x.value/width - index) > 1) return null;
  return (
    <Animated.View style={{ ...style, flex: 1 }}>{children}</Animated.View>
  );
}
