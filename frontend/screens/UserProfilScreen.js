import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import {useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold} from "@expo-google-fonts/montserrat";
import { Button, Input, Overlay } from 'react-native-elements'
import moment from "moment";
import 'moment/locale/fr'
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTTP_IP_DEV from '../mon_ip'
import { Entypo } from '@expo/vector-icons'; 



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function UserProfilScreen(props) {

  const [visible, setVisible] = useState(false);
  const [alerterVisible, setAlerterVisible] = useState(false)
  const [signalerVisible, setSignalerVisible] = useState(false)
  const [blockUserVisible, setBlockUserVisible] = useState(false)
  const [overlayBlockedConfirmation, setOverlayBlockedConfirmation] = useState(false)
  const [token, setToken] = useState('')

  const [signalementReason, setSignalementReason] = useState('')
  const [signalementReasonOther, setSignalementReasonOther] = useState('')
  const [signalementValidation, setSignalementValidation] = useState(false)
  const [blockedResult, setBlockedResult] = useState(false)
  const [messageBlocked, setMessageBlocked] = useState('')

  const handleBlockUser = () => {
    setBlockUserVisible(!blockUserVisible)
  }
   
  useEffect(() => {
    AsyncStorage.getItem("token", function(error, data) {
      setToken(data)
    });  }, []);


  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const handleClickBack = () => {
      props.navigation.goBack()
  };
     

  const handleSelectReason = (arg) => {
    signalementReason.includes(arg) ? setSignalementReason('') : setSignalementReason(arg)
  }

    moment.locale('fr');
    var NewDate = moment(props.route.params.subscriptionDate).format('Do MMMM YYYY')

    const handleWarning = async () => {
       setVisible(!visible);
      }

      const handleDisplayAlerterReasons = () => {
        setAlerterVisible(true)
      }
      const handleDisplaySignalReasons = () => {
        setSignalerVisible(true)
      }

      const handleAlerter = async () => {
        setAlerterVisible(false)
        setVisible(false)
        setSignalementValidation(true)
        
      var rawResponse = await fetch(`/signalement-help`, {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `tokenFront=${token}&confidentIdFront=${props.route.params.userID}&reasonFront=${signalementReason}&reasonOtherFront=${signalementReasonOther}&typeFront=${'alerte'}`
       });
    }
    const handleSignaler = async () => {
      setAlerterVisible(false)
      setVisible(false)
      setSignalementValidation(true)
      
    var rawResponse = await fetch(`/signalement-help`, {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `tokenFront=${token}&confidentIdFront=${props.route.params.userID}&reasonFront=${signalementReason}&reasonOtherFront=${signalementReasonOther}&typeFront=${'signal'}`
     });
  }

  const handleBlockConfirmation = async () => {
    var rawResponse = await fetch(`/block-user`, {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `tokenFront=${token}&confidentIdFront=${props.route.params.userID}`
     });
     var response = await rawResponse.json();
     setMessageBlocked(response.message)

     if(response.result) {
      setBlockUserVisible(false);
      setOverlayBlockedConfirmation(!overlayBlockedConfirmation);
      setTimeout(()=> props.navigation.navigate('HomeScreen') , 1000);
     }
  }

  const handleConfirmationVisible = () => {
    setOverlayBlockedConfirmation(!overlayBlockedConfirmation)
  }

    const handlePrevious = () => {
      setAlerterVisible(false);
      setSignalerVisible(false);
    }


var imageGender = ''
  if (props.route.params.gender == 'male'){
    imageGender = <Image source={require('../assets/gender_male.png')} style={{width: 40, height: 40}}/>
  } else if (props.route.params.gender == 'female') {
    imageGender = <Image source={require('../assets/gender_female.png')} style={{width: 40, height: 40}}/>
  } else if (props.route.params.gender == 'other'){
    imageGender = <Image source={require('../assets/gender_1.png')} style={{width: 40, height: 40}}/>
  }




var badge = []
for (let i=0; i<props.route.params.problems_types.length; i++){
  badge.push(<Button
    key={i}
    buttonStyle={styles.badge}
    titleStyle={styles.fontBadge}
    title={props.route.params.problems_types[i]}
  />
  )
}

    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_700Bold,
        Montserrat_900Black,
        Montserrat_800ExtraBold,
    
      });    


    if (!fontsLoaded){
      return <AppLoading />;
    } else {
    return (
        <View style={styles.profilContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonPrevious} onPress={() => handleClickBack()} >
                        <Ionicons name="chevron-back" size={30} color="#5571D7" style={{ alignSelf: 'center',}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonWarning} onPress={() => handleWarning()} >
                    <Ionicons name="md-alert-sharp" size={28} color="#5571D7"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.topProfil}>
                    <Image source={{uri: props.route.params.avatar}} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F', width:100, height:100}}/>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            <Text style={styles.pseudoUser}>{props.route.params.pseudo}</Text>
                            {imageGender}
                        </View>
                    <Text style={styles.memberSince}>Membre depuis le {NewDate}</Text>
                </View>
            <View style={styles.problemDesc}>
                <Text style={styles.subtitleDesc}>En quelques mots:</Text>
                <View style={{ marginTop: 15,}}>
                    <Text style={{ color: "#264653", fontFamily: "Montserrat_400Regular",}}>
                    {props.route.params.problemDesc}
                    </Text>
                </View>
            </View>
            <View style={styles.problemBadge}>
                <Text style={styles.subtitleDesc}>Type(s) de soucis</Text>
                <View style={styles.badgeList}>
                {badge}
                </View>
            </View>
              <TouchableOpacity style={styles.buttonBlockUser} onPress={() => handleBlockUser()}>
              <FontAwesome name="ban" size={24} color="#FF7C7C" />
                <Text style={styles.textBlockUser}>Bloquer</Text>
              </TouchableOpacity>
              <Overlay isVisible={blockUserVisible} onBackdropPress={handleBlockUser} overlayStyle={styles.overlayBlockUser}>
                <>
                <Text style={styles.textBlockOverlay}>Es-tu sûr(e) de vouloir bloquer cet(te) utilisateur(trice) ?</Text>  
                <View style={{display: 'flex', flexDirection:'row', justifyContent: 'space-around', width: '65%'}}>
                  <TouchableOpacity style={styles.buttonBlockConfirmation} onPress={() => handleBlockConfirmation()}>
                  <Ionicons name="checkmark-sharp" size={28} color="#5571D7" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonBlockCancel} onPress={() => handleBlockUser()}>
                  <Ionicons name="close-sharp" size={28} color="#FF7C7C" />
                  </TouchableOpacity>
                </View>
                </>
              </Overlay>

              <Overlay isVisible={overlayBlockedConfirmation} onBackdropPress={handleConfirmationVisible} overlayStyle={styles.overlayBlockUser}>
                <>
                <View style={styles.containerBlockConfirmation}>
                  <Ionicons name="checkmark-done" size={34} color="#9DD893" />
                  <Text style={styles.textBlockedConfirmation}>{messageBlocked}</Text>  
                </View>
                </>
              </Overlay>


            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlay}>
              <>
          { signalerVisible == false && alerterVisible == false ?
            <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginVertical: 20}}>
              <Text style={styles.textNeedHelp}>Cette personne a besoin d'aide:</Text>
            <TouchableOpacity 
            style={styles.touchableOverlay} 
            onPress={()=> {handleDisplayAlerterReasons()}}>
              <Text 
              style={styles.textButtonWarning}>
                Alerter
              </Text>
            </TouchableOpacity>
            <Text style={styles.textOU}>OU</Text>
            <Text style={styles.textNeedHelp}>Cette personne est irrespectueuse:</Text>
            <TouchableOpacity
            style={styles.touchableOverlay}
            onPress={() => handleDisplaySignalReasons()}
            >
                <Text
                style={styles.textButtonWarning}>
                  Signaler
                </Text>
            </TouchableOpacity>
            </View>
             : null }

            { alerterVisible ?
              <View style={styles.containerReasons}>
                <View style={{width: '100%'}}>
                <TouchableOpacity style={styles.buttonPrevious} onPress={() => handlePrevious()} >
                        <Ionicons name="chevron-back" size={25} color="#5571D7" style={{ alignSelf: 'center', marginTop: 3 }} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                style={signalementReason.includes('Cette personne a des propos inquiétants.') ? styles.reasonsSignalementBis : styles.reasonsSignalement} 
                onPress={() => handleSelectReason('Cette personne a des propos inquiétants.')}>
                  <Text 
                  style={signalementReason.includes('Cette personne a des propos inquiétants.') ? styles.textReasonsSignalementBis : styles.textReasonsSignalement}>
                  Cette personne a des propos inquiétants.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={signalementReason.includes('Cette personne a un comportement dangereux.') ? styles.reasonsSignalementBis : styles.reasonsSignalement} 
                onPress={() => handleSelectReason('Cette personne a un comportement dangereux.')}>
                  <Text 
                  style={signalementReason.includes('Cette personne a un comportement dangereux.') ? styles.textReasonsSignalementBis : styles.textReasonsSignalement}>
                    Cette personne a un comportement dangereux.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={signalementReason.includes("Cette personne a besoin de l'aide d'un professionnel.") ? styles.reasonsSignalementBis : styles.reasonsSignalement} 
                onPress={() => handleSelectReason("Cette personne a besoin de l'aide d'un professionnel.") }>
                  <Text style={signalementReason.includes("Cette personne a besoin de l'aide d'un professionnel.") ? styles.textReasonsSignalementBis : styles.textReasonsSignalement}>
                    Cette personne a besoin de l'aide d'un professionnel.
                  </Text>  
                </TouchableOpacity>
                <Input 
                placeholder='Autre ...'
                onChangeText={value => {setSignalementReason(''); setSignalementReasonOther(value)}}
                style={styles.inputSignalement}
                />
              <TouchableOpacity 
              style={signalementReason != '' || signalementReasonOther != '' ? styles.touchableOverlayBis : styles.touchableOverlay} 
              onPress={()=> {handleAlerter()}}>
                <Text 
                style={signalementReason != '' || signalementReasonOther != '' ? styles.textButtonWarningBis : styles.textButtonWarning}>
                  Alerter
                </Text>
              </TouchableOpacity>
        
              </View> 
           : null }
            { signalerVisible ?
            <View style={styles.containerReasons}>
                <TouchableOpacity 
                style={signalementReason.includes('Cette personne a des propos déplacés') ? styles.reasonsSignalementBis : styles.reasonsSignalement} 
                onPress={() => handleSelectReason('Cette personne a des propos déplacés')}>
                  <Text 
                  style={signalementReason.includes('Cette personne a des propos déplacés') ? styles.textReasonsSignalementBis : styles.textReasonsSignalement}>
                  Cette personne a des propos déplacés.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={signalementReason.includes('Cette personne a un comportement aggressif.') ? styles.reasonsSignalementBis : styles.reasonsSignalement} 
                onPress={() => handleSelectReason('Cette personne a un comportement aggressif.')}>
                  <Text 
                  style={signalementReason.includes('Cette personne a un comportement aggressif.') ? styles.textReasonsSignalementBis : styles.textReasonsSignalement}>
                    Cette personne a un comportement aggressif.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={signalementReason.includes("Cette personne n'a pas sa place sur cette application.") ? styles.reasonsSignalementBis : styles.reasonsSignalement} 
                onPress={() => handleSelectReason("Cette personne n'a pas sa place sur cette application.") }>
                  <Text style={signalementReason.includes("Cette personne n'a pas sa place sur cette application.") ? styles.textReasonsSignalementBis : styles.textReasonsSignalement}>
                    Cette personne n'a pas sa place sur cette application.
                  </Text>  
                </TouchableOpacity>
                <Input 
                placeholder='Autre ...'
                onChangeText={value => {setSignalementReason(''); setSignalementReasonOther(value)}}
                style={styles.inputSignalement}
                />
              <TouchableOpacity 
              style={signalementReason != '' || signalementReasonOther != '' ? styles.touchableOverlayBis : styles.touchableOverlay} 
              onPress={()=> {handleSignaler()}}>
                <Text 
                style={signalementReason != '' || signalementReasonOther != '' ? styles.textButtonWarningBis : styles.textButtonWarning}>
                  Signaler
                </Text>
              </TouchableOpacity>
        
              </View> 
 : null}
              </>
            </Overlay>
        </View>
    )

}
}



