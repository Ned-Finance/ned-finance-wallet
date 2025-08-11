import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ProgressViewItem } from "./progress-view-item";

type ProgressViewProps = {
  images: number[] | string[];
  enableProgress: boolean;
  duration: number;
  progressIndex: number;
  onChange: (index: number) => void;
};

export const ProgressView = (props: ProgressViewProps) => {
  const [progressIndex, setProgressIndex] = useState(0);

  const { enableProgress, images, duration, onChange } = props;

  useEffect(() => {
    setProgressIndex(props.progressIndex);
  }, [props.progressIndex]);

  useEffect(() => {
    setProgressIndex(progressIndex);
  }, [progressIndex, enableProgress]);

  function changePosition() {
    if (enableProgress) {
      if (progressIndex < images.length) {
        const mProgress = progressIndex + 1;
        onChange(mProgress);
      } else {
        onChange(0);
      }
    } else {
      setProgressIndex(progressIndex);
    }
  }

  return (
    <View className="absolute top-0 left-0 right-0 w-full flex-row flex-1 bg-tint-gray">
      <FlatList<number | string>
        contentContainerClassName="flex-1 justify-center items-center self-center content-center items-center pl-3 pr-3 pt-5 pb-4"
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        data={images}
        ItemSeparatorComponent={() => <View style={{ marginLeft: 4 }} />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ProgressViewItem
            enableProgress={enableProgress}
            size={images.length}
            duration={duration}
            progressIndex={progressIndex}
            currentIndex={index}
            onChangePosition={() => changePosition()}
          />
        )}
      />
    </View>
  );
};
