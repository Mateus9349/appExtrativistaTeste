import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  ImageBackground,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { styles } from "./styles";
import { CustomText } from "../../components/CustomText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../routes/AuthStackParams";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, VStack } from "native-base";
import { FontAwesome5 as Icon } from "@expo/vector-icons";
import { theme } from "../../../utils/theme";
import { CustomPicker, Item } from "../../components/CustomPicker";
import { Button } from "../../components/Button";
import { CustomInput } from "../../components/CustomInput";
import { Gradient } from "../../components/Gradient";
import { Header } from "../../components/Header";
import WelcomeIcon from "../../../assets/welcome.svg";
import { AuthContext, UserPost } from "../../contexts/AuthContext";
import { Alert } from "react-native";
import { InputWithNameAbove } from "../../components/InputWithNameAbove";
import { ActivityIndicator } from "react-native-paper";

type authScreenProp = NativeStackNavigationProp<AuthStackParams, "Register">;

interface Cities {
  nome: string;
}

export function Register() {
  const navigation = useNavigation<authScreenProp>();
  const { signUp, loading } = useContext(AuthContext);

  const [formPage, setFormPage] = useState(0);

  const [uf, setUf] = useState("");
  // const [profile, setProfile] = useState("");
  // const [profileType, setProfileType] = useState("");

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [cityZone, setCityZone] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [cities, setCities] = useState<Item[]>([]);

  const titles = [
    "Cadastre-se",
    "Informe seus dados",
    "Informe seu endereço",
    "Senha",
    "Bem vindo!",
  ];

  const ufData = [
    { label: "Acre", value: "AC" },
    { label: "Alagoas", value: "AL" },
    { label: "Amapá", value: "AP" },
    { label: "Amazonas", value: "AM" },
    { label: "Bahia", value: "BA" },
    { label: "Ceará", value: "CE" },
    { label: "Distrito Federal", value: "DF" },
    { label: "Espírito Santo", value: "ES" },
    { label: "Goiás", value: "GO" },
    { label: "Maranhão", value: "MA" },
    { label: "Mato Grosso", value: "MT" },
    { label: "Mato Grosso do Sul", value: "MS" },
    { label: "Minas Gerais", value: "MG" },
    { label: "Pará", value: "PA" },
    { label: "Paraíba", value: "PB" },
    { label: "Paraná", value: "PR" },
    { label: "Pernambuco", value: "PE" },
    { label: "Piauí", value: "PI" },
    { label: "Rio de Janeiro", value: "RJ" },
    { label: "Rio Grande do Norte", value: "RN" },
    { label: "Rio Grande do Sul", value: "RS" },
    { label: "Rondônia", value: "RO" },
    { label: "Roraima", value: "RR" },
    { label: "Santa Catarina", value: "SC" },
    { label: "São Paulo", value: "SP" },
    { label: "Sergipe", value: "SE" },
    { label: "Tocantins", value: "TO" },
  ];

  // const profiles = [
  //   { label: "Produtor", value: "productor" },
  //   { label: "Usina", value: "factory" },
  //   { label: "Extrativista", value: "extractor" },
  // ];

  const zone = [
    { label: "Zona Urbana", value: "urban" },
    { label: "Zona Rural", value: "rural" },
    { label: "Assentamento", value: "assentamento" },
    { label: "Und Conservação Estadual", value: "und_conservacao_estadual" },
    { label: "Und Conservação Federal", value: "und_conservacao_federal" },
  ];

  // const profileTypes = [{ label: "Selecionar", value: null }];

  const validate = () => {
    var flag = true;
    if (password !== confirmPassword) {
      Alert.alert("Senhas não coincidem");
      flag = false;
    }
    if (name.length === 0) {
      Alert.alert("Nome inválido");
      flag = false;
    }
    if (cpf.length === 0) {
      Alert.alert("CPF inválido");
      flag = false;
    }
    if (password.length === 0) {
      Alert.alert("Senha inválida");
      flag = false;
    }

    return flag;
  };

  const buildData = () => {
    const validated = validate();
    if (!validated) {
      return;
    }

    const user: UserPost = {
      UF: uf,
      nome: name,
      bairro: neighborhood.length === 0 ? null : neighborhood,
      cep: cep.length === 0 ? null : cep,
      complemento: complement.length === 0 ? null : complement,
      cpf: cpf,
      email: email.length === 0 ? null : email,
      endereco: address.length === 0 ? null : address,
      numero: number.length === 0 ? null : number,
      RG: rg.length === 0 ? null : rg,
      senha: password,
      telefone: phone.length === 0 ? null : phone,
      zona: cityZone.length === 0 ? null : cityZone,
      municipio: city.length === 0 ? null : city,
    };

    return user;
  };

  const handleNextPage = async () => {
    var flag = true;

    if (formPage === 3) {
      flag = validate();
      if (!flag) {
        return;
      }
      const user = buildData();

      signUp(user!);
    }
    if (flag) {
      setFormPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (formPage === 0) navigation.goBack();
    setFormPage((prev) => prev - 1);
  };

  const handleGoToLogin = () => {
    navigation.navigate("Login");
  };

  useEffect(() => {
    if (formPage === 2) {
      const handle = async () => {
        const citiesByUf: Item[] = [{ label: "Selecione", value: null }];
        const response = await axios.get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
        );
        const data = response.data;
        data.map((item: Cities) => {
          citiesByUf.push({ label: item.nome, value: item.nome });
        });
        setCities(citiesByUf);
      };
      handle();
    }
  }, [formPage]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header headerType="brown" title={titles[formPage]} />

      <Box alignItems={"center"} paddingX={3} pt={10} bg={"#fff"} flex={1}>
        <VStack width={"100%"}>
          {formPage === 0 && (
            <Box h={200} mb={6}>
              <CustomPicker
                placeholder="Estado"
                title="UF"
                items={ufData}
                state={uf}
                setValue={setUf}
              />
            </Box>
          )}

          {formPage === 1 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}
            >
              <VStack space={4}>
                <Box>
                  <CustomText styles={{ marginBottom: 8 }}>Nome*</CustomText>

                  <CustomInput
                    state={name}
                    setState={setName}
                    placeholder="Nome completo"
                  />
                </Box>

                <Box>
                  {/* <CustomText styles={{ marginBottom: 8 }}>CPF*</CustomText> */}

                  {/* <CustomInput
                    state={cpf}
                    setState={setCpf}
                    placeholder="000.000.000-00"
                  /> */}
                  <InputWithNameAbove
                    mask="999.999.999-99"
                    placeholder="000.000.000-00"
                    keyboardType="numeric"
                    label="CPF"
                    value={cpf}
                    onChangeText={(text, rawText) => setCpf(rawText)}
                  />
                </Box>

                <Box>
                  {/* <CustomText styles={{ marginBottom: 8 }}>RG</CustomText> */}

                  {/* <CustomInput
                    state={rg}
                    setState={setRg}
                    placeholder="00000-00"
                  /> */}
                  <InputWithNameAbove
                    mask="99999-99"
                    placeholder="00000-00"
                    keyboardType="numeric"
                    label="RG"
                    value={rg}
                    onChangeText={(text, rawText) => setRg(rawText)}
                  />
                </Box>

                <Box>
                  <CustomText styles={{ marginBottom: 8 }}>Telefone</CustomText>

                  <CustomInput
                    state={phone}
                    setState={setPhone}
                    placeholder="(00) 00000-0000"
                  />
                </Box>

                <Box>
                  <CustomText styles={{ marginBottom: 8 }}>Email</CustomText>

                  <CustomInput
                    state={email}
                    setState={setEmail}
                    placeholder="nome@exemplo.com"
                  />
                </Box>
              </VStack>
            </ScrollView>
          )}

          {formPage === 2 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}
              nestedScrollEnabled={true}
            >
              <VStack space={4}>
                <CustomPicker
                  title="Zona"
                  items={zone}
                  placeholder="Selecione"
                  state={cityZone}
                  setValue={setCityZone}
                />

                {cityZone === "urban" && (
                  <Box>
                    <CustomText styles={{ marginBottom: 8 }}>CEP</CustomText>
                    <CustomInput
                      placeholder="00000-000"
                      state={cep}
                      setState={setCep}
                    />
                  </Box>
                )}

                <Box>
                  <CustomText styles={{ marginBottom: 8 }}>Endereço</CustomText>
                  <CustomInput
                    placeholder="Ex. Rua, Travessa, Avenida"
                    state={address}
                    setState={setAddress}
                  />
                </Box>

                <HStack alignItems={"center"} space={4}>
                  {cityZone === "urban" && (
                    <Box flex={0.5}>
                      <CustomText styles={{}}>Núm</CustomText>
                      <CustomInput
                        placeholder="0"
                        state={number}
                        setState={setNumber}
                      />
                    </Box>
                  )}

                  <Box flex={2}>
                    <CustomText styles={{}}>Complemento</CustomText>
                    <CustomInput
                      placeholder="Ex. Apto 1, Bloco A"
                      state={complement}
                      setState={setComplement}
                    />
                  </Box>
                </HStack>

                {cityZone === "urban" && (
                  <Box>
                    <CustomText styles={{ marginBottom: 8 }}>Bairro</CustomText>
                    <CustomInput
                      placeholder="Ex. Centro"
                      state={neighborhood}
                      setState={setNeighborhood}
                    />
                  </Box>
                )}

                <Box>
                  <CustomPicker
                    title="Município"
                    placeholder="Selecione"
                    items={cities}
                    state={city}
                    setValue={setCity}
                  />
                </Box>
              </VStack>
            </ScrollView>
          )}

          {formPage === 3 && (
            <Box alignItems={"center"}>
              <VStack alignItems={"center"} w={300} mt={10} space={5}>
                <CustomInput
                  placeholder="Senha"
                  state={password}
                  setState={setPassword}
                />

                <CustomInput
                  placeholder="Confirmar senha"
                  state={confirmPassword}
                  setState={setConfirmPassword}
                />
              </VStack>
            </Box>
          )}

          {formPage === 4 && (
            <Box alignItems={"center"}>
              <WelcomeIcon />

              <VStack alignItems={"center"} w={300} mt={10}>
                <CustomText styles={{ textAlign: "center", fontSize: 17 }}>
                  Tudo certo {name}!
                </CustomText>
                <CustomText styles={{ textAlign: "center", fontSize: 17 }}>
                  Sua conta foi criada com sucesso! Retorne ao login e comece a
                  usar o aplicativo.
                </CustomText>
              </VStack>
            </Box>
          )}
        </VStack>

        <HStack
          alignItems={"center"}
          justifyContent={"space-evenly"}
          justifyItems={"center"}
          width={"100%"}
          mt={10}
        >
          {formPage !== 4 && (
            <Button onPress={handlePrevPage} title="Voltar" backButton />
          )}

          {loading ? (
            <Box
              width={133}
              height={"48px"}
              backgroundColor={theme.colors.green_dark}
              justifyContent={"center"}
              borderRadius={"16px"}
            >
              <ActivityIndicator size={"small"} color="white" />
            </Box>
          ) : (
            <Button
              onPress={formPage === 4 ? handleGoToLogin : handleNextPage}
              title={formPage === 4 ? "Entrar" : "Continuar"}
            />
          )}
        </HStack>
      </Box>
    </View>
  );
}
