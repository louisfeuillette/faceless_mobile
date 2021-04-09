import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons } from '@expo/vector-icons'; 

import QuizzTitre from "./QuizzTitre"
import NavigationOptionalQuizz from "./NavigationOptionalQuizz"


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

export default function QuizzInput(props) {

  var handleClick = () => {
      props.handleClickParent();
  }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.center}>
            <Button 
                    title={props.btnTitle}
                    type="solid"
                    buttonStyle={styles.buttonValider}
                    titleStyle={{
                    fontFamily: 'Montserrat_700Bold'
                    }}
                    onPress={() => handleClick()}
                /> 
        </View>
    );
};

const styles = StyleSheet.create({
  buttonValider: {
    backgroundColor: '#5571D7',
    borderRadius: 86,
    width: 159,
    margin: 50   
  },
  center: {
    flexDirection: "row",
    justifyContent: "center"
  }
});