import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {connect} from 'react-redux';


import QuizzTitre from "./QuizzTitre"
import BlueButton from './BlueButton';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

function QuizzProbleme(props) {

  const [problem, setProblem] = useState("")

  var handleClick = () => {
    props.onAddUserProblem(problem)
  }

  var getInputValue = (value) => {
    setProblem(value)
  }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.container}>
            <QuizzTitre title="Tu veux décrire ton soucis ?" placeholder="..." getInputValueParent={getInputValue} type="inline"/>
            <BlueButton btnTitle="enregistrer" handleClickParent={handleClick}/>
        </View>
    );
};

function mapDispatchToProps(dispatch) {
  return {
    onAddUserProblem: function (arg) {
      dispatch({ type: 'ADD_PROBLEM', problem: arg })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(QuizzProbleme);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2', 
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }
});