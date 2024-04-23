import React, { useContext } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { styles } from "./styles";
import { Box, HStack, Text, VStack } from "native-base";
import Logo from "../../../assets/logoBrownDark.svg";
import { FontAwesome5 as Icon } from "@expo/vector-icons";
import { MaterialCommunityIcons as IconAlt } from "@expo/vector-icons";
import { theme } from "../../../utils/theme";
import { AuthContext } from "../../contexts/AuthContext";
import { Gradient } from "../Gradient";
import { useNavigation } from "@react-navigation/native";

interface props {
  headerType?: "green" | "brown" | "white";
  title?: string;
  goToProfileScreen?: () => void;
}

export function Header({
  headerType = "white",
  title,
  goToProfileScreen,
}: props) {
  const { signOut, user } = useContext(AuthContext);

  // const navigation = useNavigation();

  const isWhiteHeader = headerType === "white";

  const whiteHeaderStyle: ViewStyle = {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 26,
  };

  const gradientHeaderStyle: ViewStyle = {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "flex-end",
  };

  return (
    <HStack
      bg={"#fff"}
      h={140}
      borderBottomLeftRadius={20}
      borderBottomRightRadius={20}
      shadow={isWhiteHeader ? 3 : 0}
    >
      <Gradient
        style={isWhiteHeader ? whiteHeaderStyle : gradientHeaderStyle}
        gradientColor={headerType}
      >
        {headerType === "white" ? (
          <>
            <Logo width={74} height={40} fill={theme.colors.brown_dark} />

            <HStack alignItems={"center"}>
              <VStack w={150} maxW={150} mr={3}>
                <Text
                  color={theme.colors.brown_dark}
                  textAlign={"right"}
                  fontSize={19}
                  fontFamily={theme.font.basicSans_bold}
                >
                  {user?.nome}
                </Text>
                <Text
                  color={theme.colors.brown_dark}
                  textAlign={"right"}
                  fontSize={12}
                  fontFamily={theme.font.basicSans_regular}
                >
                  Extrativista
                </Text>
              </VStack>

              <Box
                shadow={3}
                width={"40px"}
                height={"40px"}
                borderRadius={20}
                alignItems={"center"}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={goToProfileScreen}
                >
                  <Icon
                    color={theme.colors.brown_light}
                    name="user-alt"
                    size={24}
                  />
                </TouchableOpacity>
              </Box>
            </HStack>
          </>
        ) : (
          <>
            <Text
              fontFamily={theme.font.bernhard_bold}
              fontSize={32}
              color={"#fff"}
              alignSelf={"center"}
              mb={6}
            >
              {title}
            </Text>
          </>
        )}
      </Gradient>
    </HStack>
  );
}
