import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PannelCollectRoutes } from "../pages/Pannel";
import { View, StyleSheet } from "react-native";
import { CustomText } from "../components/CustomText";
import {
  FontAwesome5 as IconF,
  MaterialCommunityIcons as IconM,
} from "@expo/vector-icons";
import { theme } from "../../utils/theme";
import { Material } from "../pages/Material";
import { CollectRoutes } from "../pages/Collect";
import { HelpersRoute } from "../pages/Helpers";
import { FieldRoutes } from "../pages/Field";
import { CollectInProgressContext } from "../contexts/CollectInProgressContext";
import { Profile } from "../pages/Profile";

const Tabs = createBottomTabNavigator();

export const styleObjectToResetTabBar = {
  height: 90,
  paddingHorizontal: 5,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  elevation: 16,
};

// TROCAR FONTS

export function AppRoutes() {
  const { hasCollectOpen } = useContext(CollectInProgressContext);

  return (
    <Tabs.Navigator
      initialRouteName="Pannel"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <>
              <View style={styles.iconContainer}>
                <IconF
                  color={theme.colors.brown_dark}
                  style={{ opacity: focused ? 1 : 0.2 }}
                  name="user-alt"
                  size={focused ? 34 : 32}
                />
              </View>
              <CustomText styles={styles.title}>Perfil</CustomText>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="Pannel"
        component={PannelCollectRoutes}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <>
              <View style={styles.iconContainer}>
                <IconF
                  color={theme.colors.brown_dark}
                  style={{ opacity: focused ? 1 : 0.2 }}
                  name="tachometer-alt"
                  size={focused ? 34 : 32}
                />
              </View>
              <CustomText styles={styles.title}>Painel</CustomText>
            </>
          ),
        }}
      />
      {hasCollectOpen && (
        <Tabs.Screen
          name="Field"
          component={FieldRoutes}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <>
                <View style={styles.iconContainer}>
                  <IconM
                    color={theme.colors.brown_dark}
                    style={{ opacity: focused ? 1 : 0.2 }}
                    name="tree"
                    size={focused ? 39 : 36}
                  />
                </View>
                <CustomText styles={styles.title}>Campo</CustomText>
              </>
            ),
          }}
        />
      )}
      {/* <Tabs.Screen
        name="Material"
        component={Material}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <>
              <View style={styles.iconContainer}>
                <IconF
                  color={theme.colors.brown_dark}
                  style={{ opacity: focused ? 1 : 0.2 }}
                  name="tools"
                  size={focused ? 36 : 32}
                />
              </View>
              <CustomText styles={styles.title}>Material</CustomText>
            </>
          ),
        }}
      /> */}

      <Tabs.Screen
        name="Helpers"
        component={HelpersRoute}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <>
              <View style={styles.iconContainer}>
                <IconF
                  color={theme.colors.brown_dark}
                  style={{ opacity: focused ? 1 : 0.2 }}
                  name="users"
                  size={focused ? 36 : 32}
                />
              </View>
              <CustomText styles={styles.title}>Ajudantes</CustomText>
            </>
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 100,
    paddingHorizontal: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 16,
  },
  iconContainer: {
    width: 72,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 12,
  },
});
