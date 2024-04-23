import { Box, Text } from "native-base";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { theme } from "../../../utils/theme";
import { FontAwesome5 as Icon } from "@expo/vector-icons";
import { CustomText } from "../CustomText";

interface Props {
  title: string;
  onPress: () => void;
  greenButton?: boolean;
  iconName?: string;
}

export function PlusButton({
  title,
  onPress,
  greenButton = false,
  iconName = "plus",
}: Props) {
  return (
    <Box>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 320,
          height: 80,
          backgroundColor: greenButton ? theme.colors.green_light : "#F6EBDF",
          borderWidth: 3,
          borderColor: greenButton
            ? theme.colors.green_dark
            : theme.colors.brown_dark,
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Icon
          name={iconName}
          color={
            greenButton ? theme.colors.green_dark : theme.colors.brown_dark
          }
          size={20}
          style={{ position: "absolute", left: 8 }}
        />
        <Text
          flex={1}
          fontSize={21}
          color={
            greenButton ? theme.colors.green_dark : theme.colors.brown_dark
          }
          textAlign={"center"}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Box>
  );
}
