import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, SectionList, TouchableOpacity, View } from "react-native";

import {
  FontAwesome5 as Icon,
  MaterialIcons as MIcon,
} from "@expo/vector-icons";

import { Header } from "../../../components/Header";
import { SummaryCard } from "../../../components/SummaryCard";
import {
  Box,
  FlatList,
  HStack,
  Modal,
  Pressable,
  Text,
  VStack,
  ScrollView,
} from "native-base";
import { theme } from "../../../../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CollectStackParams } from "..";
import { feedstockIcons } from "../../../../utils/feedstockData";
import { FeedStockIconRender } from "../../../components/FeedStockIconRender";
import {
  CollectInProgressContext,
  SoldCollects,
} from "../../../contexts/CollectInProgressContext";
import moment from "moment";
import "moment/locale/pt-br";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import CurrencyInput from "react-native-currency-input";
import { Button } from "../../../components/Button";
import { SingleCollect } from "../../../../models/SingleCollect";
import { Sale } from "../../../../models/Sale";
import { Collect } from "../../../../models/Collect";
import { CollectDetails } from "../../../components/CollectDetails";
import * as Animatable from "react-native-animatable";
import WelcomeHomeIcon from "../../../../assets/welcomeHome.svg";
import api from "../../../services/api";
import { AuthContext } from "../../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Op } from "rn-sequelize";

type PannelCollectType = NativeStackNavigationProp<
  CollectStackParams,
  "PannelHome"
>;

type PropsSmallButton = {
  onPress: () => void;
  disabled: boolean;
};

const SmallButton = ({ onPress, disabled }: PropsSmallButton) => {
  return (
    <Pressable
      opacity={disabled ? 0.5 : 1}
      onPress={onPress}
      disabled={disabled}
    >
      {({ isPressed }) => (
        <HStack
          w={180}
          bg={isPressed ? theme.colors.green_light : theme.colors.green_dark}
          h={"56px"}
          alignItems={"center"}
          alignSelf={"center"}
          justifyContent={"center"}
          borderRadius={16}
        >
          {disabled ? (
            <Text
              fontFamily={theme.font.basicSans_regular}
              color={"#fff"}
              fontSize={16}
              alignSelf={"center"}
            >
              Coleta em andamento
            </Text>
          ) : (
            <>
              <Icon
                style={{ marginRight: 10 }}
                name="plus"
                size={20}
                color={"#fff"}
              />
              <Text
                fontFamily={theme.font.basicSans_regular}
                color={"#fff"}
                fontSize={17}
                alignSelf={"center"}
              >
                Nova coleta
              </Text>
            </>
          )}
        </HStack>
      )}
    </Pressable>
  );
};

