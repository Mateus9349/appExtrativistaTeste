import React from "react";
import { TouchableOpacity, ViewProps } from "react-native";
import { View } from "native-base";

import { styles } from "./styles";
import { CustomText } from "../CustomText";

interface Props extends ViewProps {
  onPress: () => void;
  title: string;
  backButton?: boolean;
  redButton?: boolean;
  disabled?: boolean;
}

export function Button(props: Props) {
  return (
    <View alignItems={"center"} {...props}>
      <TouchableOpacity
        style={[
          props.backButton
            ? styles.buttonAlt
            : props.redButton
            ? styles.buttonRed
            : styles.button,
          { opacity: props.disabled ? 0.5 : 1 },
        ]}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <CustomText
          styles={{
            color: props.backButton ? "#000" : "#fff",
            textAlign: "center",
            fontSize: 17,
            lineHeight: 24,
          }}
        >
          {props.title}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
}
