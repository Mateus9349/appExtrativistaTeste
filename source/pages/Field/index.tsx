import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FieldHome } from "./FieldHome";
import { ExtractionInField } from "./ExtractionInField";
import { AllExtractions } from "./AllExtractions";
import { PannelCollectRoutes } from "../Pannel";

export type FieldStackParams = {
  FieldHome: undefined;
  ExtractionInField: undefined;
  AllExtractions: undefined;
  Pannel: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<FieldStackParams>();

export function FieldRoutes() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="FieldHome"
    >
      <Screen name="FieldHome" component={FieldHome} />
      <Screen name="ExtractionInField" component={ExtractionInField} />
      <Screen name="AllExtractions" component={AllExtractions} />
      <Screen name="Pannel" component={PannelCollectRoutes} />
    </Navigator>
  );
}
