import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { FeedWorkout } from "../../Types/FeedWorkout";
import { CTAButton } from "../../Components/CTAButton/CTAButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ListItem } from "../../Components/ListItem/ListItem";
import { StatusBar } from "expo-status-bar";
import database, { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth"



export const Feed = () => {
  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const [feed, setFeed] = useState<FeedWorkout[]>([]);

  const [limit, setLimit] = useState(5);

  const onWorkoutChange = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    if(snapshot.val()){
      const values: FeedWorkout[] = Object.values(snapshot.val())
      values.sort((a, b) => b.date - a.date)
      setFeed(values)
    }
  }


  useEffect(() => {
    const currentUser = auth().currentUser!

    database().ref(`/users/${currentUser.uid}/sessions`)
    .orderByKey()
    .limitToLast(limit)
    .on('value', onWorkoutChange)

    return () => database().ref(`/users/${currentUser.uid}/sessions`).off('value', onWorkoutChange)
  }, [limit]);

  const goToWorkout = () => {
    nav.push("ActiveWorkout")
  }

  const onPress = async (id: number) => {
    const currentUser = auth().currentUser!
    database().ref(`/users/${currentUser.uid}/sessions/${id}`).set(null)
  };

  const renderItem = (listData: ListRenderItemInfo<FeedWorkout>) => {
    return <ListItem {...listData} onPress={onPress} />
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor="#961717" />
      <FlatList
        data={feed}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
      <View style={styles.buttonContainer}>
        <CTAButton variant="primary" title="ну пошли" onPress={goToWorkout} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
})
