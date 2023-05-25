import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Leaderboard } from "./Leaderboard/Leaderboard";
import { FeedNav } from "./Feed/FeedNav";
import Ionicons from "@expo/vector-icons/Ionicons";




const Tab = createBottomTabNavigator();

export const Main = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "фид") {
            iconName = "newspaper-outline" as const;
          } else {
            iconName = "analytics-outline" as const;
          }
          return (
            <Ionicons
              name={iconName}
              size={25}
              color={focused ? "#961717" : "grey"}
            />
          );
        },
        tabBarActiveTintColor: "#961717",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="фид"
        component={FeedNav}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="топ шагателей"
        component={Leaderboard}
        options={{
          headerStyle: {
            backgroundColor: "#961717",
          },
          headerTitleStyle: {
            color: "white",
          },
        }}
      />
    </Tab.Navigator>
  );
};
