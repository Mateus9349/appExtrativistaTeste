import React, { useContext, useRef, useEffect, useState } from "react";
import {
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
  Linking,
} from "react-native";
import {
  Box,
  FlatList,
  HStack,
  Modal,
  Pressable,
  Text,
  VStack,
} from "native-base";
import { Header } from "../../components/Header";
import { Gradient } from "../../components/Gradient";
import Logo from "../../../assets/logoBrownDark.svg";
import { theme } from "../../../utils/theme";
import * as Animatable from "react-native-animatable";
import { FontAwesome5 as Icon } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { Button } from "../../components/Button";
import { moveToRight } from "../../../utils/animations";
import { PlusButton } from "../../components/PlusButton";
import { pdfData } from "../../../utils/pdfsData";
import { Alert } from "react-native";
import moment from "moment";

interface PDF {
  title: string;
  uri: string;
}

export function Profile() {
  const { user, signOut } = useContext(AuthContext);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const downloadPdf = async (item: PDF) => {
    const suported = await Linking.canOpenURL(item.uri);

    console.log("suported?", suported);

    if (suported) {
      await Linking.openURL(item.uri);
    } else {
      Alert.alert("Documento não pode ser aberto");
    }
    // if (Platform.OS === "android") {
    //   const permissions =
    //     await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    //   if (permissions.granted) {
    //     const base64 = await FileSystem.readAsStringAsync(item.uri, {
    //       encoding: FileSystem.EncodingType.Base64,
    //     });
    //     await FileSystem.StorageAccessFramework.createFileAsync(
    //       permissions.directoryUri,
    //       item.title,
    //       "pdf"
    //     );
    //   }
    // }

    // try {
    //   await FileSystem.downloadAsync(item.uri, FileSystem.documentDirectory!)
    //     .then((r) => {
    //       console.log(r);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const whiteHeaderStyle: ViewStyle = {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 26,
  };

  return (
    <Box flex={1} bg={"#fff"}>
      <Modal isOpen={isOpenModal}>
        <Box flex={1} bg={"#Fff"} w={"100%"}>
          <Header headerType="green" title="Biblioteca" />

          <Box pb={20}>
            <FlatList
              data={pdfData}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                paddingBottom: 140,
                paddingTop: 16,
              }}
              renderItem={({ item }) => (
                <Pressable onPress={() => downloadPdf(item)}>
                  {({ isPressed }) => (
                    <Box
                      width={336}
                      height={90}
                      bg={isPressed ? theme.colors.green_light : "#Fff"}
                      borderColor={theme.colors.green_light}
                      borderWidth={1}
                      borderRadius={10}
                      my={3}
                      justifyContent={"center"}
                      p={3}
                    >
                      <Text
                        fontFamily={theme.font.basicSans_bold}
                        fontSize={19}
                        color={theme.colors.grayscale[900]}
                      >
                        {item.title}
                      </Text>
                    </Box>
                  )}
                </Pressable>
              )}
            />
          </Box>

          <Button
            style={{ position: "absolute", bottom: 16, alignSelf: "center" }}
            title="Voltar"
            onPress={() => setIsOpenModal(false)}
          />
        </Box>
      </Modal>

      <HStack
        bg={"#fff"}
        h={140}
        borderBottomLeftRadius={20}
        borderBottomRightRadius={20}
        shadow={3}
      >
        <Gradient style={whiteHeaderStyle} gradientColor={"white"}>
          <HStack alignItems={"center"}>
            <VStack w={150} maxW={150} mr={3}>
              <Animatable.Text
                animation={"fadeInRight"}
                duration={1500}
                style={{
                  color: theme.colors.brown_dark,
                  textAlign: "left",
                  fontSize: 27,
                  fontFamily: theme.font.bernhard_bold,
                }}
              >
                Meu perfil
              </Animatable.Text>
            </VStack>
          </HStack>
          <Animatable.View animation={moveToRight(-250, 10)} duration={1200}>
            <Logo width={74} height={40} fill={theme.colors.brown_dark} />
          </Animatable.View>
        </Gradient>
      </HStack>

      <Box paddingTop={6} alignItems={"center"}>
        <VStack
          alignItems={"center"}
          bg={theme.colors.orange}
          w={"96px"}
          h={"96px"}
          alignSelf={"center"}
          borderRadius={48}
          justifyContent={"center"}
        >
          <Icon name="user-alt" size={39} color={"#fff"} />
        </VStack>
        <Text fontFamily={theme.font.bernhard_bold} fontSize={22} mt={2}>
          {user?.nome}
        </Text>
        <Text fontFamily={theme.font.basicSans_regular} mt={5} fontSize={17}>
          Entrou em {moment(user?.createdAt).format("DD/MM/YYYY")}
        </Text>
      </Box>

      <Box mt={16}>
        <PlusButton
          onPress={() => {
            setIsOpenModal(true);
          }}
          title="Acessar biblioteca"
          iconName="book"
        />
      </Box>

      <Box position={"absolute"} bottom={10} alignSelf={"center"}>
        <Button onPress={signOut} title="Sair da conta" redButton />
      </Box>
    </Box>
  );
}
