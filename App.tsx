import "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

import { NativeBaseProvider } from "native-base";

import { useFonts } from "expo-font";
import { sequelize } from "./source/database/sequelize";
import { AssociationProvider } from "./source/contexts/AssociationsContext";
import {
  AuthContext,
  AuthContextProvider,
} from "./source/contexts/AuthContext";
import { Routes } from "./source/routes";
import { Materials } from "./models/Materials";
import { materialObject } from "./utils/materialsMockData";
import moment from "moment";
import { feedstockData } from "./utils/feedstockData";
import { Feedstock } from "./models/Feedstock";
import { CollectInProgressProvider } from "./source/contexts/CollectInProgressContext";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Splash } from "./source/pages/Splash";
import { preventAutoHideAsync } from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

preventAutoHideAsync();

export default function App() {
  const [splashCompleted, setSplashCompleted] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const appLoaded = await AsyncStorage.getItem("app-loaded");

        console.log("App loaded ?", appLoaded);

        if (!appLoaded) {
          await sequelize.sync({ force: true });

          materialObject.map(async (item) => {
            await Materials.create({
              name: item.name,
              unitPrice: item.unitPrice,
              lifespan: item.lifespan,
              label: item.label,
              created_at: moment(new Date()).toISOString(true),
            });
          });

          feedstockData.map(async (item) => {
            await Feedstock.create({
              name: item.name,
              standardMeasure: item.standardMeasure,
              collectType: item.collectType,
              category: item.category,
              created_at: moment(new Date()).toISOString(true),
            });
          });

          await AsyncStorage.setItem("app-loaded", "loaded");
        }
      } catch (error) {
        console.log("erro app.tsx -> ", error);
      }
    }

    init();
  }, []);

  const [fontsLoaded] = useFonts({
    "BWMitga-Bold": require("./assets/fonts/BwMitga-Bold.otf"),
    "BWMitga-Regular": require("./assets/fonts/BwMitga-Regular.otf"),
    "Archivo-Bold": require("./assets/fonts/Archivo-Bold.ttf"),
    "Archivo-Regular": require("./assets/fonts/Archivo-Regular.ttf"),
    "BasicSans-Regular": require("./assets/fonts/Basic-Sans-Regular.ttf"),
    "BasicSans-Bold": require("./assets/fonts/Basic-Sans-Bold.ttf"),
    "BernhardGothic-Regular": require("./assets/fonts/BernhardGothicURW-Medium.ttf"),
    "BernhardGothic-Bold": require("./assets/fonts/BernhardGothicURW-Heavy.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AssociationProvider>
        <NativeBaseProvider>
          <AuthContextProvider>
            <CollectInProgressProvider>
              {splashCompleted ? (
                <>
                  <StatusBar translucent={true} />
                  <Routes />
                </>
              ) : (
                <Splash onComplete={setSplashCompleted} />
              )}
            </CollectInProgressProvider>
          </AuthContextProvider>
        </NativeBaseProvider>
      </AssociationProvider>
    </GestureHandlerRootView>
  );
}
