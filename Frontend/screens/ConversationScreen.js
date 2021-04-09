import HTTP_IP_DEV from '../mon_ip'
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
// import { GestureHandler } from 'expo';
import * as GestureHandler from 'react-native-gesture-handler'
import { useIsFocused } from "@react-navigation/native";

const { Swipeable } = GestureHandler


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function ConversationScreen(props) {
    const isFocused = useIsFocused();

    const [demandEnd, setDemandeEnd] = useState(false)
    const [token, setToken] = useState(null)
    const [myId, setMyId] = useState(null)
    const [data, setData] = useState([])
    const [currentMsg, setCurrentMsg] = useState("")
    const [myContactId, setMyContactId] = useState("")
    const [pseudo, setPseudo] = useState("")
    const [avatar, setAvatar] = useState("https://i.imgur.com/P3rBF8E.png")
    const [showDate, setShowDate] = useState(false)
    const [disableSendBtn, setDisableSendBtn] = useState(true)

    const scrollViewRef = useRef();

    async function loadMsg() {
        var rawResponse = await fetch(`/show-convers?convId=${props.route.params.convId}&myContactId=${props.route.params.myContactId}&token=${token}`, { method: 'GET' });
        var response = await rawResponse.json();
        setData(response.allMessagesWithOneUser)
        setPseudo(response.pseudo)
        // setAvatar(response.avatar)
        setMyContactId(props.route.params.myContactId)
    }

    var infoUser= props.route.params
    // console.log(infoUser,'<------ INFO À RENVOYER')

    useEffect(() => {
        AsyncStorage.getItem("token", function (error, tokenValue) {
            setToken(tokenValue)
            const getId = () => {
                fetch(HTTP_IP_DEV + '/get-id-from-token?token=' + tokenValue, { method: 'GET' })
                    .then(r => r.json())
                    .then(data => {
                        setMyId(data.id)
                    }).catch((e) =>
                        console.log('error', e)
                    )
            }
            getId()
        })
        loadMsg()
    }, [props.route.params.convId, token])


    useEffect(() => {
        // au focus du screen, le contenu de la page se réinitialise à interval 3 secondes
        // quand on quitte le screen, l'interval est stoppé
        if (isFocused) {
          const interval = setInterval(() => loadMsg(), 3000)
          return () => {
            console.log('fin')
            clearInterval(interval)
          }
        }
    
      }, [isFocused])

    var sendMsg = async () => {
        setDisableSendBtn(true)
        const rawResponseDemand = await fetch(`/send-msg`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `msg=${currentMsg}&myContactId=${myContactId}&myId=${myId}`
        });
        setCurrentMsg('')
        loadMsg()

        const responseDemand = await rawResponseDemand.json()

        if (responseDemand.demandEnd) {
            setDemandeEnd(responseDemand.demandEnd)
        }
    }

    var checkTextSize = (val) => {
        if (val.length > 0) {
            setDisableSendBtn(false)
        } else {
            setDisableSendBtn(true)
        }
    }

    var rightActions = (val) => {
        return (
            <View style={{justifyContent: "center"}}><Text style={styles.hoursRight}>{val}</Text></View>
        )
    }

    var leftActions = (val) => {
        return (
            <View style={{justifyContent: "center"}}><Text style={styles.hoursLeft}>{val}</Text></View>
        )
    }
    

    let dateCheck 
    let dateToShow

    var tabMsg = data.map((item, i) => {
        let when = new Date(item.date)
        // let whenFormat = when.toLocaleDateString('fr-FR', { weekday: 'short', month: 'numeric', day: 'numeric' })
        //     + ' à ' + when.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        let hours = when.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        let date = when.toLocaleDateString('fr-FR', { weekday: 'long', month: 'short', day: 'numeric' })
        if(date != dateCheck){
            dateCheck = date
            dateToShow = dateCheck
        } else {
            dateToShow = null
        }

        if (item.to_id === myContactId) {
            return  (
            <View key={i}>
                <Text style={styles.date}>{dateToShow}</Text>
                <View style={{justifyContent: "center", marginBottom: 10}}>
                    <Swipeable renderRightActions={()=> rightActions(hours)}>
                        <View style={styles.blocRight}>
                            <View style={styles.msgRight}>
                                <Text style={styles.textRight} >{item.content}</Text>
                            </View>
                        </View>
                    </Swipeable>
                </View>
            </View>)

        } else {
            return( 
            <View key={i}>
                <Text style={styles.date}>{dateToShow}</Text>
                <View style={{justifyContent: "center", marginBottom: 10}}>
                    <Swipeable renderLeftActions={()=> leftActions(hours)}>
                        <View style={styles.blocLeft}>
                            <View style={styles.msgLeft}>
                                <Text style={styles.textLeft} >{item.content}</Text>
                            </View>
                        </View>
                    </Swipeable>
                </View>
            </View>
            )
        }
    })

    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-between", backgroundColor: '#FFEEDD', paddingTop: 20, height: "100%" }}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('MessageScreen', { demandEnd })}>
                    <Ionicons name="chevron-back" size={30} color="#5571D7" style={{ alignSelf: 'center', marginTop: 3 }} />
                </TouchableOpacity>
                <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TouchableOpacity onPress={()=> props.navigation.navigate('UserProfilScreen', {
                      pseudo: infoUser.pseudo,
                      gender: infoUser.gender,
                      subscriptionDate: infoUser.subscriptionDate,
                      problemDesc : infoUser.problemDesc,
                      problems_types : infoUser.problems_types,
                      avatar: infoUser.avatar,
                      userID: infoUser.myContactId
                    })}> 
                  <Image source={{uri: infoUser.avatar}} style={{borderWidth:3, borderRadius:50, borderColor:'#EC9A1F', width:100, height:100}}/>
                </TouchableOpacity>
                    <Text style={styles.pseudo}>{pseudo}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="search" size={30} color="#5571D7" style={{ alignSelf: 'center', marginTop: 3 }} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1, width: "90%" }} showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={() => loadMsg()}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                {tabMsg}
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Input
                    containerStyle={{ marginBottom: 5, borderWidth: 2, minHeight: 40, maxHeight: 100, borderColor: "#8C8C8C", borderRadius: 20, backgroundColor: "white" }}
                    placeholder='Your message'
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    multiline={true}
                    value={currentMsg}
                    onChangeText={(val) => {
                        setCurrentMsg(val)
                        checkTextSize(val)
                    }}
                />
                <TouchableOpacity style={disableSendBtn ? styles.buttonSend : styles.buttonReadyToSend} onPress={() => sendMsg()} disabled={disableSendBtn}>
                    <Ionicons name="send" size={25} color="#FFEEDD" style={styles.sendButton} />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

