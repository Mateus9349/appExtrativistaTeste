import React, { useState, useRef, useEffect, useContext } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";

import { styles } from "./styles";
import { CustomText } from "../../components/CustomText";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../utils/theme";
import { Box } from "native-base";

// import ApadritSelected from "../../../assets/ApadritSelected.svg";
// import ApadritUnselected from "../../../assets/ApadritUnselected.svg";
// import ApfovSelected from "../../../assets/ApfovSelected.svg";
// import ApfovUnselected from "../../../assets/ApfovUnselected.svg";
// import AsagaSelected from "../../../assets/AsagaSelected.svg";
// import AsagaUnselected from "../../../assets/AsagaUnselected.svg";
// import AspacsSelected from "../../../assets/AspacsSelected.svg";
// import AspacsUnselected from "../../../assets/AspacsUnselected.svg";
// import UatumaSelected from "../../../assets/UatumaSelected.svg";
// import UatumaUnselected from "../../../assets/UatumaUnselected.svg";

// import ColetaSelected from "../../../assets/ColetaSelected.svg";
// import ColetaUnselected from "../../../assets/ColetaUnselected.svg";
// import UsinaSelected from "../../../assets/UsinaSelected.svg";
// import UsinaUnselected from "../../../assets/UsinaUnselected.svg";
// import ManejoSelected from "../../../assets/ManejoSelected.svg";
// import ManejoUnselected from "../../../assets/ManejoUnselected.svg";
// import MovelariaSelected from "../../../assets/MovelariaSelected.svg";
// import MovelariaUnselected from "../../../assets/MovelariaUnselected.svg";
import { SvgProps } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../routes/AuthStackParams";
import { AssociationContext } from "../../contexts/AssociationsContext";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

type dataObject = {
  id: number;
  SelectedImage: React.FC<SvgProps>;
  UnselectedImage: React.FC<SvgProps>;
};

type authScreenProp = NativeStackNavigationProp<
  AuthStackParams,
  "Associations"
>;

export function Associations() {
  const navigation = useNavigation<authScreenProp>();
  const { associationData, setAssociation, association } =
    useContext(AssociationContext);

  const goToLogin = async (id: number) => {
    const associationName = associationData[id - 1].name;
    await AsyncStorage.setItem("association", associationName);
    navigation.navigate("Login");
  };

  return (
    <Animatable.View style={styles.container} animation={"fadeIn"}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingTop: 32 }}
        locations={[0.2, 0.4, 0.8]}
        colors={["#22310B", "#3A2212", "#151313"]}
      >
        <Box mt={32} pb={3}>
          <CustomText
            styles={{
              color: "#fff",
              fontFamily: theme.font.bernhard_regular,
              fontSize: 32,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            Escolha sua associação
          </CustomText>
        </Box>

        <View style={{ height: "80%", alignSelf: "center" }}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
            data={associationData}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{ marginVertical: 16, alignItems: "center" }}
                  onPress={() => {
                    if (item.id === association) {
                      setAssociation(null);
                      return;
                    }
                    goToLogin(item.id);
                  }}
                >
                  <item.SelectedImage />
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* {association && (
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Categories")}
              style={{
                width: 160,
                paddingHorizontal: 10,
                paddingVertical: 12,
                backgroundColor: theme.colors.yellow,
                borderRadius: 16,
                alignSelf: "center",
              }}
            >
              <CustomText
                styles={{
                  color: "#000",
                  textAlign: "center",
                  fontSize: 17,
                  fontFamily: theme.font.basicSans_regular,
                  lineHeight: 24,
                }}
              >
                Próximo
              </CustomText>
            </TouchableOpacity>
          </View>
        )} */}
      </LinearGradient>
    </Animatable.View>
  );
}
