import { Box, HStack } from "native-base";
import React from "react";
import { View } from "react-native";
import { CustomText } from "../CustomText";
import { theme } from "../../../utils/theme";
import { ProgressBar as PB } from "react-native-paper";

interface Props {
  title: string;
  total: number;
  step: number;
}

export function ProgressBar({ title, total, step }: Props) {
  const progress = step / total;

  return (
    <Box px={19} mb={3}>
      <HStack justifyContent={"center"}>
        <CustomText
          styles={{
            fontSize: 19,
            fontFamily: theme.font.basicSans_bold,
          }}
        >
          {title}
        </CustomText>
        <CustomText
          styles={{
            flex: 1,
            fontSize: 17,
            fontFamily: theme.font.archivo_regular,
            color: theme.colors.grayscale[500],
            textAlign: "right",
            textAlignVertical: "center",
          }}
        >
          {step + "/" + total}
        </CustomText>
      </HStack>
      <View style={{ width: "100%" }}>
        <PB
          style={{
            marginTop: 10,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.green_light,
          }}
          progress={progress}
          color={theme.colors.green_regular}
        />
      </View>
    </Box>
  );
}
