import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Header } from "../../../components/Header";
import { Box, FlatList, HStack, Pressable, Text, VStack } from "native-base";
import { PlusButton } from "../../../components/PlusButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HelperStackParams } from "..";
import { theme } from "../../../../utils/theme";
import { Person, PersonType } from "../../../../models/Person";
import { Ionicons as Icon } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../../components/Button";
import moment from "moment";
import { InputWithNameAbove } from "../../../components/InputWithNameAbove";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from "react-native-animatable";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type helperScreenProp = NativeStackNavigationProp<
  HelperStackParams,
  "HelpersHome"
>;

{
  /* <Animatable.Text
          animation={"fadeIn"}
          adjustsFontSizeToFit={true}
          allowFontScaling={true}
          style={{
            color: theme.colors.green_dark,
            fontFamily: theme.font.bernhard_bold,
            fontSize: 30,
          }}
        >
          R$ {comercialBalance}
        </Animatable.Text> */
}

export function HelpersHome() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation<helperScreenProp>();
  const [helpersInDb, setHelpersInDb] = useState<PersonType[] | null>(null);
  const [helperSelected, setHelperSelected] = useState<PersonType | null>(null);
  const [editedHelper, setEditedHelper] = useState<PersonType | null>(null);

  const [editMode, setEdiMode] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [cpf, setCPF] = useState("");
  const [address, setAddress] = useState("");

  const [openDateModal, setOpenDateModal] = useState(false);
  const [date, setDate] = useState<string | null>();

  const openBottomSheet = (helper: PersonType) => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    setHelperSelected(helper);
    bottomSheetRef.current?.expand();
  };

  const handleNewDate = (date: Date) => {
    setDate(moment(date).format("DD/MM/YYYY"));
    setOpenDateModal(false);
  };

  const deleteHelper = async () => {
    await Person.update(
      {
        deleted_at: moment(new Date()).toISOString(true),
      },
      {
        where: {
          id: helperSelected?.id!,
        },
      }
    );

    bottomSheetRef.current?.close();
    getHelpers();
  };

  const editHelper = async () => {
    try {
      await Person.update(
        {
          name: editedHelper?.name!,
          surname: editedHelper?.surname!,
          address: editedHelper?.address!,
          birthDate:
            date === ""
              ? moment(editedHelper?.birthDate!).format("DD/MM/YYYY")
              : date,
          updated_at: moment(new Date()).toISOString(true),
        },
        {
          where: {
            id: editedHelper?.id!,
          },
        }
      );
    } catch (error) {
      console.log("Update person error -> ", error);
    }

    setEdiMode(false);
    bottomSheetRef.current?.close();
    getHelpers();
    console.log("Edit -> ", editedHelper);
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
    setHelperSelected(null);
    setEdiMode(false);
    setEditedHelper(null);
  };

  navigation.addListener("focus", () => {
    makeBottomTabNavAppear();
    getHelpers();
  });

  const getHelpers = async () => {
    const helpers: PersonType[] = await Person.findAll({
      where: {
        deleted_at: null,
      },
      order: [["created_at", "DESC"]],
    });

    if (!helpers) return;

    setHelpersInDb(helpers);
  };

  useEffect(() => {
    getHelpers();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header goToProfileScreen={() => navigation.navigate("Profile")} />
      <Box px={"20px"} pt={"16px"}>
        <Text fontFamily={theme.font.bernhard_bold} fontSize={32}>
          Ajudantes
        </Text>
      </Box>

      <Box my={10}>
        <PlusButton
          title="Novo ajudante"
          onPress={() => navigation.navigate("NewHelper")}
        />
      </Box>

      <Box h={400}>
        <FlatList
          data={helpersInDb}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Box alignItems={"center"} pt={10}>
              <Text fontSize={17} fontFamily={theme.font.basicSans_bold}>
                Não possuem ajudantes cadastrados.
              </Text>
            </Box>
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 36 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => openBottomSheet(item)}>
              {({ isPressed }) => (
                <Animatable.View animation={"fadeInLeft"} duration={1000}>
                  <HStack
                    pb={2}
                    borderRadius={10}
                    px={1}
                    pt={2}
                    my={4}
                    borderBottomWidth={1}
                    bg={isPressed ? theme.colors.grayscale[100] : "#fff"}
                  >
                    <Box
                      w={"64px"}
                      h={"64px"}
                      bg={theme.colors.green_light}
                      borderRadius={32}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Icon name="person" size={36} />
                    </Box>
                    <VStack justifyContent={"center"} pl={3}>
                      <Text
                        fontSize={19}
                        fontFamily={theme.font.basicSans_bold}
                      >
                        {item.name}
                      </Text>
                      <Text
                        fontSize={17}
                        fontFamily={theme.font.basicSans_regular}
                      >
                        {item.birthDate}
                      </Text>
                    </VStack>
                  </HStack>
                </Animatable.View>
              )}
            </Pressable>
          )}
        />
      </Box>

      {/* <Box mb={10}>
        <PlusButton
          title="Novo ajudante"
          onPress={() => navigation.navigate("NewHelper")}
        />
      </Box> */}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["20%", editMode ? "80%" : "50%"]}
        onClose={makeBottomTabNavAppear}
        backdropComponent={BottomSheetBackdrop}
        index={-1}
        enablePanDownToClose={true}
      >
        <VStack>
          <HStack justifyContent={"center"} alignItems={"center"} px={4} mb={3}>
            <Box
              w={"64px"}
              h={"64px"}
              borderRadius={32}
              justifyContent={"center"}
              alignItems={"center"}
              bg={theme.colors.green_light}
            >
              <Icon name="person" size={32} />
            </Box>
            <Text ml={5} fontFamily={theme.font.bernhard_bold} fontSize={32}>
              {helperSelected?.name.split(" ")[0]}
            </Text>
          </HStack>
          {editMode ? (
            editedHelper !== null && (
              <Box h={500}>
                <ScrollView
                  contentContainerStyle={{ paddingVertical: 16 }}
                  automaticallyAdjustKeyboardInsets={true}
                  showsVerticalScrollIndicator={false}
                >
                  <VStack>
                    <Box my={2}>
                      <VStack mx={3}>
                        <Text fontFamily={theme.font.basicSans_regular} mb={2}>
                          Nome *
                        </Text>
                        <Box h={50} px={2}>
                          <TextInput
                            placeholder="Nome completo"
                            value={editedHelper?.name}
                            onChangeText={(text) =>
                              setEditedHelper((prev) => ({
                                ...prev!,
                                name: text,
                              }))
                            }
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
                    </Box>
                    <Box my={2}>
                      <VStack mx={3}>
                        <Text fontFamily={theme.font.basicSans_regular} mb={2}>
                          Apelido *
                        </Text>
                        <Box h={50} px={2}>
                          <TextInput
                            placeholder="Apelido (caso prefira)"
                            value={editedHelper?.surname}
                            onChangeText={(text) =>
                              setEditedHelper((prev) => ({
                                ...prev!,
                                surname: text,
                              }))
                            }
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
                    </Box>
                    <Pressable
                      mx={8}
                      my={6}
                      onPress={() => setOpenDateModal(true)}
                    >
                      {({ isPressed }) => (
                        <>
                          <HStack
                            justifyContent={"center"}
                            alignItems={"center"}
                            borderRadius={16}
                            px={3}
                            bg={
                              isPressed ? "#fff" : theme.colors.grayscale[100]
                            }
                            height={"56px"}
                          >
                            <Text
                              fontFamily={theme.font.basicSans_regular}
                              fontSize={17}
                              alignSelf={"center"}
                            >
                              {editedHelper.birthDate
                                ? editedHelper.birthDate
                                : "Data de nascimento"}
                            </Text>
                            <HStack
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              <DateTimePickerModal
                                isVisible={openDateModal}
                                mode="date"
                                onConfirm={(date) => handleNewDate(date)}
                                onCancel={() => setOpenDateModal(false)}
                              />
                            </HStack>
                          </HStack>
                        </>
                      )}
                    </Pressable>
                    <Box my={2}>
                      <InputWithNameAbove
                        mask="999.999.999-99"
                        placeholder="000.000.000-00"
                        keyboardType="numeric"
                        label="CPF"
                        value={helperSelected?.ssn}
                        onChangeText={(text, rawText) =>
                          setEditedHelper((prev) => ({
                            ...prev!,
                            ssn: rawText,
                          }))
                        }
                      />
                    </Box>
                    <Box my={2}>
                      <VStack mx={3}>
                        <Text fontFamily={theme.font.basicSans_regular} mb={2}>
                          Endereço *
                        </Text>
                        <Box h={50} px={2}>
                          <TextInput
                            placeholder="Ex. Rua 25, Comunidade da Barra"
                            value={editedHelper?.address}
                            onChangeText={(text) =>
                              setEditedHelper((prev) => ({
                                ...prev!,
                                address: text,
                              }))
                            }
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
                    </Box>
                  </VStack>
                </ScrollView>
              </Box>
            )
          ) : (
            <VStack
              mt={2}
              borderWidth={1}
              borderColor={theme.colors.grayscale[100]}
              p={"16px"}
              mx={3}
            >
              <HStack
                my={1}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[900]}
                  flex={1}
                >
                  Nome completo
                </Text>
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[500]}
                  flex={1.3}
                  textAlign={"right"}
                >
                  {helperSelected?.name}
                </Text>
              </HStack>
              <HStack
                my={1}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[900]}
                  flex={1}
                >
                  Apelido
                </Text>
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[500]}
                  flex={1.3}
                  textAlign={"right"}
                >
                  {helperSelected?.surname}
                </Text>
              </HStack>
              <HStack
                my={1}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[900]}
                  flex={1}
                >
                  Nascimento
                </Text>
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[500]}
                  flex={1.3}
                  textAlign={"right"}
                >
                  {helperSelected?.birthDate}
                </Text>
              </HStack>
              <HStack
                my={1}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[900]}
                  flex={1}
                >
                  CPF
                </Text>
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[500]}
                  flex={1.3}
                  textAlign={"right"}
                >
                  {helperSelected?.ssn}
                </Text>
              </HStack>
              <HStack
                my={1}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[900]}
                  flex={1}
                >
                  Endereço
                </Text>
                <Text
                  fontFamily={theme.font.basicSans_regular}
                  fontSize={17}
                  color={theme.colors.grayscale[500]}
                  flex={1.3}
                  textAlign={"right"}
                >
                  {helperSelected?.address}
                </Text>
              </HStack>
            </VStack>
          )}
        </VStack>

        {editMode ? (
          <HStack alignItems={"center"} justifyContent={"center"}>
            <Button
              title="Cancelar"
              onPress={() => setEdiMode(false)}
              redButton
            />
            <Box w={6} />
            <Button title="Salvar" onPress={editHelper} />
          </HStack>
        ) : (
          <HStack mt={10} alignItems={"center"} justifyContent={"center"}>
            <Button
              title="Editar"
              onPress={() => {
                const edit = {
                  id: helperSelected?.id!,
                  name: helperSelected?.name!,
                  surname: helperSelected?.surname!,
                  ssn: helperSelected?.ssn!,
                  address: helperSelected?.address!,
                  birthDate: helperSelected?.birthDate!,
                };
                setEditedHelper(edit);
                setEdiMode(true);
              }}
              backButton
            />
            <Box w={6} />
            <Button title="Excluir" onPress={deleteHelper} redButton />
          </HStack>
        )}
      </BottomSheet>
    </View>
  );
}
