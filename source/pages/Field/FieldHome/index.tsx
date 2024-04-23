import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Header } from "../../../components/Header";
import { FontAwesome5 as FIcon, Fontisto as FonIcon } from "@expo/vector-icons";
import {
  Box,
  Button,
  HStack,
  Modal,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { theme } from "../../../../utils/theme";
import { PlusButton } from "../../../components/PlusButton";
import { useNavigation } from "@react-navigation/native";
import { FieldStackParams } from "..";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ButtonWithBottomIcon } from "../../../components/ButtonWithBottomIcon";
import { ProductVisualizer } from "../../../components/ProductVisualizer";
import { CollectInProgressContext } from "../../../contexts/CollectInProgressContext";
import { Button as CButton } from "../../../components/Button";
import { Collect } from "../../../../models/Collect";
import {
  SingleCollect,
  SingleCollectType,
} from "../../../../models/SingleCollect";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../contexts/AuthContext";

type fieldScreenProp = NativeStackNavigationProp<FieldStackParams, "FieldHome">;

export function FieldHome() {
  const navigation = useNavigation<fieldScreenProp>();

  const { user } = useContext(AuthContext);
  const {
    hasCollectOpen,
    feedstockInCollect,
    collectInProgress,
    setHasCollectOpen,
    checkCollectInProgress,
  } = useContext(CollectInProgressContext);

  const [closeCollectModalOpen, setCloseCollectModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [singleCollects, setSingleCollects] = useState<
    SingleCollectType[] | null
  >(null);
  const [totalCollected, setTotalCollected] = useState(0);

  const totalMaterial =
    collectInProgress?.materialPerDayExpenses! *
    (Math.abs(
      moment(collectInProgress?.created_at).diff(moment(new Date()), "days")
    ) === 0
      ? 1
      : Math.abs(
          moment(collectInProgress?.created_at).diff(moment(new Date()), "days")
        ));

  const transportTotal =
    (collectInProgress?.balsaExpenses ?? 0) +
    (collectInProgress?.boatExpenses ?? 0) +
    (collectInProgress?.rabetaExpenses ?? 0) +
    (collectInProgress?.otherExpenses ?? 0);

  const totalExpenses =
    transportTotal + totalMaterial + (collectInProgress?.foodExpenses ?? 0);

  const getSingleCollect = async () => {
    try {
      if (collectInProgress) {
        const singleCollects = (await SingleCollect.findAll({
          where: {
            collectId: collectInProgress?.id,
            userIdCreated: user?.id as string,
            deleted_at: null,
          },
        })) as SingleCollectType[];

        if (!singleCollects) return;

        var totalCollected = 0;

        singleCollects.map((item) => {
          console.log("ITEM ->", item);
          totalCollected = totalCollected + item.quantity;
        });

        console.log("total -> ", totalCollected);

        setTotalCollected(totalCollected);

        setSingleCollects(singleCollects);
      }
    } catch (error) {
      console.log("Erro get single collect", error);
    }
  };

  const finalizeCollect = async () => {
    try {
      await Collect.update(
        {
          status: "closed",
          materialExpensesTotal: totalMaterial,
          closedDate: moment(new Date()).toISOString(true),
        },
        {
          where: {
            id: collectInProgress?.id!,
          },
        }
      );
      await AsyncStorage.removeItem("collect-in-progress");
    } catch (error) {
      setError(true);
      console.log("Erro ao finalizar a coleta");
    } finally {
      // setHasCollectOpen(false);
      navigation.navigate("Pannel");
      checkCollectInProgress();
    }
  };

  navigation.addListener("focus", () => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        height: 90,
        paddingHorizontal: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 16,
      },
    });
  });

  useEffect(() => {
    getSingleCollect();
  }, [closeCollectModalOpen]);

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <Modal
        isOpen={closeCollectModalOpen}
        onClose={() => setCloseCollectModalOpen(false)}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <Modal.Content
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          <Pressable h={60} onPress={() => setCloseCollectModalOpen(false)}>
            <HStack justifyContent={"center"} alignItems={"center"} flex={1}>
              <FIcon
                name="chevron-left"
                size={40}
                color={theme.colors.brown_light}
                style={{ position: "absolute", left: 6 }}
              />
              <Text fontSize={19} fontFamily={theme.font.basicSans_bold}>
                Finalizar Coleta
              </Text>
            </HStack>
          </Pressable>

          <Modal.Body>
            <VStack my={"16px"}>
              <Text fontFamily={theme.font.basicSans_regular} fontSize={17}>
                Total coletado
              </Text>

              <HStack
                w={343}
                h={"64px"}
                borderWidth={2}
                borderColor={theme.colors.grayscale[100]}
                borderRadius={20}
                alignItems={"center"}
                padding={"16px"}
                justifyContent={"center"}
              >
                <Text
                  fontSize={24}
                  fontFamily={theme.font.bernhard_bold}
                  color={theme.colors.grayscale[900]}
                >
                  {totalCollected + " kg"}
                </Text>
              </HStack>
            </VStack>
            <VStack my={"16px"}>
              <Text fontFamily={theme.font.basicSans_regular} fontSize={17}>
                Pontos de coleta
              </Text>

              <HStack
                w={343}
                h={"64px"}
                borderWidth={2}
                borderColor={theme.colors.grayscale[100]}
                borderRadius={20}
                alignItems={"center"}
                padding={"16px"}
                justifyContent={"center"}
              >
                <Text
                  fontSize={24}
                  fontFamily={theme.font.bernhard_bold}
                  color={theme.colors.grayscale[900]}
                >
                  {singleCollects?.length ?? 0}
                </Text>
              </HStack>
            </VStack>

            <VStack mb={16}>
              <Text fontFamily={theme.font.basicSans_regular} fontSize={17}>
                Gasto parcial
              </Text>
              <VStack
                w={343}
                h={150}
                borderWidth={2}
                borderColor={theme.colors.grayscale[100]}
                borderRadius={20}
                alignItems={"center"}
                padding={"16px"}
                justifyContent={"center"}
              >
                <HStack justifyContent={"space-between"} w={"100%"}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    color={theme.colors.grayscale[500]}
                  >
                    Rancho
                  </Text>
                  <Text
                    color={theme.colors.grayscale[500]}
                    fontSize={19}
                    fontFamily={theme.font.basicSans_bold}
                  >
                    R$ {collectInProgress?.foodExpenses ?? 0}
                  </Text>
                </HStack>

                <HStack justifyContent={"space-between"} w={"100%"}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    color={theme.colors.grayscale[500]}
                  >
                    Transporte
                  </Text>
                  <Text
                    color={theme.colors.grayscale[500]}
                    fontSize={19}
                    fontFamily={theme.font.basicSans_bold}
                  >
                    R$ {transportTotal}
                  </Text>
                </HStack>

                <HStack justifyContent={"space-between"} w={"100%"}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    color={theme.colors.grayscale[500]}
                  >
                    Materiais
                  </Text>
                  <Text
                    color={theme.colors.grayscale[500]}
                    fontSize={19}
                    fontFamily={theme.font.basicSans_bold}
                  >
                    R$ {isNaN(totalMaterial) ? 0 : totalMaterial.toFixed(2)}
                  </Text>
                </HStack>

                <HStack mt={1} justifyContent={"space-between"} w={"100%"}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    color={theme.colors.grayscale[900]}
                    fontSize={19}
                  >
                    Total
                  </Text>
                  <Text
                    color={theme.colors.grayscale[900]}
                    fontSize={19}
                    fontFamily={theme.font.basicSans_bold}
                  >
                    R$ {isNaN(totalExpenses) ? 0 : totalExpenses.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            <HStack justifyContent={"center"}>
              <CButton
                style={{ marginHorizontal: 16 }}
                title="Cancelar"
                onPress={() => {
                  setCloseCollectModalOpen(false);
                }}
                backButton
              />
              <CButton
                style={{ marginHorizontal: 16 }}
                title="Finalizar"
                onPress={finalizeCollect}
              />
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Header />

      <Box my={"32px"} ml={19}>
        <Text
          mb={"32px"}
          fontFamily={theme.font.bernhard_regular}
          fontSize={32}
          lineHeight={40}
        >
          {hasCollectOpen
            ? "Coleta em andamento"
            : "Não possui coletas em andamento"}
        </Text>

        {/* <Text>Dias em campo: 4 / Pontos coletados: 65</Text> */}
        {hasCollectOpen && (
          <ProductVisualizer feedstockData={feedstockInCollect!} />
        )}
      </Box>

      <PlusButton
        title="Extrair"
        onPress={() => navigation.navigate("ExtractionInField")}
      />

      <HStack mx={19} mt={"32px"}>
        <ButtonWithBottomIcon
          onPress={() => navigation.navigate("AllExtractions")}
          buttonColor={theme.colors.green_light}
          title="Extrações"
          icon="clipboard-list"
        />
        <ButtonWithBottomIcon
          onPress={() => setCloseCollectModalOpen(true)}
          buttonColor={theme.colors.green_dark}
          title="Finalizar"
          icon="running"
        />
      </HStack>

      {/* <Button variant={"unstyled"} mt={"32px"}>
        <Text
          fontFamily={theme.font.basicSans_bold}
          fontSize={19}
          color={theme.colors.brown_dark}
        >
          Adicionar observação
        </Text>
      </Button> */}
    </View>
  );
}
