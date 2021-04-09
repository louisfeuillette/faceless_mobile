import React from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

  function badge() {

  
      let [fontsLoaded] = useFonts({
          Montserrat_700Bold,
          Montserrat_900Black,
          Montserrat_800ExtraBold,
        });
  
      return(
        <View style={styles.badge}>
            <Text style={styles.fontBadge}>{props.route.params.problems_types[i]}</Text>
        </View>
      );
  };
  
export default badge;
  
const styles = StyleSheet.create({
    badge : {
        backgroundColor:'#5571D7',
        margin:2,
        fontSize:10,
        borderRadius: 30,
      },
      fontBadge: {
        color:'white',
        marginHorizontal:15,
        marginVertical:5,
        fontFamily: "Montserrat_700Bold",
      },
  });