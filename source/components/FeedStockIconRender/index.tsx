import React from "react";
import { View } from "react-native";
import { NumberProp, SvgProps } from "react-native-svg";
import { theme } from "../../../utils/theme";

interface Props {
  icon: React.FC<SvgProps>;
  width: NumberProp | undefined;
  height: NumberProp | undefined;
}

export function FeedStockIconRender({ icon, width, height }: Props) {
  const Icon = icon;

  return <Icon width={width} height={height} />;
}
