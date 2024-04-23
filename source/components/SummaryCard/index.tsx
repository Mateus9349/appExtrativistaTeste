import { HStack, VStack, Text } from "native-base";
import React from "react";
import { theme } from "../../../utils/theme";
import * as Animatable from "react-native-animatable";
import { TextMask } from "react-native-masked-text";

interface Props {
  comercialBalance: string;
  production: number;
}

export function SummaryCard({ comercialBalance = "0", production = 0 }: Props) {
  return (
    <HStack
      w={335}
      h={121}
      bg={"#fff"}
      shadow={3}
      justifyContent={"space-between"}
      px={6}
      alignItems={"center"}
      borderRadius={24}
      alignSelf={"center"}
      my={"24px"}
    >
      <VStack w={180}>
        <Text fontFamily={theme.font.basicSans_regular} fontSize={17}>
          Receita total
        </Text>
        <Text
          color={theme.colors.green_dark}
          fontFamily={theme.font.bernhard_bold}
          fontSize={30}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
        >
          {<TextMask type="money" value={" " + comercialBalance} />}
        </Text>
      </VStack>
      <VStack alignItems={"center"}>
        <Text fontFamily={theme.font.basicSans_regular} fontSize={17}>
          Produção
        </Text>
        <Text
          color={theme.colors.brown_dark}
          fontFamily={theme.font.bernhard_bold}
          fontSize={30}
        >
          {
            <Animatable.Text animation={"zoomIn"} duration={2000}>
              {" "}
              {production}
            </Animatable.Text>
          }{" "}
          kg
        </Text>
      </VStack>
    </HStack>
  );
}
