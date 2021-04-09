import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import {connect} from 'react-redux';

import NavigationOptionalQuizz from "./NavigationOptionalQuizz"
import QuizzProbleme from "./QuizzProbleme"
import QuizzLocalisation from "./QuizzLocalisation"
import QuizzGender from "./QuizzGender"
import QuizzAvatar from "./QuizzAvatar"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";


function OptionalQuizz(props) {

  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(props.count)
  }, [props.count]);

// console.log(props.userDisplay)
    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
      <View style={{flex:1, backgroundColor: '#FFF1E2'}}>
        {step === 0 && <QuizzProbleme/>} 
        {step === 1 && <QuizzLocalisation/>} 
        {step === 2 && <QuizzGender/>} 
        {step === 3 && <QuizzAvatar/>} 
        {step === 4 &&  props.navigation.navigate('BottomNavigator', { screen: 'HomeScreen' })} 
        <NavigationOptionalQuizz/>
      </View>
    );
};
function mapStateToProps(state) {
 return { count: state.count }
}

export default connect(
  mapStateToProps,
  null
)(OptionalQuizz);
