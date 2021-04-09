import React, { useState } from 'react';
import { StyleSheet, View, Image , TouchableOpacity } from 'react-native'; 
import {connect} from 'react-redux';
import HTTP_IP_DEV from '../mon_ip'

import BlueButton from './BlueButton';
import QuizzTitre from './QuizzTitre';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

function QuizzGender(props) {
  
  const [gender, setGender] = useState("")
  const [isSelected, setIsSelected] = useState(-1)

  var handleClick = () => {
    props.onAddUserGender(gender)
  }

  var updateGender = (index) => {
    if(index === 0){
      setGender("other")
    } else if (index === 1){
      setGender("male")
    } else if(index === 2){
      setGender("female")
    }
  }

  let [fontsLoaded] = useFonts({
      Montserrat_700Bold,
      Montserrat_900Black,
      Montserrat_800ExtraBold,
  });


  var images = [
    {unSelected: <Image source={{uri: 'https://i.imgur.com/wK81q24.png'}} style={{width: 110, height: 110}}/>, selected: <Image source={{uri: 'https://i.imgur.com/EvKcqi9.png'}} style={{width: 110, height: 110}}/>},
    {unSelected: <Image source={{uri: 'https://i.imgur.com/U0HK9Zb.png'}} style={{width: 110, height: 110}}/>, selected: <Image source={{uri: 'https://i.imgur.com/FNaPA8d.png'}} style={{width: 110, height: 110}}/>},
    {unSelected: <Image source={{uri: 'https://i.imgur.com/XDpv4eo.png'}} style={{width: 110, height: 110}}/>, selected: <Image source={{uri: 'https://i.imgur.com/S1xUry1.png'}} style={{width: 110, height: 110}}/>},
  ];

  var image = images.map((img, key) => {
      return <TouchableOpacity key={key} onPress={() => {setIsSelected(key), updateGender(key)}}>
       {isSelected === key ? img.selected : img.unSelected}
     </TouchableOpacity>
  })

  return(
      <View style={styles.container}>
        <QuizzTitre title="Tu es ?"/>
        <View style={{display: "flex", flexDirection:"row", justifyContent: "center"}}>
          {image}
        </View>
        <BlueButton btnTitle="enregistrer" handleClickParent={handleClick}/>
      </View>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    onAddUserGender: function (arg) {
      dispatch({ type: 'ADD_GENDER', gender: arg })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(QuizzGender);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2', 
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }
});