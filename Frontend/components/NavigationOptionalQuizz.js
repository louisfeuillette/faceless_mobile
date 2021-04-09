import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import HTTP_IP_DEV from '../mon_ip'
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";
import { startClock } from 'react-native-reanimated';


function NavigationOptionalQuizz(props) {

  const [token, setToken] = useState('')

  AsyncStorage.getItem("token", function(error, data) {
    setToken(data)
});

  var handleClick = async () => {
    console.log(token, '<)--------------- token');
    var rawResponse = await fetch(`/sign-up-second-step`, {
     method: 'POST',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     body: `problemDescriptionFront=${props.userDisplay.problem_description}&genderFront=${props.userDisplay.gender}&localisationFront=${JSON.stringify(props.userDisplay.localisation)}&avatarFront=${props.userDisplay.avatar}&tokenFront=${token}`
    });
    var response = await rawResponse.json()
    console.log(response, '<------<--------<--------<--- response after update')
    }

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.btn}>
            <Button 
            title="Revoir"
            type="clear"
            icon={
            <Ionicons name="chevron-back-outline" size={24} color="#EC9A1F" />
            }
            buttonStyle={styles.buttonNext}
            titleStyle={{
            color: '#EC9A1F',
            fontFamily: 'Montserrat_700Bold'
            }}
            onPress={ ()=>props.onDecrease() }
            />
            <Button 
            iconRight
            title="Passer"
            type="clear"
            icon={
            <Ionicons name="chevron-forward-outline" size={24} color="#5571D7" />
            }
            titleStyle={{
            color: '#5571D7',
            fontFamily: 'Montserrat_700Bold',
            }}
            onPress={()=>{props.onIncrease(); props.count == 3 ? handleClick() : null} }
            /> 
        </View>
    );
};
 
function mapDispatchToProps(dispatch) {
  return {
    onIncrease: function () {
      dispatch({ type: 'INCREASE_COUNT'})
    },
    onDecrease: function () {
      dispatch({ type: 'DECREASE_COUNT'})
    }
  }
}

function mapStateToProps(state) {
  return { 
    userDisplay: state.user,
    count: state.count,
   }
 }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationOptionalQuizz);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2', 
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  question: {
    marginTop: windowHeight/3,
    paddingLeft: windowWidth/10,
    paddingRight: windowWidth/10,
  },
  center: {
    flexDirection: "row",
    justifyContent: "center"
  },
  btn: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 30,
    margin: 5
  },
  textQuizz: {
    color: '#5571D7',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonValider: {
    backgroundColor: '#5571D7',
    borderRadius: 86,
    width: 159,
    margin: 50   
  },
});