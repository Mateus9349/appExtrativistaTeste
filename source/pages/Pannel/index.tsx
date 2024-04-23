import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NewCollect } from "./NewCollect";
import { PannelHome } from "./PannelHome";
import { SoldCollects } from "../../contexts/CollectInProgressContext";

export type CollectStackParams = {
  PannelHome: undefined;
  NewCollect: undefined;
  Field: undefined;
  Profile: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<CollectStackParams>();

export function PannelCollectRoutes() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="PannelHome"
    >
      <Screen name="PannelHome" component={PannelHome} />
      <Screen name="NewCollect" component={NewCollect} />
    </Navigator>
  );
}
