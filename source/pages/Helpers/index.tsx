import React from "react";
import { View, Image } from "react-native";
import { CustomText } from "../../components/CustomText";
import { Header } from "../../components/Header";
import { theme } from "../../../utils/theme";
import { Box } from "native-base";
import { PlusButton } from "../../components/PlusButton";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HelpersHome } from "./HelpersHome";
import { NewHelper } from "./NewHelper";

export type HelperStackParams = {
  HelpersHome: undefined;
  NewHelper: undefined;
  Profile: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<HelperStackParams>();

export function HelpersRoute() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HelpersHome"
    >
      <Screen name="HelpersHome" component={HelpersHome} />
      <Screen name="NewHelper" component={NewHelper} />
    </Navigator>
  );
}
