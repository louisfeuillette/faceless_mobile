import React, { useEffect } from "react";
import { Button } from "react-native-elements";
import { StyleSheet, View, Dimensions, Image, Text,Animated } from "react-native";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HTTP_IP_DEV from '../mon_ip'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
  useFonts,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import { color } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
const scrollElementHeightPercent = 45;

export default function registration(props) {
  var alreadyIn;

  useEffect(() => {
    const handleData = async () => {
      AsyncStorage.getItem("token", function (error, data) {
        console.log(
          data,
          "<------<-------<------<----- token on local storage"
        );
        data != null ? (alreadyIn = true) : (alreadyIn = false);

        if (alreadyIn === true) {
          props.navigation.navigate("BottomNavigator", {
            screen: "HomeScreen",
          });
        }
      });
    };
    handleData();
    console.log(alreadyIn, "<------ alreadyIn");
  }, []);

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  var imgDiscover = [
    'https://i.imgur.com/tWhKFyA.png',
    'https://i.imgur.com/tWy4xO8.jpg',
    'https://i.imgur.com/sObtyNi.jpg',
    'https://i.imgur.com/I1T2t2M.jpg',
]

  // var handleScroll = function(event) {
  //   console.log('scroll')
  //   // console.log(nativeEvent.contentOffset.y);
  //  }

var scrollX = new Animated.Value(0)
let position = Animated.divide(scrollX, windowWidth);
console.log(position,'position')

var imgDiscover = imgDiscover.map((url, key) => {
  return <View key={key} style={{width:windowWidth}}><Image key={key} source={{uri: url}} style={{width:300, height:400, top:70, left:40}}/></View>
})


  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
          <ScrollView
            pagingEnabled={true}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {useNativeDriver: true})}
            contentContainerStyle={styles.logo}
            showsHorizontalScrollIndicator={false}
            snapToInterval={windowWidth}
            decelerationRate='fast'
            horizontal
          >
            
              {imgDiscover}
            
          </ScrollView>
          <View style={{ flexDirection: 'row' }}>
             {imgDiscover.map((_, i) => {
              let opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1], 
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp' 
              });
              return (
                <Animated.View
                  key={i}
                  style={{ opacity, height: 10, width: 10, backgroundColor: '#5571D7', margin: 8, borderRadius: 5 }}
                />
              );
            })}
          </View>
          <View style={styles.btn}>
            <Button
              title="S'inscrire"
              type="solid"
              buttonStyle={styles.buttonNext}
              titleStyle={{
                fontFamily: "Montserrat_700Bold",
              }}
              onPress={() => props.navigation.navigate("Quizz")}
            />
            <Button
              title="Se connecter"
              type="solid"
              buttonStyle={styles.buttonConnection}
              titleStyle={{
                fontFamily: "Montserrat_700Bold",
                color: '#5571D7',
              }}
              onPress={() => props.navigation.navigate("SignIn")}
            />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#feeddb",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonNext: {
    backgroundColor: "#5571D7",
    borderRadius: 86,
    width: 200,
    margin: 10,
  },
  buttonConnection: {
    backgroundColor: "#FFF1E2",
    borderWidth:3,
    borderColor: '#5571D7',
    borderRadius: 86,
    width: 200,
    margin: 10,
  },
  logo: {
    marginTop:50,
    height:windowHeight/3,
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center',
  },
  btn: {
    flex: 1,
    flexDirection: "column",
    marginTop: 40,
  },
});