export default ConversationScreen;

const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15

    },
    button: {
        backgroundColor: "#FFF1E2",
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor: '#5571D7',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15
    },
    pseudo: {
        textAlign: "center",
        fontSize: 20,
        color: "#5571D7",
        fontFamily: "Montserrat_700Bold",
    },
    blocLeft: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%"
    },
    msgLeft: {
        backgroundColor: "#BCC8F0",
        maxWidth: "80%",
        padding: 12,
        borderRadius: 15,
    },
    textLeft: {
        textAlign: "left",
        color: "#000000",
        //   fontFamily: "Montserrat_400Regular",
    },
    blocRight: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        width: "100%",

    },
    msgRight: {
        backgroundColor: "#5571D7",
        maxWidth: "80%",
        padding: 12,
        borderRadius: 15,
    },
    textRight: {
        textAlign: "right",
        color: "#FFFFFF",
        // fontFamily: "Montserrat_400Regular",
    },
    buttonSend: {
        backgroundColor: "#5571D7",
        padding: 10,
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor: '#5571D7',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        opacity: 0.3

    },
    buttonReadyToSend: {
        backgroundColor: "#5571D7",
        padding: 10,
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor: '#5571D7',
        shadowColor: "black",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
    },
    sendButton: {
        alignSelf: 'center',
        marginLeft: 3,
        marginBottom: 5,
        transform: [{ rotate: '-45deg' }]
    },
    date: {
        color: '#767676',
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 8,
    },
    hoursRight: {
        color: '#767676',
        textAlign: 'center',
        marginLeft: 7
    },
    hoursLeft: {
        color: '#767676',
        textAlign: 'center',
        marginRight: 7
    }
})