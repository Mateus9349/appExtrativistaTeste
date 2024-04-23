import React, { useState, useRef, useEffect, useContext } from "react";
import { Platform, ScrollView } from "react-native";
import { Header } from "../../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FieldStackParams } from "..";
import { ProductVisualizer } from "../../../components/ProductVisualizer";
import {
  Box,
  HStack,
  Input,
  KeyboardAvoidingView,
  Pressable,
  Radio,
  Switch,
  Text,
  VStack,
} from "native-base";
import { ButtonWithBottomIcon } from "../../../components/ButtonWithBottomIcon";
import { theme } from "../../../../utils/theme";
import {
  FontAwesome5 as FIcon,
  Foundation as FoundIcon,
  MaterialIcons as MIIcon,
} from "@expo/vector-icons";
import { HorizontalInput } from "../../../components/HorizontalInput";
import { Button } from "../../../components/Button";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { CustomPicker } from "../../../components/CustomPicker";

import * as Location from "expo-location";
import { ActivityIndicator } from "react-native";
import { CollectInProgressContext } from "../../../contexts/CollectInProgressContext";
import { SingleCollect } from "../../../../models/SingleCollect";
import moment from "moment";
import { CustomAlert } from "../../../components/CustomAlert";
import { AuthContext } from "../../../contexts/AuthContext";

type fieldScreenProp = NativeStackNavigationProp<
  FieldStackParams,
  "ExtractionInField"
>;

// MUDAR PRA CIRCUNFERENCIA EM CM

