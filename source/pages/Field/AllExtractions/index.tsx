import { Box, FlatList, HStack, Text, VStack } from "native-base";
import React, { useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { Header } from "../../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FieldStackParams } from "..";
import { useNavigation } from "@react-navigation/native";
import { CollectInProgressContext } from "../../../contexts/CollectInProgressContext";
import { SingleCollect } from "../../../../models/SingleCollect";
import { Button } from "../../../components/Button";
import { theme } from "../../../../utils/theme";
import { FontAwesome5 as FIcon } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../../contexts/AuthContext";

type fieldScreenProp = NativeStackNavigationProp<
  FieldStackParams,
  "AllExtractions"
>;

interface IExtractions {
  id: string;
  quantity: number;
  coord: string;
  created_at: string;
}

export function AllExtractions() {
  const navigation = useNavigation<fieldScreenProp>();
  const { user } = useContext(AuthContext);

  const [extractionsInDb, setExtractionsInDb] = useState<IExtractions[] | null>(
    null
  );

  const { collectInProgress, feedstockInCollect } = useContext(
    CollectInProgressContext
  );

  navigation.addListener("focus", () => {
    navigation
      .getParent()
      ?.setOptions({ tabBarStyle: { height: 0, display: "none" } });
  });

  const getExtractions = async () => {
    const extractions = (await SingleCollect.findAll({
      where: {
        collectId: collectInProgress?.id!,
        userIdCreated: user?.id as string,
        deleted_at: null,
      },
      attributes: ["id", "quantity", "coord", "created_at"],
      order: [["created_at", "ASC"]],
    })) as IExtractions[];

    if (!extractions) return;

    setExtractionsInDb(extractions);
  };

  useEffect(() => {
    getExtractions();
  }, []);

  return (
    <Box flex={1} bg={"#fff"}>
      <Header headerType="green" title="Lista de coletas" />

      <Box mt={6} flex={1}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 96, paddingTop: 26 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <VStack w={"100%"} alignItems={"center"} mt={10}>
              <Animatable.View
                style={{ alignItems: "center" }}
                animation={"zoomIn"}
              >
                <FIcon name="box-open" size={50} />
                <Text
                  mt={3}
                  fontFamily={theme.font.bernhard_regular}
                  fontSize={22}
                >
                  Você ainda não tem extrações
                </Text>
              </Animatable.View>
            </VStack>
          )}
          data={extractionsInDb}
          ItemSeparatorComponent={() => (
            <Box
              w={335}
              alignSelf={"center"}
              borderBottomWidth={1}
              borderColor={"#000"}
            />
          )}
          renderItem={({ item, index }) => (
            <Animatable.View animation={"fadeInLeft"}>
              <HStack w={335} alignItems={"center"} alignSelf={"center"} my={5}>
                <Box
                  w={"48px"}
                  h={"48px"}
                  borderRadius={8}
                  bg={theme.colors.green_light}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Text fontFamily={theme.font.bernhard_bold} fontSize={22}>
                    {index + 1}°
                  </Text>
                </Box>
                <VStack ml={3}>
                  <Text fontFamily={theme.font.basicSans_bold} fontSize={19}>
                    {item.quantity + " kg"}
                  </Text>
                  <Text fontFamily={theme.font.basicSans_regular} fontSize={17}>
                    Local:{" "}
                    {JSON.parse(item.coord)[0] +
                      ", " +
                      JSON.parse(item.coord)[1]}
                  </Text>
                </VStack>
              </HStack>
            </Animatable.View>
          )}
        />
      </Box>

      <Box position={"absolute"} w={"100%"} bottom={8}>
        <Button title="Voltar" backButton onPress={() => navigation.goBack()} />
      </Box>
    </Box>
  );
}
