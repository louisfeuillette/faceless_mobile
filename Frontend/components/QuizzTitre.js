import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
    Montserrat_400Regular
  } from "@expo-google-fonts/montserrat";

import { startClock } from 'react-native-reanimated';


export default function QuizzTitre(props) {

    const[valueInput, setValueInput] = useState("")
    const [isSelected, setIsSelected] = useState(false)

    var onChangeContent = (value) => {
      setValueInput(value)
      props.getInputValueParent(value);
    }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
        Montserrat_400Regular
    });

    if(props.type === "inline"){
        var input = <Input
           placeholder={props.placeholder}
           onChangeText={(value) => onChangeContent(value)}
           value={valueInput}
           />  
    }

    if(props.type === "border"){
        var input = <Input style={styles.input}
        placeholderTextColor='#303030'
        inputContainerStyle={{borderBottomWidth:0}}
        placeholder={props.placeholder}
        onChangeText={(value) => onChangeContent(value)}
        value={valueInput}
        />  
    }
    
    return(
        <View style={styles.question}>
            <Text style={styles.textQuizz}>{props.title}</Text>
            {input}
        </View>
    );
};

const styles = StyleSheet.create({
  question: {
    marginTop: windowHeight/3,
    paddingLeft: windowWidth/10,
    paddingRight: windowWidth/10,
  },
  textQuizz: {
    color: '#5571D7',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FECC9A",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 6,
    borderColor: "#303030",
    borderWidth: 2,
    padding: 8,
    fontFamily: 'Montserrat_400Regular'
  }
});