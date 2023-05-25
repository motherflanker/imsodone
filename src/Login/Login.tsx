import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import { CTAButton } from "../Components/CTAButton/CTAButton";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";




export const Login = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const goToRegistration = () => {
    nav.push("Register");
  };

  const login = async () => {
    if(email && password){
      try{
        const response = await auth().signInWithEmailAndPassword(
          email, password
        )
        if(response.user){
          nav.replace('Main')
        }
      }
      catch(e){
        Alert.alert("Ой", "штота сломалосб")
      }
    }
  };

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>ВШагатель</Text>
          </View>
          <View style={styles.mainContent}>
            <TextInput
              style={styles.loginTextField}
              placeholder="мыло"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              inputMode="email"
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.buttons}>
            <CTAButton title="залогиниться соизвольте" onPress={login} variant="primary" />
            <CTAButton
              title="зарегаться соизвольте"
              onPress={goToRegistration}
              variant="secondary"
            />
          </View>
          
        </View>
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttons: {
    paddingBottom: 15
  },
  contentView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginHorizontal: 50,
    backgroundColor: "white",
  },
  titleContainer: {
    flex: 1.2,
    justifyContent: "center",
    paddingTop: 80
  },
  titleText: {
    paddingBottom: 0,
    fontSize: 45,
    textAlign: "center",
    fontWeight: "200",
  },
  loginTextField: {
    borderBottomWidth: 1,
    height: 60,
    fontSize: 30,
    marginVertical: 10,
    fontWeight: "300",
  },
  mainContent: {
    flex: 2,
  },
});
