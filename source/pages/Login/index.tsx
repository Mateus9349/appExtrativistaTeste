import React, { useContext, useState } from "react";
import { ImageBackground, TouchableOpacity, ScrollView } from "react-native";

import { styles } from "./styles";
import { CustomText } from "../../components/CustomText";
import Logo from "../../../assets/logo.svg";
import { Box, HStack, Input, View } from "native-base";
import { theme } from "../../../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../routes/AuthStackParams";
import { Button } from "../../components/Button";

import Icon from "@expo/vector-icons/FontAwesome5";
import { AuthContext } from "../../contexts/AuthContext";
import { Gradient } from "../../components/Gradient";

type authScreenProp = NativeStackNavigationProp<AuthStackParams, "Login">;

export function Login() {
  const navigation = useNavigation<authScreenProp>();
  const { login, loading } = useContext(AuthContext);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login(username, password);
  };

  return (
    <Gradient gradientColor="brown">
      <Box position="absolute" left={3} top={16} zIndex={2}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={48} color="#fff" />
        </TouchableOpacity>
      </Box>
      <Box
        h={220}
        paddingTop={12}
        alignItems="center"
        justifyContent="center"
        marginBottom={"0.5"}
      >
        <Logo width={179} height={100} />
      </Box>
      <Box
        alignItems={"center"}
        justifyContent={"center"}
        paddingX={3}
        pt={6}
        bg={"#fff"}
        flex={1}
        borderTopRadius={50}
      >
        <View w={"100%"} flex={1}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CustomText styles={styles.contentTitle}>
              Insira seus dados
            </CustomText>

            <Input
              fontSize={17}
              placeholder="CPF"
              borderRadius={"2xl"}
              keyboardType="numeric"
              marginBottom={6}
              borderWidth={0}
              bg={theme.colors.grayscale[100]}
              value={username}
              onChangeText={setUserName}
            />
            <Input
              fontSize={17}
              placeholder="Senha"
              borderRadius={"2xl"}
              marginBottom={6}
              borderWidth={0}
              bg={theme.colors.grayscale[100]}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity>
              <CustomText
                styles={{
                  fontSize: 12,
                  fontFamily: theme.font.archivo_regular,
                  lineHeight: 16,
                }}
              >
                Esqueci minha senha
              </CustomText>
            </TouchableOpacity>

            <HStack justifyContent={"space-between"} marginTop={16}>
              <Button title="Entrar" onPress={handleLogin} />

              <CustomText
                styles={{ textAlignVertical: "center", fontSize: 12 }}
              >
                @Idesam 2023
              </CustomText>
            </HStack>

            <View style={styles.registerButtonContainer}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate("Register")}
              >
                <CustomText
                  styles={{ textAlign: "center", fontSize: 17, lineHeight: 24 }}
                >
                  Cadastrar-se
                </CustomText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Box>
    </Gradient>
  );
}
