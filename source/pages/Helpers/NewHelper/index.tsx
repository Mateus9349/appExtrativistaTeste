import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { HelperStackParams } from "..";
import {
  Box,
  HStack,
  Pressable,
  VStack,
  Text,
  ScrollView,
  Modal,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../../../components/Header";
import { Ionicons as Icon } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { InputWithNameAbove } from "../../../components/InputWithNameAbove";
import { theme } from "../../../../utils/theme";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import DatePicker from "react-native-modern-datepicker";
// import DatePickerExpo from "expo-datepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dimensions, TextInput } from "react-native";
import { Button } from "../../../components/Button";
import { Person } from "../../../../models/Person";
import moment from "moment";

type helperScreenProp = NativeStackNavigationProp<
  HelperStackParams,
  "NewHelper"
>;

type DateType = {
  Date: {
    date: Date;
  };
};

export function NewHelper() {
  const navigation = useNavigation<helperScreenProp>();

  const [date, setDate] = useState<string | null>(null);
  const [openDateModal, setOpenDateModal] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [cpf, setCPF] = useState("");
  const [address, setAddress] = useState("");

  const saveHelper = async () => {
    try {
      await Person.create({
        name: name,
        surname: surname,
        ssn: cpf,
        address: address,
        birthDate: date,
        created_at: moment(new Date()).toISOString(true),
      });

      navigation.goBack();
    } catch (error) {
      console.log("Erro ao cadastrar ajudante -> ", error);
    }
  };

  const handleDate = (date: Date) => {
    setDate(moment(date).format("DD/MM/YYYY"));
    setOpenDateModal(false);
    console.log(date);
  };
  navigation.addListener("focus", () => {
    navigation
      .getParent()
      ?.setOptions({ tabBarStyle: { height: 0, display: "none" } });
  });
  return (
    <>
      <Box flex={1} bg={"#fff"}>
        <Header headerType="green" title="Novo ajudante" />

        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          <Box alignSelf={"center"} mt={16} mb={6}>
            <Icon name="person" size={62} />
          </Box>

          <VStack>
            <Box my={2}>
              <VStack mx={3}>
                <Text fontFamily={theme.font.basicSans_regular} mb={2}>
                  Nome *
                </Text>
                <Box h={50} px={2}>
                  <TextInput
                    placeholder="Nome completo"
                    value={name}
                    onChangeText={(text) => setName(text)}
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
                    value={surname}
                    onChangeText={(text) => setSurname(text)}
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
            <Pressable mx={8} my={6} onPress={() => setOpenDateModal(true)}>
              {({ isPressed }) => (
                <>
                  <HStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    borderRadius={16}
                    px={3}
                    bg={isPressed ? "#fff" : theme.colors.grayscale[100]}
                    height={"56px"}
                  >
                    <DateTimePickerModal
                      isVisible={openDateModal}
                      mode="date"
                      onConfirm={(date) => handleDate(date)}
                      onChange={(date) => handleDate(date)}
                      onCancel={() => setOpenDateModal(false)}
                    />
                    <Text
                      fontFamily={theme.font.basicSans_regular}
                      fontSize={17}
                      alignSelf={"center"}
                    >
                      {date ? date : "Data de nascimento"}
                    </Text>

                    {/* <HStack justifyContent={"center"} alignItems={"center"}> */}
                    {/* <DateTimePicker
                        onTouchCancel={() => setOpenDateModal(false)}
                        value={date}
                        display="calendar"
                        mode="date"
                        is24Hour={true}
                        onChange={(event, date) => setDate(date ?? new Date())}
                      /> */}
                    {/* </HStack> */}
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
                value={cpf}
                onChangeText={(text, rawText) => setCPF(rawText)}
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
                    value={address}
                    onChangeText={(text) => setAddress(text)}
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

          <HStack my={16} justifyContent={"center"}>
            <Button
              style={{ marginRight: 16 }}
              title="Cancelar"
              onPress={() => navigation.goBack()}
              backButton
            />
            <Button title="Cadastrar" onPress={saveHelper} />
          </HStack>
        </ScrollView>
      </Box>
    </>
  );
}
