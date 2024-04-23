import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CollectHome } from "./CollectHome";
import { NewCollect } from "../Pannel/NewCollect";

export type CollectStackParams = {
  HomeCollect: undefined;
  NewCollect: undefined;
  Field: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<CollectStackParams>();

export function CollectRoutes() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeCollect"
    >
      <Screen name="HomeCollect" component={CollectHome} />
      <Screen name="NewCollect" component={NewCollect} />
    </Navigator>
  );
}
