import React, { useEffect } from "react";
import { Feed } from "./Feed";
import { ActiveWorkout } from "../ActiveWorkout/ActiveWorkout";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { requestPermissions } from "expo-sample-pedometer";

const Stack = createNativeStackNavigator();

export const FeedNav = () => {
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#961717",
        },
        headerTitleStyle: {
          color: "white",
        },
      }}
    >
      <Stack.Screen
        name="FeedScreen"
        component={Feed}
        options={{
          headerTitle: "не фид (не фид - не кормить)",
        }}
      />
      <Stack.Screen
        name="ActiveWorkout"
        component={ActiveWorkout}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
