import React, { useContext, useEffect, useRef, useState } from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { CustomText } from "../../../components/CustomText";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CollectStackParams } from "../../Collect";
import IconMaterial from "../../../../assets/materialInCollect.svg";
import Rancho from "../../../../assets/rancho.svg";
import Boat from "../../../../assets/boat.svg";
import { Button } from "../../../components/Button";
import {
  Box,
  FlatList,
  HStack,
  Input,
  Text,
  VStack,
  Pressable,
  Modal,
} from "native-base";
import { theme } from "../../../../utils/theme";
import { ProgressBar } from "../../../components/ProgressBar";
import { PlusButton } from "../../../components/PlusButton";

import { Gradient } from "../../../components/Gradient";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import CurrencyInput from "react-native-currency-input";
import { Materials } from "../../../../models/Materials";
import { feedstockIcons } from "../../../../utils/feedstockData";
import { FeedStockIconRender } from "../../../components/FeedStockIconRender";
import { Feedstock } from "../../../../models/Feedstock";
import { Collect } from "../../../../models/Collect";
import moment from "moment";
import { MaterialInCollect } from "../../../../models/MaterialInCollect";
import { CollectInProgressContext } from "../../../contexts/CollectInProgressContext";
import { Person, PersonType } from "../../../../models/Person";
import { Ionicons as Icon } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../../contexts/AuthContext";

type collectScreenProp = NativeStackNavigationProp<
  CollectStackParams,
  "NewCollect"
>;

type MaterialSelected = {
  id: string;
  name: string;
  qtd: string;
  deprecitationPerDay: number;
};

type MaterialType = {
  id: string;
  name: string;
  unitPrice: number;
  lifespan: number;
  label: string;
  depreciationPerDay?: number;
};

type FeedstockType = {
  id: string;
  name: string;
  standardMeasure: string;
  collectType: string;
  category: string;
};

