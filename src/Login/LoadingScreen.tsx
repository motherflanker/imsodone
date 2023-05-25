import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'



export const LoadingScreen = () => {
  const nav = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const subst = auth().onAuthStateChanged(onAuthStateChanged)
    return subst
  }, []);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
      setTimeout(() => {
        if(user){
          nav.replace('Main')
        }else nav.replace('Login')
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>загружаю падажжи</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    fontSize: 70,
    fontWeight: "200",
    textAlign: "center",
  },
});
