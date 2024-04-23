import { VStack, Text, Box } from "native-base";
import React from "react";
import { MaskedTextInput, MaskedTextInputProps } from "react-native-mask-text";
import { theme } from "../../../utils/theme";

interface Props extends MaskedTextInputProps {
  label: string;
}

export function InputWithNameAbove({ label, ...rest }: Props) {
  return (
    <VStack mx={3}>
      <Text fontFamily={theme.font.basicSans_regular} mb={2}>
        {label}*
      </Text>
      <Box h={50} px={2}>
        <MaskedTextInput
          {...rest}
          style={{
            color: "#000",
            fontSize: 19,
            textAlign: "left",
            height: 56,
            flex: 1,
            paddingHorizontal: 6,
            paddingVertical: 13,
            borderRadius: 16,
            backgroundColor: theme.colors.grayscale[100],
          }}
        />
      </Box>
    </VStack>
  );
}
