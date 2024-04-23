import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { AppRoutes } from "./AppRoutes";
import { AuthRoutes } from "./AuthRoutes";
// import { AnimatedSplashScreen } from "../pages/SplashScreen";

export function Routes() {
  const { signed, checkLocalUser } = useContext(AuthContext);

  useEffect(() => {
    checkLocalUser();
  }, []);

  return (
    <NavigationContainer>
      {signed ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
