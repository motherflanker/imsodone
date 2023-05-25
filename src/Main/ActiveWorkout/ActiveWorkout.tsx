import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { addStepChangedListener,startSendingData,stopSendingData } from "expo-sample-pedometer";
import { LeaderboardEntry } from "../../Types/LeaderboardEntry";

const Steps = ({
  submitForCompletion,
}: {
  submitForCompletion: (steps: number) => void;
}) => {
  const [numOfSteps, setNumOfSteps] = useState(0);

  useEffect(() => {
    const sub = addStepChangedListener(({ step }) => {
      setNumOfSteps(step);
     });
     return () => {
      stopSendingData();
      sub.remove();
     };
  }, []);

  const submit = async () => {
    submitForCompletion(numOfSteps);
  };

  return (
    <>
      <View style={styles.bottomTimer}>
        <Text style={styles.timerLabel}>нашагано</Text>
        <Text style={styles.timerFont}>{numOfSteps}</Text>
      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={submit}>
        <Text style={styles.buttonText}>хватит</Text>
      </TouchableOpacity>
    </>
  );
};

export const ActiveWorkout = () => {
  const nav = useNavigation<NativeStackNavigationProp<any>>();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  useEffect(() => {
    startSendingData();
  }, []);

  const saveWorkout = async (steps: number, currentUser: string) => {
    const sessionID = Date.now()
    await database().ref(`/users/${currentUser}/sessions/${sessionID}`).set({
      steps,
      time,
      date: sessionID
    })
  };

  const updateLeaderboard = async (steps: number, currentUser: string) => {
    const user = await database().ref(`/users/${currentUser}`).once('value')
    const userName = user.val().name as string

    const stepsSnapshot = await database()
    .ref(`/users/${currentUser}/leaderboard/`)
    .once('value')

    const totalSteps = (stepsSnapshot.val().totalSteps as number) + steps

    await database()
    .ref(`/users/${currentUser}/leaderboard/`)
    .update({totalSteps})

    const leaderboard = await database()
    .ref(`/leaderboard`).once('value')

    let leaderboardMutable = {...leaderboard.val()}
    let values: LeaderboardEntry[] = Object.values(leaderboardMutable)

    const leaderboardIndex = values.findIndex((value) => value.name === userName)
    if(leaderboardIndex > -1){
      values[leaderboardIndex] = {
        steps: totalSteps,
        name: userName
      }
      sortAndSave(values)
    }else{
      values.push({
        steps: totalSteps,
        name: userName
      })
      sortAndSave(values)
    }
  };

  const sortAndSave = async (values: LeaderboardEntry[]) => {
    values.sort((a, b) => (b.steps - a.steps))
    if(values.length > 3){
      values.pop()
    }
    const newLeaderboard = values.reduce((acc, cur, idx) => {
      acc.set(idx, cur)
      return acc
    }, new Map<number, LeaderboardEntry>())
    await database().ref('/').update({leaderboard: Object.fromEntries(newLeaderboard)})
  }

  const submitForCompletion = async (steps: number) => {
    const currentUser = auth().currentUser
    if(currentUser){
      await saveWorkout(steps, currentUser.uid)
      await updateLeaderboard(steps, currentUser.uid)
    }
    nav.goBack();
  };

  const formatTimeString = (rawSeconds: number) => {
    const seconds = rawSeconds % 60;
    const minutes = Math.floor(rawSeconds / 60) % 60;
    const hours = Math.floor(minutes / 60) % 60;

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <View style={styles.topTimer}>
        <Text style={styles.timerLabel}>Время</Text>
        <Text style={styles.timerFont}>{formatTimeString(time)}</Text>
      </View>
      <Steps submitForCompletion={submitForCompletion} />
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
  topTimer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 10,
  },
  bottomTimer: {
    flex: 1.2,
    justifyContent: "center",
    borderTopWidth: 1,
  },
  timerFont: {
    fontSize: 70,
    textAlign: "center",
    fontWeight: "100",
  },
  timerLabel: {
    textAlign: "center",
    fontSize: 50,
    marginBottom: 10,
  },
  buttonStyle: {
    position: "absolute",
    bottom: 30,
    height: 70,
    width: 120,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#961717",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