export default UserProfilScreen;

const styles = StyleSheet.create({
    profilContainer: {
        flex: 1,
        backgroundColor: '#FFF1E2',
        width: windowWidth,
        height: windowHeight,
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
    }, 
    buttonContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },  
    buttonPrevious: {
        backgroundColor: "#FFEEDD",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor: '#5571D7',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
      },
      topProfil: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
      },    
      pseudoUser: {
        textAlign: "center",
        fontSize:20,
        color: "#5571D7",
        fontFamily: "Montserrat_700Bold",
        marginTop: 8,
        marginBottom: 8,
      },
      memberSince: {
        textAlign: "center",
        color: "#909090",
        fontFamily: "Montserrat_700Bold",
        fontStyle: 'italic',
        marginTop: 5
      },
      subtitleDesc: {
        color: "#EC9A1F",
        fontSize:20,
        fontFamily: "Montserrat_700Bold",
    },
      textDesc:{
        fontFamily: "Montserrat_400Regular",
        fontSize: 18,
        padding: 10,
      },
      problemDesc:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '80%',
        marginBottom: 30,
      },
      badge : {
        backgroundColor:'#5571D7',
        margin:3,
        fontSize:15,
        height:35,
        justifyContent:'center',
        alignContent:'center',
        borderRadius: 30,
      },
      fontBadge: {
        color:'white',
        fontFamily: "Montserrat_700Bold",
        marginHorizontal:5,
        fontSize:14,
        textAlign:'center',
        textAlignVertical:'center'
            },
      problemBadge:{
        width:'80%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        flexWrap:'wrap'
      },
      badgeList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
      },
      textInfo: {
        fontFamily: 'Montserrat_800ExtraBold',
        fontSize: 30,
        color: "#5571D7",
      },
      buttonWarning: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderColor: '#5571D7',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        backgroundColor: "#FFEEDD",
        padding: 10,
        width: 50,
        height: 50,
      },
      badgeGood :{
        backgroundColor: 'black'
      },
      overlay: {
        width: '90%',
        backgroundColor: '#FDEDDC',
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.62,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        paddingHorizontal: 10,
      },
      touchableOverlay: {
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#BCC8F0',
        borderRadius: 19,
        padding: 10,
        marginBottom: 10,
      },
      touchableOverlayBis: {
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#5571D7',
        borderRadius: 19,
        padding: 10,
        marginBottom: 10,
      },
      textButtonWarning: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 22,
        textAlign: 'center',
      },
      textButtonWarningBis: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 22,
        color: '#FFF1E2',
        textAlign: 'center'
      },
      textNeedHelp: {
        color: "#EC9A1F",
        fontSize:18,
        fontFamily: "Montserrat_700Bold",
        marginBottom: 10,
        width: '60%',
        textAlign: 'center'
      },
      reasonsSignalement: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#BCC8F0',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      reasonsSignalementBis: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#5571D7',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      containerReasons: {
        width: '90%',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      textReasonsSignalement: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
      },
      textReasonsSignalementBis: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        color: '#FFF1E2'
      },
      textOU: {
        color: "#5571D7",
        fontSize:24,
        fontFamily: "Montserrat_700Bold",
        marginVertical: 10,
      },
      buttonBlockUser: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'auto',
        backgroundColor: '#FFEEDD',
        borderColor: '#5571D7',
        shadowColor: "#FF7C7C",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 19,
        marginTop: 60,
      },
      textBlockUser: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 20,
        marginLeft: 10,
        color: '#FF7C7C',
      },
      overlayBlockUser: {
        width: '75%',
        height: 'auto',
        backgroundColor: '#FDEDDC',
        shadowColor: "#000",
        shadowOffset: {
        	width: 0,
        	height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2.62,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 40,
      },
      textBlockOverlay: {
        color: "#EC9A1F",
        fontSize:18,
        fontFamily: "Montserrat_700Bold",
        marginBottom: 30,
        width: '80%',
        textAlign: 'center'
      },
      textBlockedConfirmation: {
        color: "#9DD893",
        fontSize:20,
        fontFamily: "Montserrat_700Bold",
        width: '60%',
        textAlign: 'center'
      },
      buttonBlockConfirmation: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'auto',
        backgroundColor: '#FFEEDD',
        borderColor: '#5571D7',
        shadowColor: "#5571D7",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderRadius: 19,
      },
      buttonBlockCancel: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 'auto',
        backgroundColor: '#FFEEDD',
        borderColor: '#5571D7',
        shadowColor: "#FF7C7C",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderRadius: 19,
      },
      containerBlockConfirmation: {
        display:'flex', 
        flexDirection:'row', 
        justifyContent: 'center', 
        alignItems:'center', 
        borderRadius: 30, 
        padding: 5,
        backgroundColor: '#FFEEDD',
        borderColor: '#5571D7',
        shadowColor: "#9DD893",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
      },
})