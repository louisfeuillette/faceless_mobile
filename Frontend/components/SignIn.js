import React, { useEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from "react-native";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import HTTP_IP_DEV from "../mon_ip";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";

function SignIn(props) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
  });

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [listErrorsSignIn, setErrorsSignIn] = useState([]);

  var handleSubmitSignIn = async () => {

    console.log(signInEmail, "on click signInEmail");
    console.log(signInPassword, "on click signInPassword");

    const rawData = await fetch(`/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
    });
    const data = await rawData.json();
    console.log(data, "<----- After Fetch");

    if (data.result == true) {
      AsyncStorage.setItem("token", data.token);
      props.navigation.navigate("BottomNavigator");
    }

    if (data.error) {
      setErrorsSignIn(data.error);
    }

    if (data.user.is_adult == true) {
      AsyncStorage.setItem(
        "filter",
        JSON.stringify({
          // si isAdult == true alors on set le min age du filter à l'âge de l'user et le max age à l'age de l'user +10 ans
          problemsTypes: data.user.problems_types, // problems
          gender: ["other", "male", "female"],
          age: {
            minAge: 18,
            maxAge: 100,
          },
          localisation: "France",
        })
      );
    } else {
      AsyncStorage.setItem(
        "filter",
        JSON.stringify({
          // sinon on set le min age du filter à l'âge et l'user et le max age à 18ans
          problemsTypes: data.user.problems_types,
          gender: ["other", "male", "female"],
          age: {
            minAge: 13, 
            maxAge: 17,
          },
          localisation: "France",
        })
      );
    }

    AsyncStorage.getItem("filter", function (error, data) {
      console.log(data, "DATA DU ASYNC ");
    });
  };

  const handleClickBack = () => {
    props.navigation.navigate('Registration')
  };

  var tabErrorsSignIn = listErrorsSignIn.map((error, i) => {
    return <Text style={{ fontFamily: "Montserrat_700Bold" }}>{error}</Text>;
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonPrevious}
          onPress={() => handleClickBack()}
        >
          <Ionicons
            name="chevron-back"
            size={25}
            color="#5571D7"
            style={{ alignSelf: "center", marginTop: 3 }}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.textTitle}>Bon retour !</Text>
      <View style={styles.containerInput}>
        <Input
          keyboardType={"email-address"}
          placeholder="helicoptere530@gmail.com"
          inputContainerStyle={styles.inputConnect}
          onChangeText={(value) => setSignInEmail(value)}
          value={signInEmail}
        ></Input>
        <Input
          secureTextEntry={true}
          placeholder="Ton mot de passe"
          inputContainerStyle={styles.inputConnect}
          onChangeText={(value) => setSignInPassword(value)}
          value={signInPassword}
        ></Input>
      </View>
      {tabErrorsSignIn}
      <Button
              title="connexion"
              type="solid"
              buttonStyle={styles.buttonNext}
              titleStyle={{
                fontFamily: "Montserrat_700Bold",
              }}
              onPress={() => handleSubmitSignIn()}
            />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF1E2",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
    flexDirection: "column",
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  buttonContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonPrevious: {
    backgroundColor: "#FFEEDD",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#5571D7',
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5
  },
  containerInput: {
    marginTop: 30,
  },
  textTitle: {
    color: "#5571D7",
    fontFamily: "Montserrat_900Black",
    fontSize: 43,
    width: "75%",
    paddingTop: 90
  },
  inputConnect: {
    width: "75%",
  },
  buttonNext: {
    backgroundColor: "#5571D7",
    marginTop:40,
    borderRadius: 86,
    width: 200,
    margin: 10,
  },
});

export default SignIn;
