import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "../pages/Login";
import { AuthStackParams } from "./AuthStackParams";
import { Register } from "../pages/Register";
import { Associations } from "../pages/Associations";

const { Navigator, Screen } = createNativeStackNavigator<AuthStackParams>();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Associations"
    >
      <Screen name="Login" component={Login} />
      <Screen name="Register" component={Register} />
      <Screen name="Associations" component={Associations} />
    </Navigator>
  );
}
