import { Box, HStack, VStack, Text } from "native-base";
import React from "react";
import { theme } from "../../../utils/theme";
import * as Animatable from "react-native-animatable";
import { FeedstockInterface } from "../../../models/Feedstock";
import { FeedStockIconRender } from "../FeedStockIconRender";
import { feedstockIcons } from "../../../utils/feedstockData";

interface Props {
  feedstockData: FeedstockInterface;
}

export function ProductVisualizer({ feedstockData }: Props) {
  return (
    <HStack mt={"10px"}>
      <Box
        w={"80px"}
        h={"80px"}
        borderRadius={40}
        bg={theme.colors.brown_super_light}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Animatable.View animation={"zoomIn"}>
          {feedstockData && (
            <FeedStockIconRender
              height={"50px"}
              width={"50px"}
              icon={
                feedstockIcons[
                  feedstockData.name as keyof typeof feedstockIcons
                ]
              }
            />
          )}
        </Animatable.View>
      </Box>
      <Animatable.View
        animation={"fadeInLeft"}
        style={{ justifyContent: "center" }}
      >
        <VStack ml={"16px"} justifyContent={"center"}>
          <Text
            fontFamily={theme.font.bernhard_regular}
            fontSize={32}
            lineHeight={40}
            color={theme.colors.brown_dark}
          >
            {feedstockData ? feedstockData.name : ""}
          </Text>
        </VStack>
      </Animatable.View>
    </HStack>
  );
}
