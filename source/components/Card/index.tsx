import React from "react";
import {
  View,
  Image,
  ImageSourcePropType,
  ImageBackground,
} from "react-native";

import { styles } from "./styles";
import { CustomText } from "../CustomText";

interface Props {
  item: {
    image: ImageSourcePropType | undefined;
    title: string;
  };
}

export function Card({ item }: Props) {
  return (
    <View style={styles.card}>
      <Image style={{ width: 250, height: 400 }} resizeMode="contain" />
    </View>
  );
}
