import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import List from "./components/List";
import Map from "./components/Map";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 14,
          },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "List") {
              iconName = "list";
            } else if (route.name === "Map") {
              iconName = "map";
            }

            return <Entypo name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          options={{ headerShown: false }}
          name="List"
          component={List}
        />
        <Tab.Screen
          options={{ headerShown: false }}
          name="Map"
          component={Map}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