export function PannelHome() {
  const navigation = useNavigation<PannelCollectType>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { user } = useContext(AuthContext);

  const [openCollectDetails, setOpenCollectDetails] = useState(false);
  const [error, setError] = useState(false);

  const [collectPoints, setCollectPoints] = useState(0);

  const [totalInKg, setTotalInKg] = useState<number | null>(0);
  const [helpersComission, setHelpersComission] = useState<number | null>(0);
  const [soldValue, setSoldValue] = useState<number | null>(0);

  const [openSellModal, setOpenSellModal] = useState(false);

  const [collectToBeSold, setCollectToBeSold] = useState<SoldCollects | null>(
    null
  );

  const {
    allSoldCollects,
    hasCollectOpen,
    getAllCollects,
    totalEarnings,
    totalProduction,
  } = useContext(CollectInProgressContext);

  const openModal = (item: SoldCollects) => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    setCollectToBeSold(item as SoldCollects);
    bottomSheetRef.current?.expand();
  };

  const goToSellCollect = () => {
    bottomSheetRef.current?.close();
    setOpenSellModal(true);
    // navigation.navigate("SellCollect", { collect: collectToBeSold! });
  };

  const makeBottomTabNavAppear = () => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        height: 100,
        paddingHorizontal: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 16,
      },
    });
    setOpenCollectDetails(false);
  };

  navigation.addListener("focus", () => {
    makeBottomTabNavAppear();
  });

  const totalMaterial =
    collectToBeSold?.materialPerDayExpenses! *
    (Math.abs(
      moment(collectToBeSold?.created_at).diff(moment(new Date()), "days")
    ) === 0
      ? 1
      : Math.abs(
          moment(collectToBeSold?.created_at).diff(moment(new Date()), "days")
        ));

  const transportTotal =
    (collectToBeSold?.balsaExpenses ?? 0) +
    (collectToBeSold?.boatExpenses ?? 0) +
    (collectToBeSold?.rabetaExpenses ?? 0) +
    (collectToBeSold?.otherExpenses ?? 0);

  const totalExpenses =
    transportTotal + totalMaterial + (collectToBeSold?.foodExpenses ?? 0);

  const sellCollect = async () => {
    const profit = (soldValue ?? 0) - (totalExpenses + (helpersComission ?? 0));
    const associationName = await AsyncStorage.getItem("association");
    try {
      await Sale.create({
        collectId: collectToBeSold?.id,
        userIdCreated: user?.id,
        association: associationName,
        saleValue: soldValue?.toFixed(2),
        soldWeight: totalInKg,
        totalExpenses: totalExpenses,
        commission: helpersComission,
        profit: profit.toFixed(2),
        created_at: moment(new Date()).toISOString(true),
      });

      await Collect.update(
        {
          status: "sold",
        },
        {
          where: {
            id: collectToBeSold?.id!,
          },
        }
      );

      getAllCollects();
      setCollectToBeSold(null);
      setOpenSellModal(false);
    } catch (error) {
      setError(false);
      console.log("Error ao criar a venda", error);
    }
  };

  const sendDataToAPI = async () => {
    try {
      const collects = await Collect.findAll({
        where: {
          [Op.or]: [{ status: "closed" }, { status: "sold" }],
          userIdCreated: user?.id as string,
        },
      });
      console.log("collects -> ", collects);
      const data = JSON.stringify(collects);
      await api.post("collects", data);
    } catch (error) {
      Alert.alert("Algo deu errado");
      console.log("Error send collect", error);
    }
  };

  const sendData = () => {
    Alert.alert(
      "Envio de dados",
      "Deseja enviar seus dados para o servidor? (Uma conexão estável com a internet é necessária)",
      [
        {
          text: "Cancelar",
          onPress: () => {},
        },
        {
          text: "Enviar",
          onPress: () => sendDataToAPI(),
        },
      ]
    );
  };

  useEffect(() => {
    if (collectToBeSold) {
      const getAllCollectPoints = async () => {
        const points = await SingleCollect.count({
          where: {
            collectId: collectToBeSold.id,
          },
        });

        if (points > 0) {
          setCollectPoints(points);
        }
      };

      getAllCollectPoints();
    }
  }, [openSellModal]);

  return (
    <Animatable.View
      animation={"fadeIn"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <Modal
        isOpen={openSellModal}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <VStack mb={36} flex={1} pt={10}>
            <Pressable
              h={60}
              onPress={() => {
                setOpenSellModal(false);
                setCollectToBeSold(null);
              }}
            >
              <HStack justifyContent={"center"} alignItems={"center"} flex={1}>
                <Icon
                  name="chevron-left"
                  size={40}
                  color={theme.colors.brown_light}
                  style={{ position: "absolute", left: 6 }}
                />
                <Text fontSize={19} fontFamily={theme.font.basicSans_bold}>
                  Vender Coleta
                </Text>
              </HStack>
            </Pressable>

            <VStack>
              <Text
                mb={"16px"}
                fontSize={17}
                fontFamily={theme.font.basicSans_regular}
              >
                Matéria-prima
              </Text>
              <Box
                borderRadius={20}
                borderColor={theme.colors.grayscale[100]}
                borderWidth={1}
                w={342}
                h={"64px"}
                justifyContent={"center"}
                pl={"16px"}
              >
                <Text fontFamily={theme.font.bernhard_bold} fontSize={22}>
                  {collectToBeSold?.feedstock.name}
                </Text>
              </Box>
            </VStack>

            <VStack mt={6}>
              <Text
                mb={"16px"}
                fontSize={17}
                fontFamily={theme.font.basicSans_regular}
              >
                Total coletado
              </Text>
              <Box
                borderRadius={20}
                borderColor={theme.colors.grayscale[100]}
                borderWidth={1}
                w={342}
                h={180}
                justifyContent={"center"}
                pl={"16px"}
              >
                <Text fontFamily={theme.font.bernhard_bold} fontSize={22}>
                  {collectToBeSold?.quantity + " kg"}
                </Text>
                <VStack
                  mt={3}
                  alignItems={"center"}
                  borderBottomWidth={1}
                  w={300}
                >
                  <Text fontFamily={theme.font.basicSans_regular} fontSize={19}>
                    Total em Kg
                  </Text>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={15}
                    mb={3}
                  >
                    (informação fornecida pela usina)
                  </Text>
                  <CurrencyInput
                    style={{
                      fontSize: 30,
                      fontFamily: theme.font.bernhard_regular,
                    }}
                    keyboardType="numeric"
                    returnKeyType="done"
                    delimiter="."
                    separator=","
                    precision={2}
                    minValue={0}
                    value={totalInKg}
                    onChangeValue={(text) => setTotalInKg(text)}
                  />
                </VStack>
              </Box>
            </VStack>

            <VStack mt={6}>
              <Text
                mb={"16px"}
                fontSize={17}
                fontFamily={theme.font.basicSans_regular}
              >
                Pontos de coleta
              </Text>
              <Box
                borderRadius={20}
                borderColor={theme.colors.grayscale[100]}
                borderWidth={1}
                w={342}
                h={"64px"}
                justifyContent={"center"}
                pl={"16px"}
              >
                <Text fontFamily={theme.font.bernhard_bold} fontSize={22}>
                  {collectPoints}
                </Text>
              </Box>
            </VStack>

            <VStack mt={6}>
              <Text
                mb={"16px"}
                fontSize={17}
                fontFamily={theme.font.basicSans_regular}
              >
                Gastos parciais
              </Text>
              <VStack
                borderRadius={20}
                borderColor={theme.colors.grayscale[100]}
                borderWidth={1}
                w={342}
                h={310}
                px={"16px"}
                pt={"16px"}
              >
                <HStack mt={2} justifyContent={"space-between"}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    Rancho
                  </Text>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    R$ {collectToBeSold?.foodExpenses}
                  </Text>
                </HStack>
                <HStack mt={2} justifyContent={"space-between"}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    Transporte
                  </Text>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    R$ {transportTotal}
                  </Text>
                </HStack>
                <HStack mt={2} justifyContent={"space-between"}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    Materiais
                  </Text>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    R$ {totalMaterial}
                  </Text>
                </HStack>
                <HStack mt={2} justifyContent={"space-between"}>
                  <Text
                    fontFamily={theme.font.basicSans_bold}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    Total parcial
                  </Text>
                  <Text
                    fontFamily={theme.font.basicSans_bold}
                    fontSize={17}
                    color={theme.colors.grayscale[900]}
                  >
                    R$ {totalExpenses.toFixed(2)}
                  </Text>
                </HStack>

                <VStack alignItems={"center"} mt={6} borderBottomWidth={1}>
                  <Text
                    alignSelf={"flex-start"}
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    mb={3}
                  >
                    Pagamento dos ajudantes
                  </Text>
                  <CurrencyInput
                    style={{
                      fontSize: 30,
                      fontFamily: theme.font.bernhard_regular,
                    }}
                    keyboardType="numeric"
                    returnKeyType="done"
                    prefix="R$ "
                    delimiter="."
                    separator=","
                    precision={2}
                    minValue={0}
                    value={helpersComission}
                    onChangeValue={(text) => setHelpersComission(text)}
                  />
                </VStack>

                <HStack mt={6} justifyContent={"space-between"}>
                  <Text
                    fontFamily={theme.font.basicSans_bold}
                    fontSize={17}
                    color={theme.colors.grayscale[800]}
                  >
                    Total
                  </Text>
                  <Text
                    fontFamily={theme.font.basicSans_bold}
                    fontSize={17}
                    color={theme.colors.grayscale[900]}
                  >
                    R$ {(totalExpenses + (helpersComission ?? 0)).toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            <VStack mt={6}>
              <Text
                mb={"16px"}
                fontSize={17}
                fontFamily={theme.font.basicSans_regular}
              >
                Venda
              </Text>
              <Box
                borderRadius={20}
                borderColor={theme.colors.grayscale[100]}
                borderWidth={1}
                w={342}
                h={"64px"}
                justifyContent={"center"}
                pl={"16px"}
                alignItems={"center"}
              >
                <CurrencyInput
                  style={{
                    fontSize: 30,
                    fontFamily: theme.font.bernhard_regular,
                  }}
                  keyboardType="numeric"
                  returnKeyType="done"
                  delimiter="."
                  separator=","
                  precision={2}
                  minValue={0}
                  value={soldValue}
                  onChangeValue={(text) => setSoldValue(text)}
                />
              </Box>
            </VStack>

            <HStack mt={6} justifyContent={"space-between"}>
              <Text
                fontFamily={theme.font.basicSans_bold}
                fontSize={19}
                color={theme.colors.grayscale[900]}
              >
                Lucro
              </Text>
              <Text
                fontFamily={theme.font.basicSans_bold}
                fontSize={19}
                color={
                  (soldValue ?? 0) - (totalExpenses + (helpersComission ?? 0)) >
                  0
                    ? theme.colors.green_dark
                    : theme.colors.red
                }
              >
                R${" "}
                {(
                  (soldValue ?? 0) -
                  (totalExpenses + (helpersComission ?? 0))
                ).toFixed(2)}
              </Text>
            </HStack>

            <HStack justifyContent={"center"} mt={"24"}>
              <Button
                onPress={() => {
                  setOpenSellModal(false);
                }}
                title="Cancelar"
                backButton
                style={{ marginRight: 16 }}
              />
              <Button onPress={() => sellCollect()} title="Finalizar" />
            </HStack>
          </VStack>
        </ScrollView>
      </Modal>
      <Header goToProfileScreen={() => navigation.navigate("Profile")} />

      <SummaryCard
        comercialBalance={totalEarnings.toString()}
        production={totalProduction}
      />

      <Box>
        {allSoldCollects === null ? (
          <VStack alignSelf={"center"} alignItems={"center"} mt={10}>
            <WelcomeHomeIcon />
            <Text
              fontFamily={theme.font.bernhard_bold}
              mt={3}
              fontSize={32}
              lineHeight={40}
              color={theme.colors.grayscale[900]}
              mb={6}
            >
              Bem vindo!
            </Text>
            <Text
              fontFamily={theme.font.basicSans_regular}
              fontSize={17}
              color={theme.colors.grayscale[900]}
              mb={10}
            >
              Vamos começar os trabalhos?
            </Text>

            <SmallButton
              disabled={hasCollectOpen}
              onPress={() => navigation.navigate("NewCollect")}
            />
          </VStack>
        ) : (
          <VStack alignSelf={"center"} w={"100%"} mb={5} px={5}>
            <Text fontFamily={theme.font.basicSans_bold} fontSize={19} mb={6}>
              Minhas coletas: {allSoldCollects?.length ?? 0}
            </Text>
            {/* <TouchableOpacity
              onPress={sendData}
              disabled={hasCollectOpen}
              style={{
                width: 40,
                opacity: hasCollectOpen ? 0.5 : 1,
                height: 40,
                position: "absolute",
                right: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name="cloud-upload-alt"
                size={29}
                color={theme.colors.green_dark}
              />
            </TouchableOpacity> */}
            <SmallButton
              disabled={hasCollectOpen}
              onPress={() => navigation.navigate("NewCollect")}
            />
          </VStack>
        )}

        <Box height={300}>
          <FlatList
            data={allSoldCollects}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 26,
            }}
            renderItem={({ item }) => (
              <Pressable onPress={() => openModal(item as SoldCollects)}>
                {({ isPressed }) => (
                  <HStack
                    w={350}
                    h={"80px"}
                    my={3}
                    alignItems={"center"}
                    borderBottomWidth={0.2}
                    bg={isPressed ? theme.colors.grayscale[100] : "#fff"}
                    borderRadius={10}
                    px={2}
                  >
                    <Box
                      w={"64px"}
                      h={"64px"}
                      borderRadius={32}
                      alignItems={"center"}
                      justifyContent={"center"}
                      bg={theme.colors.brown_super_light}
                    >
                      <FeedStockIconRender
                        icon={
                          feedstockIcons[
                            item.feedstock.name as keyof typeof feedstockIcons
                          ]
                        }
                        width={32}
                        height={32}
                      />
                    </Box>
                    <VStack ml={4}>
                      <Text
                        fontFamily={theme.font.basicSans_bold}
                        fontSize={19}
                      >
                        {item.quantity + " kg" + " / " + item.feedstock.name}
                      </Text>
                      <Text
                        fontFamily={theme.font.basicSans_regular}
                        fontSize={17}
                      >
                        {moment(item.created_at).format("DD / MMMM")}
                      </Text>
                    </VStack>

                    {item.status === "sold" && (
                      <Box position={"absolute"} right={9}>
                        <Box position={"absolute"} left={-3} top={-9}>
                          <Icon
                            name="check"
                            size={22}
                            color={theme.colors.green_dark}
                          />
                        </Box>
                      </Box>
                    )}
                  </HStack>
                )}
              </Pressable>
            )}
          />
        </Box>
      </Box>

      <BottomSheet
        backdropComponent={BottomSheetBackdrop}
        enablePanDownToClose={true}
        onClose={makeBottomTabNavAppear}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", openCollectDetails ? "83%" : "40%"]}
      >
        {openCollectDetails ? (
          <CollectDetails collect={collectToBeSold!} />
        ) : (
          <>
            <Pressable onPress={() => setOpenCollectDetails(true)}>
              {({ isPressed }) => (
                <VStack
                  w={232}
                  h={"80px"}
                  bg={isPressed ? "#fff" : theme.colors.green_light}
                  mt={10}
                  mb={3}
                  borderRadius={16}
                  alignSelf={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Icon
                    name="leaf"
                    size={26}
                    color={theme.colors.grayscale[900]}
                  />
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[900]}
                  >
                    Ver detalhes da coleta
                  </Text>
                </VStack>
              )}
            </Pressable>

            <Pressable
              onPress={goToSellCollect}
              disabled={collectToBeSold?.status === "closed" ? false : true}
            >
              {({ isPressed }) => (
                <VStack
                  w={232}
                  h={"80px"}
                  bg={
                    isPressed
                      ? theme.colors.green_regular
                      : theme.colors.green_dark
                  }
                  opacity={collectToBeSold?.status === "closed" ? 1 : 0.4}
                  mt={3}
                  borderRadius={16}
                  alignSelf={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <MIcon name="attach-money" size={26} color={"#fff"} />
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={"#fff"}
                  >
                    Vender
                  </Text>
                </VStack>
              )}
            </Pressable>
          </>
        )}
      </BottomSheet>
    </Animatable.View>
  );
}
