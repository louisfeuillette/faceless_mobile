import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import  HTTP_IP_DEV from '../mon_ip'

import BlueButton from './BlueButton';

import {
    useFonts,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  } from "@expo-google-fonts/montserrat";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function QuizzAvatar(props) {

    const [imgAvatarSelected, setImgAvatarSelected] = useState('https://i.imgur.com/atDrheA.png')
    const [imgAvatarUrl, setImgAvatarUrl] = useState("")
    const [token, setToken] = useState('')
    
    AsyncStorage.getItem("token", function(error, data) {
        setToken(data)
    });
    AsyncStorage.getItem("filter", function(error, data) {
        console.log(JSON.parse(data),'<------<-------<------<----- filter on store after sign-up')
    });

    var handleClick = async () => {
    var rawResponse = await fetch(`/sign-up-second-step`, {
     method: 'POST',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     body: `problemDescriptionFront=${props.userDisplay.problem_description}&genderFront=${props.userDisplay.gender}&localisationFront=${JSON.stringify(props.userDisplay.localisation)}&avatarFront=${props.userDisplay.avatar}&tokenFront=${token}`
    });
    var response = await rawResponse.json()
    }

    var changeAvatar = (index) => {
        setImgAvatarSelected(imgAvatarSrc[index])
    }

    var imgAvatarSrc = [
        'https://i.imgur.com/HgBDc9B.png',
        'https://i.imgur.com/NBYvxKX.png',
        'https://i.imgur.com/urOQgGD.png',
        'https://i.imgur.com/clPw5Nx.png',
        'https://i.imgur.com/Wm5vVmF.png',
        'https://i.imgur.com/YSesoUz.png',
        'https://i.imgur.com/mMzuMuT.png',
        'https://i.imgur.com/EHaBuT9.png',
        'https://i.imgur.com/21c3YgT.png',
        'https://i.imgur.com/17T5sWH.png',
        'https://i.imgur.com/97zBLZM.png',
        'https://i.imgur.com/aK9HbPT.png',
        'https://i.imgur.com/T7wBkkk.png',
        'https://i.imgur.com/fJYbMZO.png'
    ]

    var imgAvatar = imgAvatarSrc.map((url, key) => {
        return <TouchableOpacity key={key} url={url} onPress={() => {changeAvatar(key), setImgAvatarUrl(url); props.onAddUserAvatar(url)}}>
                    <Image source={{uri: url}} style={{margin: 7}} style={{width: 100, height:100, marginHorizontal: 5}}/>
                </TouchableOpacity>
    })

    let [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
      });

    return(
        <View style={styles.container} >
            <View style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Image source={{uri: imgAvatarSelected}} style={{width: 200, height: 200}}/>
            </View>
            <View style={styles.avatar}>
                <Ionicons name="chevron-back-outline" size={40} color="#5571D7" />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {imgAvatar}
                </ScrollView>
                <Ionicons name="chevron-forward-outline" size={40} color="#5571D7" />
            </View>
            <BlueButton btnTitle="enregistrer" handleClickParent={handleClick}/>
        </View>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        onAddUserAvatar: function (arg) {
            dispatch({ type: 'ADD_AVATAR', avatar: arg })
        }
    }
}

function mapStateToProps(state) {
    return { 
      userDisplay: state.user
     }
   }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuizzAvatar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2', 
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
    avatar: {
        display: "flex",
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center",
    }
});