export function NewCollect() {
  const navigation = useNavigation<collectScreenProp>();
  const { setCollectInProgress, setFeedstockInCollect, setHasCollectOpen } =
    useContext(CollectInProgressContext);
  const { user } = useContext(AuthContext);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [formPage, setFormPage] = useState(1);
  const [title, seTitle] = useState("Nova Coleta");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bottomSheetTitle, setbottomSheetTitle] = useState("");
  const [modalTitle, setModalTitle] = useState<string>("");

  const [boatSpending, setBoatSpending] = useState<number | null>(0);
  const [rabetaSpending, setRabetaSpending] = useState<number | null>(0);
  const [balsaSpending, setBalsaSpending] = useState<number | null>(0);
  const [otherSpending, setOtherSpending] = useState<number | null>(0);

  const [feedstock, setFeedstock] = useState<FeedstockType | null>(null);

  const [helpersSelected, setHelpersSelected] = useState<string[]>([]);
  const [renderListAgain, setRenderListAgain] = useState(false);

  const [foodSpending, setFoodSpending] = useState<number | null>(0);
  const [fuelSpending, setFuelSpending] = useState<number | null>(0);

  const [materialsFromDB, setMaterialsFromDB] = useState<MaterialType[] | null>(
    null
  );
  const [feedstockFromDB, setFeedstockFromDB] = useState<
    FeedstockType[] | null
  >(null);
  const [helpersFromDb, setHelpersFromDb] = useState<PersonType[] | null>(null);

  const [materialsSelected, setMaterialsSelected] = useState<
    MaterialSelected[]
  >([]);

  const transportTotalSpending =
    (boatSpending ?? 0) +
    (rabetaSpending ?? 0) +
    (balsaSpending ?? 0) +
    (otherSpending ?? 0);

  const totalSpending =
    (foodSpending ?? 0) + (fuelSpending ?? 0) + transportTotalSpending;

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const progressTitle = [
    "Escolher produto",
    "Montar equipe",
    "Escolher materiais",
    "Gastos com transporte",
  ];

  const openModal = (title: string) => {
    setbottomSheetTitle(title);
    bottomSheetRef.current?.expand();
  };

  const handleNextFormPages = async () => {
    if (formPage === 5) {
      await saveCollect();
      navigation.reset({
        index: 0,
        routes: [{ name: "Field" }],
      });
      return;
    }
    setFormPage((prev) => prev + 1);
  };

  const handlePrevFormPages = () => {
    if (formPage === 1) {
      navigation.goBack();
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          height: 90,
          paddingHorizontal: 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 16,
        },
      });
    }

    setFormPage((prev) => prev - 1);
  };

  const saveCollect = async () => {
    try {
      const collectCreated = await Collect.create({
        feedstockId: feedstock?.id,
        userIdCreated: user?.id,
        team: JSON.stringify(helpersSelected),
        foodExpenses: foodSpending,
        boatExpenses: boatSpending,
        rabetaExpenses: rabetaSpending,
        otherExpenses: otherSpending,
        balsaExpenses: balsaSpending,
        materialPerDayExpenses: getTotalDepreciation(materialsSelected),
        status: "open",
        created_at: moment(new Date()).toISOString(true),
      });
      const collectId = collectCreated.id;
      setCollectInProgress(collectCreated);
      setHasCollectOpen(true);
      setFeedstockInCollect(feedstock);

      materialsSelected.map(async (item) => {
        if (item.qtd !== "") {
          await MaterialInCollect.create({
            collectId,
            materialId: item.id,
            quantity: item.qtd,
            created_at: moment(new Date()).toISOString(true),
          });
        }
      });
    } catch (error) {
      setError(true);
      console.log("Erro ao salvar a coleta", error);
    }
  };

  const openModalInput = (name: string) => {
    setModalTitle(name);
    setIsModalOpen(true);
  };

  const transportButtons = [
    { title: "Barco", value: "barco" },
    { title: "Rabeta", value: "rabeta" },
    { title: "Balsa", value: "balsa" },
    { title: "Outros", value: "outros" },
  ];

  const closeError = () => {
    setError(false);
  };

  navigation.addListener("focus", () => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
  });

  const getTotalDepreciation = (materials: MaterialSelected[]) => {
    var total = 0;
    materials.forEach((element) => {
      if (element.qtd !== "") {
        total = total + element.deprecitationPerDay * parseInt(element.qtd);
      }
    });

    return total.toFixed(2);
  };

  const getDepreciationPerDay = (materialObj: MaterialType) => {
    let price = materialObj.unitPrice;
    let lifespanDays = materialObj.lifespan * 365;

    let depreciationPerDay = price / lifespanDays;
    materialObj.depreciationPerDay = depreciationPerDay;

    setMaterialsSelected((prev) => [
      ...prev,
      {
        name: materialObj.name,
        qtd: "",
        deprecitationPerDay: materialObj.depreciationPerDay!,
        id: materialObj.id,
      },
    ]);

    return materialObj;
  };

  const getMaterialsFromDb = async () => {
    const materials = (await Materials.findAll({
      where: {
        deleted_at: null,
      },
      attributes: {
        exclude: ["created_at", "deleted_at", "updated_at", "acquisition"],
      },
    })) as MaterialType[];

    if (!materials) return;

    const materialsToSave: MaterialType[] = materials.map((item) =>
      getDepreciationPerDay(item)
    );

    setMaterialsFromDB(materialsToSave);

    return;
  };

  const getFeedstocksFromDb = async () => {
    setLoading(true);
    const feedstocks = (await Feedstock.findAll({
      where: {
        deleted_at: null,
      },
      attributes: {
        exclude: ["created_at", "deleted_at", "updated_at"],
      },
    })) as FeedstockType[];

    if (!feedstocks) {
      setLoading(false);
      return;
    }

    setFeedstockFromDB(feedstocks);
    setLoading(false);
  };

  const getHelpersFromDb = async () => {
    const helpers = (await Person.findAll({
      where: {
        deleted_at: null,
      },
      attributes: {
        exclude: ["created_at", "deleted_at", "updated_at"],
      },
    })) as PersonType[];

    if (!helpers) return;

    setHelpersFromDb(helpers);
  };

  useEffect(() => {
    getMaterialsFromDb();
    getFeedstocksFromDb();
    getHelpersFromDb();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Content
          style={{
            width: 300,
            height: 230,
            alignItems: "center",
          }}
        >
          <Box flex={1} w={"100%"} p={2}>
            <Text
              fontFamily={theme.font.bernhard_regular}
              fontSize={26}
              alignSelf={"center"}
            >
              Insira o valor
            </Text>
            <Text
              alignSelf={"center"}
              fontFamily={theme.font.basicSans_regular}
              fontSize={18}
            >
              {modalTitle}
            </Text>
          </Box>
          <Box w={"100%"} height={120}>
            <Box
              w={"90%"}
              alignSelf={"center"}
              alignItems={"center"}
              borderBottomWidth={1}
              px={6}
            >
              <CurrencyInput
                style={{
                  fontSize: 30,
                  fontFamily: theme.font.bernhard_regular,
                }}
                keyboardType="numeric"
                returnKeyType="done"
                prefix="R$"
                delimiter="."
                separator=","
                precision={2}
                minValue={0}
                value={
                  modalTitle === "Barco"
                    ? boatSpending
                    : modalTitle === "Rabeta"
                    ? rabetaSpending
                    : modalTitle === "Balsa"
                    ? balsaSpending
                    : otherSpending
                }
                onChangeValue={(text) => {
                  switch (modalTitle) {
                    case "Barco":
                      setBoatSpending(text ?? 0);
                      return;
                    case "Rabeta":
                      setRabetaSpending(text ?? 0);
                      return;
                    case "Balsa":
                      setBalsaSpending(text ?? 0);
                      return;
                    case "Outros":
                      setOtherSpending(text ?? 0);
                      return;
                  }
                }}
              />
            </Box>
          </Box>
          <Modal.CloseButton color={"#000"} />
        </Modal.Content>
      </Modal>

      <Gradient gradientColor="green">
        <Box
          alignItems={"center"}
          justifyContent={"center"}
          height={140}
          pt={16}
        >
          <CustomText
            styles={{
              fontSize: 28,
              fontFamily: theme.font.bw_bold,
              lineHeight: 40,
              textAlign: "center",
              textAlignVertical: "center",
              color: "#fff",
            }}
          >
            {title}
          </CustomText>
        </Box>

        <Box paddingX={3} pt={6} bg={"#fff"} flex={1} borderTopRadius={50}>
          {formPage !== 5 && (
            <ProgressBar
              step={formPage}
              total={4}
              title={progressTitle[formPage - 1]}
            />
          )}

          {formPage === 1 && (
            <View
              style={{
                marginBottom: 40,
                marginTop: 20,
                height: 440,
                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator
                  size={"large"}
                  color={theme.colors.green_dark}
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <FlatList
                  data={feedstockFromDB}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const isSelected = item.id === feedstock?.id;

                    return (
                      <Animatable.View animation={"fadeInUp"}>
                        <Pressable
                          onPress={() => {
                            if (feedstock?.id === item.id) {
                              setFeedstock(null);
                              return;
                            }
                            setFeedstock({
                              name: item.name,
                              id: item.id,
                              standardMeasure: item.standardMeasure,
                              collectType: item.collectType,
                              category: item.category,
                            });
                          }}
                          flexDirection={"row"}
                          px={4}
                          borderWidth={1}
                          borderRadius={10}
                          borderColor={
                            isSelected
                              ? theme.colors.green_dark
                              : theme.colors.grayscale[100]
                          }
                          bg={isSelected ? theme.colors.green_light : "#fff"}
                          mt={3}
                          w={336}
                          h={"96px"}
                        >
                          <Box
                            alignSelf={"center"}
                            w={"64px"}
                            h={"64px"}
                            bg={theme.colors.brown_super_light}
                            borderRadius={"32"}
                            alignItems={"center"}
                            justifyContent={"center"}
                          >
                            <FeedStockIconRender
                              icon={
                                feedstockIcons[
                                  item.name as keyof typeof feedstockIcons
                                ]
                              }
                              width={45}
                              height={45}
                            />
                          </Box>
                          <Text
                            marginLeft={"12px"}
                            fontSize={19}
                            fontFamily={theme.font.archivo_bold}
                            alignSelf={"center"}
                          >
                            {item.name}
                          </Text>
                        </Pressable>
                      </Animatable.View>
                    );
                  }}
                />
              )}
            </View>
          )}

          {formPage === 2 && (
            <View style={{ marginBottom: 26 }}>
              <View
                style={{
                  marginBottom: 40,
                  marginTop: 3,
                  height: 500,
                  alignItems: "center",
                }}
              >
                <FlatList
                  data={helpersFromDb}
                  extraData={renderListAgain}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={() => (
                    <Box mt={10}>
                      <Text
                        fontFamily={theme.font.basicSans_bold}
                        fontSize={18}
                      >
                        Não existem ajudantes cadastrados.
                      </Text>
                    </Box>
                  )}
                  contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
                  renderItem={({ item }) => {
                    const isSelected = helpersSelected.includes(item.id);

                    return (
                      <Animatable.View animation={"fadeInUp"}>
                        <Pressable
                          onPress={() => {
                            if (isSelected) {
                              let index = helpersSelected.indexOf(item.id);
                              let filteredArray = helpersSelected;
                              filteredArray.splice(index, 1);
                              setHelpersSelected(filteredArray);
                              setRenderListAgain(!renderListAgain);
                            } else {
                              let array = helpersSelected;
                              array.push(item.id);
                              setHelpersSelected(array);
                              setRenderListAgain(!renderListAgain);
                            }
                          }}
                          flexDirection={"row"}
                          px={4}
                          borderWidth={1}
                          borderRadius={10}
                          borderColor={
                            isSelected
                              ? theme.colors.green_dark
                              : theme.colors.grayscale[100]
                          }
                          bg={isSelected ? theme.colors.green_light : "#fff"}
                          mt={3}
                          w={336}
                          h={"96px"}
                        >
                          <View
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                              backgroundColor: theme.colors.grayscale[300],
                              alignSelf: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon name="person" size={36} />
                          </View>
                          <Text
                            marginLeft={"12px"}
                            fontSize={19}
                            fontFamily={theme.font.archivo_bold}
                            alignSelf={"center"}
                          >
                            {item.name}
                          </Text>
                        </Pressable>
                      </Animatable.View>
                    );
                  }}
                />
              </View>

              {/* <PlusButton
                greenButton
                title="Novo ajudante"
                onPress={() => {}}
              /> */}
            </View>
          )}

          {formPage === 3 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={materialsFromDB}
              automaticallyAdjustKeyboardInsets={true}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 96 }}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <HStack
                      style={{
                        width: 336,
                        height: 96,
                        paddingHorizontal: 16,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderColor: theme.colors.green_light,
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                      space={3}
                      justifyContent={"space-between"}
                      marginY={1}
                    >
                      <View
                        style={{
                          width: 49,
                          height: 49,
                          borderRadius: 24.5,
                          backgroundColor: "brown",
                          alignSelf: "center",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconMaterial />
                      </View>
                      <VStack flex={1} justifyContent={"center"}>
                        <Text
                          fontFamily={theme.font.archivo_bold}
                          fontSize={19}
                          color={theme.colors.grayscale[900]}
                          numberOfLines={2}
                        >
                          {item.label}
                        </Text>
                        <Text
                          fontFamily={theme.font.basicSans_regular}
                          fontSize={19}
                        >
                          R$ {item.unitPrice}
                        </Text>
                      </VStack>

                      <Box alignItems={"center"} justifyContent={"center"}>
                        <Input
                          placeholder="0"
                          borderWidth={0}
                          width={70}
                          placeholderTextColor={"#000"}
                          height={60}
                          fontSize={32}
                          textAlign={"center"}
                          padding={0}
                          keyboardType="numeric"
                          returnKeyType="done"
                          fontFamily={theme.font.bernhard_bold}
                          textDecorationLine={"underline"}
                          value={materialsSelected[index].qtd}
                          onChangeText={(text) => {
                            const newArr = materialsSelected.map((obj) => {
                              if (obj.name === item.name) {
                                obj.qtd = text;
                              }

                              return obj;
                            });

                            setMaterialsSelected(newArr);
                          }}
                        />
                      </Box>
                    </HStack>
                    <Text
                      fontFamily={theme.font.basicSans_regular}
                      fontSize={17}
                      color={theme.colors.grayscale[500]}
                      marginLeft={"10px"}
                      marginBottom={3}
                    >
                      Depreciação por dia: R${" "}
                      {item.depreciationPerDay!.toFixed(3)}
                    </Text>
                  </>
                );
              }}
            />
          )}

          {formPage === 4 && (
            <Box>
              <HStack
                style={{
                  width: 336,
                  height: 96,
                  borderWidth: 3,
                  borderRadius: 10,
                  borderColor: theme.colors.green_light,
                  alignSelf: "center",
                }}
                space={3}
                justifyContent={"space-between"}
                marginY={1}
              >
                <TouchableOpacity
                  onPress={() => openModal("Rancho")}
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      width: 49,
                      height: 49,
                      borderRadius: 24.5,
                      backgroundColor: theme.colors.green_dark,
                      alignSelf: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Rancho />
                  </View>
                  <VStack justifyContent={"center"} paddingLeft={2}>
                    <Text fontFamily={theme.font.basicSans_bold} fontSize={19}>
                      Rancho
                    </Text>
                    <Text
                      fontFamily={theme.font.basicSans_regular}
                      fontSize={17}
                    >
                      R$ {foodSpending}
                    </Text>
                  </VStack>
                </TouchableOpacity>
              </HStack>
              <HStack
                style={{
                  width: 336,
                  height: 96,
                  borderWidth: 3,
                  borderRadius: 10,
                  borderColor: theme.colors.green_light,
                  alignSelf: "center",
                }}
                space={3}
                justifyContent={"space-between"}
                marginY={1}
              >
                <TouchableOpacity
                  onPress={() => openModal("Transporte")}
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    paddingHorizontal: 16,
                  }}
                >
                  <View
                    style={{
                      width: 49,
                      height: 49,
                      borderRadius: 24.5,
                      backgroundColor: theme.colors.green_dark,
                      alignSelf: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Boat />
                  </View>
                  <VStack justifyContent={"center"} paddingLeft={2}>
                    <Text fontFamily={theme.font.basicSans_bold} fontSize={19}>
                      Transporte
                    </Text>
                    <Text
                      fontFamily={theme.font.basicSans_regular}
                      fontSize={17}
                    >
                      R$ {transportTotalSpending}
                    </Text>
                  </VStack>
                </TouchableOpacity>
              </HStack>

              <VStack ml={3}>
                <Text>Barco: R$ {boatSpending}</Text>
                <Text>Rabeta: R$ {rabetaSpending}</Text>
                <Text>Balsa: R$ {balsaSpending}</Text>
                <Text>Outros: R$ {otherSpending}</Text>
              </VStack>

              <Box alignItems={"center"} mt={6}>
                <Text
                  fontFamily={theme.font.basicSans_bold}
                  fontSize={19}
                  color={theme.colors.green_dark}
                >
                  Total: R$ {totalSpending}
                </Text>
              </Box>
            </Box>
          )}

          {formPage === 5 && (
            <Animatable.View animation={"fadeInUp"}>
              <Box alignItems={"center"}>
                <Text fontFamily={theme.font.bernhard_bold} fontSize={23}>
                  Dados iniciais
                </Text>
              </Box>

              <VStack>
                <Box my={3}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[900]}
                  >
                    Matéria-prima
                  </Text>
                  <Text
                    borderWidth={1}
                    padding={3}
                    borderRadius={16}
                    borderColor={theme.colors.grayscale[100]}
                    color={theme.colors.grayscale[900]}
                    fontFamily={theme.font.bernhard_regular}
                    fontSize={22}
                  >
                    {feedstock?.name ? feedstock?.name : "Não selecionada"}
                  </Text>
                </Box>
                <Box my={3}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[900]}
                  >
                    Ajudantes
                  </Text>
                  <Text
                    borderWidth={1}
                    padding={3}
                    borderRadius={16}
                    borderColor={theme.colors.grayscale[100]}
                    color={theme.colors.grayscale[900]}
                    fontFamily={theme.font.bernhard_regular}
                    fontSize={22}
                  >
                    {helpersSelected.length !== 0
                      ? helpersFromDb?.map((item) => {
                          if (helpersSelected.includes(item.id)) {
                            return item.name + ", ";
                          }
                        })
                      : "Nenhum selecionado"}
                  </Text>
                </Box>
                <Box my={3}>
                  <Text
                    fontFamily={theme.font.basicSans_regular}
                    fontSize={17}
                    color={theme.colors.grayscale[900]}
                  >
                    Gastos iniciais
                  </Text>
                  <VStack
                    mt={4}
                    borderWidth={1}
                    padding={3}
                    borderRadius={16}
                    borderColor={theme.colors.grayscale[100]}
                  >
                    <HStack
                      my={1}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Text
                        fontFamily={theme.font.basicSans_regular}
                        fontSize={17}
                      >
                        Rancho
                      </Text>
                      <Text>R$ {foodSpending}</Text>
                    </HStack>
                    <HStack
                      my={1}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Text
                        fontFamily={theme.font.basicSans_regular}
                        fontSize={17}
                      >
                        Transporte
                      </Text>
                      <Text textAlign={"center"}>
                        R$ {transportTotalSpending}
                      </Text>
                    </HStack>
                    <HStack
                      my={1}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Text
                        fontFamily={theme.font.basicSans_regular}
                        fontSize={17}
                      >
                        Total
                      </Text>
                      <Text>R$ {totalSpending}</Text>
                    </HStack>
                    <HStack
                      my={1}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Text
                        fontFamily={theme.font.basicSans_regular}
                        fontSize={17}
                      >
                        Gastos com material por dia
                      </Text>
                      <Text>R$ {getTotalDepreciation(materialsSelected)}</Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Animatable.View>
          )}

          {!keyboardOpen && (
            <HStack
              justifyContent={"center"}
              space={3}
              mb={30}
              position={"absolute"}
              bottom={0}
              left={"50%"}
              right={"50%"}
            >
              <Button title="Voltar" onPress={handlePrevFormPages} backButton />
              <Button
                title={formPage !== 5 ? "Continuar" : "Iniciar coleta"}
                onPress={handleNextFormPages}
                disabled={formPage === 5 && !feedstock?.name}
              />
            </HStack>
          )}
        </Box>
      </Gradient>

      <BottomSheet
        backdropComponent={BottomSheetBackdrop}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", bottomSheetTitle === "Rancho" ? "30%" : "50%"]}
      >
        {bottomSheetTitle === "Rancho" ? (
          <VStack alignItems={"center"}>
            <Text
              fontSize={30}
              fontFamily={theme.font.bernhard_regular}
              color={theme.colors.grayscale[900]}
            >
              Gastos com Rancho
            </Text>
            <Box w={"90%"} alignItems={"center"} borderBottomWidth={1} mt={3}>
              <CurrencyInput
                style={{ fontSize: 25 }}
                onSubmitEditing={() => bottomSheetRef.current?.close()}
                keyboardType="numeric"
                returnKeyType="done"
                prefix="R$"
                delimiter="."
                separator=","
                precision={2}
                minValue={0}
                renderTextInput={(props) => <BottomSheetTextInput {...props} />}
                value={foodSpending}
                onChangeValue={(text) => {
                  setFoodSpending(text ?? 0);
                }}
              />
            </Box>
          </VStack>
        ) : (
          <VStack pt={"12px"}>
            <Box alignSelf={"center"}>
              <Text
                fontFamily={theme.font.bernhard_regular}
                fontSize={32}
                color={theme.colors.grayscale[900]}
              >
                Escolha seu meio
              </Text>
            </Box>
            {transportButtons.map((item) => (
              <TouchableOpacity
                onPress={() => openModalInput(item.title)}
                key={item.value}
                style={{
                  width: 130,
                  height: 50,
                  borderRadius: 16,
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  backgroundColor: theme.colors.green_light,
                  marginVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  fontFamily={theme.font.basicSans_bold}
                  fontSize={19}
                  color={theme.colors.grayscale[900]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </VStack>
        )}
      </BottomSheet>
    </View>
  );
}
