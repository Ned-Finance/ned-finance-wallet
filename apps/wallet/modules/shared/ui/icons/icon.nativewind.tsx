import { icons } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { memo, useMemo } from "react";

type IconName = keyof typeof icons;
type IconProps = { name: IconName; className?: string; strokeWidth?: number };

const Icon: React.FC<IconProps> = memo(
  ({ name, className, strokeWidth = 1.5 }) => {
    const CustomIcon = useMemo(() => {
      const Icon = icons[name as any];
      Icon.displayName = name;

      return cssInterop(Icon, {
        className: {
          target: "style",
          nativeStyleToProp: {
            color: true,
            width: true,
            height: true,
          },
        },
      });
    }, [name]);

    return (
      <CustomIcon
        strokeWidth={strokeWidth}
        absoluteStrokeWidth={false}
        className={className}
      />
    );
  }
);

Icon.displayName = "Icon";

export { Icon };