export function ExtractionInField() {
  const navigation = useNavigation<fieldScreenProp>();
  const { collectInProgress, feedstockInCollect } = useContext(
    CollectInProgressContext
  );
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [loading, setLoading] = useState(false);
  const [loadingInDb, setLoadingInDb] = useState(false);
  const [error, setError] = useState(false);

  const [quantity, setQuantity] = useState("");

  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  const [treeHeight, setTreeHeight] = useState("");
  const [treeCircunference, setTreeCircunference] = useState("");
  const [treeQuantity, setTreeQuantity] = useState("");

  const [weather, setWeather] = useState("");
  const [ground, setGround] = useState("");
  const [observations, setObservations] = useState("");

  const openModal = () => {
    bottomSheetRef.current?.expand();
  };

  const closeError = () => {
    setError(false);
  };

  const getCoords = async () => {
    setLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
    setLoading(false);
  };

  // TROCAR PARA PERÍODO CLIMATICO, APENAS SECO E CHUVOSO
  const dataWeather = [
    { label: "Seco", value: "seco" },
    { label: "Chuvoso", value: "chuvoso" },
  ];

  const dataGround = [
    { label: "Seco", value: "seco" },
    { label: "Úmido", value: "umido" },
    { label: "Alagado", value: "alagado" },
  ];

  const saveExtraction = async () => {
    setLoadingInDb(true);
    try {
      await SingleCollect.create({
        collectId: collectInProgress?.id,
        feedstockId: feedstockInCollect?.id,
        userIdCreated: user?.id,
        quantity: parseFloat(quantity),
        coord: JSON.stringify([latitude, longitude]),
        amountOfTree: treeQuantity === "" ? 1 : parseInt(treeQuantity),
        treeHeight: treeHeight === "" ? null : parseFloat(treeHeight),
        treeCircumference:
          treeCircunference === "" ? null : parseFloat(treeCircunference),
        weatherConditions: weather === "" ? null : weather,
        groundConditions: ground === "" ? null : ground,
        observations: observations === "" ? null : observations,
        created_at: moment(new Date()).toISOString(true),
      });
      navigation.goBack();
    } catch (error) {
      setError(true);
      console.log("Error ao cadastrar extração -> ", error);
    }

    setLoadingInDb(false);
  };

  const getTitle = async () => {
    const extractionQuantity = await SingleCollect.findAndCountAll({
      where: {
        collectId: collectInProgress?.id!,
        userIdCreated: user?.id as string,
      },
    });
    setTitle(extractionQuantity.count + 1);
  };

  navigation.addListener("focus", () => {
    navigation
      .getParent()
      ?.setOptions({ tabBarStyle: { height: 0, display: "none" } });
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
    })();
    getTitle();
  }, []);

  // MUDAR A QUANTIDADE PRO FINAL E COLOCAR "QUANTIDADE COLETADA"

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 46 }}
          showsVerticalScrollIndicator={false}
        >
          {/* <CustomAlert
            sucess={false}
            title="Erro ao cadastrar as informações, revise os dados"
            visible={error}
            closeAlert={closeError}
          /> */}
          <Header headerType="green" title={`Ponto de coleta ${title}`} />

          <Box alignItems={"center"} my={6}>
            <ProductVisualizer feedstockData={feedstockInCollect!} />
          </Box>

          <Box alignItems={"center"} mx={1}>
            <Text
              fontSize={19}
              fontFamily={theme.font.basicSans_bold}
              lineHeight={24}
              my={"24px"}
            >
              Coordenadas
            </Text>

            {latitude !== null && longitude !== null ? (
              <Pressable flexDirection={"row"} onPress={openModal}>
                {({ isPressed }) => {
                  return (
                    <HStack
                      w={336}
                      bg={
                        isPressed
                          ? theme.colors.green_regular
                          : theme.colors.green_light
                      }
                      h={"80px"}
                      paddingY={"24px"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      borderColor={theme.colors.green_dark}
                      borderWidth={3}
                      borderRadius={10}
                    >
                      <FIcon
                        name="map-marker-alt"
                        color={theme.colors.green_dark}
                        size={19}
                        style={{ position: "absolute", left: 31 }}
                      />
                      <VStack>
                        <Text
                          fontFamily={theme.font.basicSans_bold}
                          fontSize={19}
                          color={theme.colors.green_dark}
                        >
                          {latitude + ", "}
                        </Text>
                        <Text
                          fontFamily={theme.font.basicSans_bold}
                          fontSize={19}
                          color={theme.colors.green_dark}
                        >
                          {longitude}
                        </Text>
                      </VStack>
                    </HStack>
                  );
                }}
              </Pressable>
            ) : (
              <HStack>
                {loading ? (
                  <Box
                    w={164}
                    h={"80px"}
                    borderRadius={16}
                    alignItems={"center"}
                    justifyContent={"center"}
                    bg={theme.colors.green_dark}
                    flex={1}
                    mx={2}
                  >
                    <ActivityIndicator size="large" color={"#fff"} />
                  </Box>
                ) : (
                  <ButtonWithBottomIcon
                    onPress={getCoords}
                    buttonColor={theme.colors.green_dark}
                    icon="map-marker-alt"
                    title="Usar GPS"
                  />
                )}
                <ButtonWithBottomIcon
                  onPress={openModal}
                  buttonColor={theme.colors.green_light}
                  icon="pencil-alt"
                  title="Inserir à mão"
                />
              </HStack>
            )}
          </Box>
          {/* <HStack mt={10} justifyContent={"center"} alignItems={"center"}>
            <FIcon size={30} name="balance-scale" />
            <Text
              ml={3}
              fontSize={19}
              fontFamily={theme.font.basicSans_regular}
            >
              Medida:{" "}
            </Text>
            <Text
              fontSize={19}
              color={theme.colors.grayscale[900]}
              fontFamily={theme.font.basicSans_bold}
            >
              kg
            </Text>
          </HStack> */}

          <HStack
            justifyContent={"space-around"}
            paddingX={6}
            paddingY={3}
            width={"100%"}
            alignSelf={"center"}
            mt={6}
            alignItems={"center"}
          >
            {feedstockInCollect?.category === "isolada" ? (
              <Box alignItems={"center"} w={120}>
                <FIcon name="tree" size={26} />
                <Text fontSize={19} fontFamily={theme.font.basicSans_bold}>
                  Árvore única
                </Text>
              </Box>
            ) : (
              <Box alignItems={"center"} w={120}>
                <FoundIcon name="trees" size={28} />
                <Text fontSize={19} fontFamily={theme.font.basicSans_bold}>
                  Grupo
                </Text>
              </Box>
            )}
          </HStack>

          <VStack>
            {feedstockInCollect?.category === "isolada" ? (
              <>
                <HorizontalInput
                  label="Altura (m)"
                  keyboardType="numeric"
                  returnKeyType="done"
                  value={treeHeight}
                  onChangeText={(text, rawText) => setTreeHeight(rawText)}
                  Icon={() => <MIIcon name="height" size={24} />}
                />
                <HorizontalInput
                  label="Circunferência (cm)"
                  keyboardType="numeric"
                  returnKeyType="done"
                  value={treeCircunference}
                  onChangeText={(text, rawText) =>
                    setTreeCircunference(rawText)
                  }
                  Icon={() => <FIcon name="tape" size={24} />}
                />
              </>
            ) : (
              <HorizontalInput
                label="Quantidade de árvores"
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={(text, rawText) => setTreeQuantity(rawText)}
                value={treeQuantity}
                Icon={() => <FoundIcon name="trees" size={24} />}
              />
            )}
          </VStack>

          <HorizontalInput
            Icon={() => <FIcon name="box-open" size={30} />}
            label="Peso estimado (kg)"
            onChangeText={(text, rawText) => {
              setQuantity(rawText);
            }}
            value={quantity}
            keyboardType="numeric"
            type="numeric"
            returnKeyType="done"
          />

          <Box paddingX={"20px"} mt={"24px"} mb={"76px"}>
            <Text
              fontFamily={theme.font.basicSans_bold}
              fontSize={19}
              color={theme.colors.grayscale[900]}
            >
              Observações
            </Text>
            <Input
              width={"100%"}
              value={observations}
              onChangeText={setObservations}
              placeholder="Escreva aqui"
              fontSize={15}
              multiline
              borderRadius={20}
              height={112}
              mt={"16px"}
              returnKeyType="done"
            />
          </Box>

          <Box paddingX={4}>
            <Text fontFamily={theme.font.basicSans_bold} fontSize={19}>
              Período Climático
            </Text>
            <Radio.Group
              name="weather"
              value={weather}
              onChange={(item) => {
                if (item === weather) setWeather("");
                setWeather(item);
              }}
            >
              {dataWeather.map((item) => {
                return (
                  <Radio key={item.value} my={1} value={item.value}>
                    {item.label}
                  </Radio>
                );
              })}
            </Radio.Group>

            <Text fontFamily={theme.font.basicSans_bold} fontSize={19} mt={4}>
              Condições do solo
            </Text>
            <Radio.Group
              name="ground"
              value={ground}
              onChange={(item) => {
                if (item === ground) setGround("");
                setGround(item);
              }}
            >
              {dataGround.map((item) => {
                return (
                  <Radio key={item.value} my={1} value={item.value}>
                    {item.label}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Box>

          <HStack justifyContent={"center"}>
            <Button
              onPress={() => navigation.goBack()}
              title="Cancelar"
              backButton
              style={{ marginTop: 26, marginHorizontal: 16 }}
            />
            {loadingInDb ? (
              <Box
                width={133}
                height={"48px"}
                bg={theme.colors.green_dark}
                justifyContent={"center"}
                borderRadius={16}
                marginTop={26}
              >
                <ActivityIndicator size={"small"} color={"#fff"} />
              </Box>
            ) : (
              <Button
                onPress={saveExtraction}
                disabled={
                  quantity === "" || latitude === null || longitude === null
                }
                title="Confirmar"
                style={{ marginTop: 26, marginHorizontal: 16 }}
              />
            )}
          </HStack>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheet
        backdropComponent={BottomSheetBackdrop}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", "40%"]}
        keyboardBehavior="interactive"
      >
        <Box alignItems={"center"}>
          <Box
            w={"60px"}
            h={"60px"}
            borderRadius={30}
            bg={theme.colors.green_light}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <FIcon
              style={{ alignSelf: "center" }}
              name={"pencil-alt"}
              color={"#000"}
              size={30}
            />
          </Box>
          <Text
            fontFamily={theme.font.basicSans_bold}
            fontSize={19}
            color={theme.colors.green_dark}
          >
            Inserir coordenadas
          </Text>
        </Box>

        <VStack>
          <VStack paddingX={4} my={3}>
            <Text fontSize={13} fontFamily={theme.font.basicSans_bold}>
              Latitude:
            </Text>
            <BottomSheetTextInput
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              placeholder="Latitude"
              value={latitude!}
              onChangeText={setLatitude}
              style={{
                width: 270,
                alignSelf: "center",
                fontSize: 26,
                borderBottomWidth: 1,
                textAlign: "center",
              }}
            />
          </VStack>
          <VStack paddingX={4} my={3}>
            <Text fontSize={13} fontFamily={theme.font.basicSans_bold}>
              Longitude:
            </Text>
            <BottomSheetTextInput
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              onSubmitEditing={() => bottomSheetRef.current?.close()}
              placeholder="Longitude"
              value={longitude!}
              onChangeText={setLongitude}
              style={{
                width: 270,
                alignSelf: "center",
                fontSize: 26,
                borderBottomWidth: 1,
                textAlign: "center",
              }}
            />
          </VStack>
        </VStack>
      </BottomSheet>
    </>
  );
}
