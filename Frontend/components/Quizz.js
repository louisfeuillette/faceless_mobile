import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { StyleSheet, Text, View, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  HTTP_IP_DEV from '../mon_ip'

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_900Black,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function quizz(props) {

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailCondition, setEmailCondition] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordStatut, setPasswordStatut] = useState(true)
  const [pseudo, setPseudo] = useState('')
  const [pseudoError, setPseudoError] = useState('')
  const [pseudoStatut, setPseudoStatut] = useState(true)
  const [birthDate, setBirthDate] = useState(new Date())
  const [birthDateStatut, setBirthDateStatut] = useState(true)
  const [problems, setProblems] = useState([])
  const [problemsStatut, setProblemsStatut] = useState(true)


  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
  });

  const problemsContent = [
    {
      name: 'Amoureux',
      icon: 'heart',
    },
    {
      name: 'Familial',
      icon: 'people-sharp',
    },
    {
      name: 'Physique',
      icon: 'body',
    },
    {
      name: 'Professionnel',
      icon: 'briefcase',
    },
    {
      name: 'Scolaire',
      icon: 'school',
    },
  ]


  const [visible, setVisible] = useState([false, false, false, false, false])
  const [showDate, setShowDate] = useState(false);
  const [dateToDisplay, setDateToDisplay] = useState('JJ/MM/AAAA')

  const handleOnNextEmail = async () => {
    var rawResponse = await fetch(`/email-check`, {
     method: 'POST',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     body: `emailFront=${email}`
    });
    var response = await rawResponse.json()
    if(response.result == false){
      setEmailError(response.error)
      setEmailCondition(true)
    } else {
      setEmailCondition(false)
    }
    
  }

  const handleOnNextPseudo = async () => {

    var rawResponse = await fetch(`/pseudo-check`, {
     method: 'POST',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     body: `pseudoFront=${pseudo}`
    });
    var response = await rawResponse.json()
    if(response.result == true) {
      setPseudoStatut(true)
      setPseudoError(response.error)
      console.log(pseudoError, '<------ state pseudo error')
    } else {
      setPseudoStatut(false)
    }
  }


  const handleSelectProblem = (index) => {
    const problemCopy = [...visible]
    problemCopy[index] = !problemCopy[index]
    setVisible(problemCopy)
    if (problemCopy[index] == true) {
      setProblems([...problems, problemsContent[index].name])
    };
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    // setShow(Platform.OS === 'ios')
    var day = currentDate.getDate()
    if (day < 10) {
      day = `0${currentDate.getDate()}`
    }
    var month = (currentDate.getMonth() + 1)
    if (month < 10) {
      month = `0${currentDate.getMonth() + 1}`
    }
    var year = currentDate.getFullYear().toString()
    var dateDisplay = `${day}/${month}/${year}`
    setDateToDisplay(dateDisplay)
    setBirthDate(currentDate)
  };



  const handleSubmit = async () => {
    props.navigation.navigate('OptionalQuizz')
    props.onAddUserInfo({
      email: email,
      password: password,
      pseudo: pseudo, 
      birthDate: birthDate,
      problems: problems,
    })
    userInfo = props.userDisplay
    var rawResponse = await fetch(`/sign-up-first-step`, {
     method: 'POST',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     body: `emailFront=${email}&passwordFront=${password}&pseudoFront=${pseudo}&birthDateFront=${birthDate}&problemsFront=${JSON.stringify(problems)}`
    });
    var response = await rawResponse.json()
    
    AsyncStorage.setItem("token", response.userSaved.token)

    dateNow = new Date()
    var conditionAge = (86400000*365)*18
    var differenceDates = (dateNow - birthDate)
    var isAdult;

    differenceDates > conditionAge ? isAdult = true : isAdult = false // On vérifie age > 18yo, if > => isAdult = true else isAdult = false

      isAdult == true ? AsyncStorage.setItem("filter", JSON.stringify({ // si isAdult == true alors on set le min age du filter à l'âge de l'user et le max age à l'age de l'user +10 ans
        problemsTypes: problems, 
        gender: ['other', 'male', 'female'],
        age: {
          minAge: 18, 
          maxAge: 100,
        },
        localisation: 'France'
      })) : AsyncStorage.setItem("filter", JSON.stringify({ // sinon on set le min age du filter à l'âge et l'user et le max age à 18ans
          problemsTypes: problems, 
          gender: ['other', 'male', 'female'], 
          age: {minAge: 13, maxAge: 17},
          localisation: 'France'
        }))
  } 

  


  const handlePressDateBirth = () => {
    setShowDate(!showDate)
  }

  var allProblems = problemsContent.map((item, i) => {
    return (
      <Pressable key={i} style={visible[i] ? styles.problemCardBis : styles.problemCard}
        onPress={() => {handleSelectProblem(i);}}
      >
        <Ionicons name={item.icon} size={24} color="#5571D7" />
        <Text style={styles.textProblem}>{item.name}</Text>
      </Pressable>)
  }
  )

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <ProgressSteps
            completedStepIconColor='#5571D7'
            progressBarColor='#BCC8F0'
            completedProgressBarColor='#5571D7'
            activeStepIconColor='#5571D7'
            activeStepIconBorderColor='#BCC8F0'
            disabledStepNumColor='#BCC8F0'
            disabledStepIconColor='#BCC8F0'
            completedStepNumColor='#5571D7'
            activeStepNumColor='#5571D7'
            completedCheckColor='#5571D7'
            topOffset={windowHeight - 100}
          >
            <ProgressStep nextBtnText='valider'
              nextBtnStyle={styles.buttonNext}
              nextBtnTextStyle={styles.buttonNextText}
              onNext={handleOnNextEmail}
              errors={emailCondition}
            >
              <View style={styles.stepContainer}>
                <Text style={styles.textTitleQuizz}>Salut,</Text>
                <Text style={styles.textQuizz}>C'est quoi ton email ?</Text>
                <Input
                  keyboardType={"email-address"}
                  placeholder='helicoptere530@gmail.com'
                  inputContainerStyle={styles.inputQuizz}
                  onChangeText={email => {setEmail(email)}}
                />
                {emailCondition == true ? <Text style={styles.emailError}>{emailError}</Text> : <View></View>}
              </View>
            </ProgressStep>
            <ProgressStep
              nextBtnStyle={styles.buttonNext}
              nextBtnTextStyle={styles.buttonNextText}
              nextBtnText='valider'
              previousBtnTextStyle={styles.buttonPreviousText}
              previousBtnText='Revoir'
              previousBtnStyle={styles.buttonPrevious}
              // errors={passwordStatut}
            >
              <View style={styles.stepContainer}>
                <Text style={styles.textQuizz}>Créé ton mot de passe</Text>
                <Input
                  placeholder='*****'
                  inputContainerStyle={styles.inputQuizz}
                  onChangeText={password => {setPassword(password)}}
                />
              </View>
            </ProgressStep>
            <ProgressStep
              nextBtnStyle={styles.buttonNext}
              nextBtnTextStyle={styles.buttonNextText}
              nextBtnText='valider'
              previousBtnTextStyle={styles.buttonPreviousText}
              previousBtnText='Revoir'
              previousBtnStyle={styles.buttonPrevious}
              onNext={handleOnNextPseudo}
              errors={pseudoStatut}
            >
              <View style={styles.stepContainer}>
                <Text style={styles.textQuizz}>Comment veux-tu qu'on t'appelle ?</Text>
                <Input
                  placeholder='ThermomixMT1820'
                  inputContainerStyle={styles.inputQuizz}
                  onChangeText={pseudo => {setPseudo(pseudo)}}
                  value={pseudo}
                />
                {pseudoStatut == true ? <Text style={styles.pseudoError}>{pseudoError}</Text> : <View></View>}
              </View>
            </ProgressStep>
            <ProgressStep
              nextBtnStyle={styles.buttonNext}
              nextBtnTextStyle={styles.buttonNextText}
              nextBtnText='valider'
              previousBtnTextStyle={styles.buttonPreviousText}
              previousBtnText='Revoir'
              previousBtnStyle={styles.buttonPrevious}>
              <View style={styles.stepContainer}>
                <Text style={styles.textQuizz}>C'est quoi ta date de naissance ?</Text>
                <TouchableOpacity
                  style={styles.buttonDate}
                  onPress={handlePressDateBirth}
                >
                  <Text style={styles.birthDate}>{dateToDisplay}   <Ionicons name="calendar" size={18} color="black" /></Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '100%', bottom: 100 }}>
                {showDate ? <DateTimePicker
                  testID="dateTimePicker"
                  value={birthDate} mode='date'
                  is24Hour={true}
                  display="spinner"
                  style={{ width: '100%' }}
                  onChange={onChange} /> : <Text></Text>}
              </View>
            </ProgressStep>
            <ProgressStep
              nextBtnStyle={styles.buttonNext}
              nextBtnTextStyle={styles.buttonNextText}
              nextBtnText='valider'
              previousBtnTextStyle={styles.buttonPreviousText}
              previousBtnText='Revoir'
              previousBtnStyle={styles.buttonPrevious}
              onSubmit={handleSubmit}>
              <View style={styles.stepContainer}>
                <Text style={styles.textQuizz}>Sélectionne ton ou tes soucis</Text>
                {allProblems}
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { 
    userDisplay: state.user
   }
 }

function mapDispatchToProps(dispatch) {
  return {
    onAddUserInfo: function (arg) {
      dispatch({ type: 'ADD_USER', payload: arg })
    }
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(quizz);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNext: {
    backgroundColor: '#5571D7',
    width: 130,
    borderRadius: 86,
    marginBottom: 25,
    bottom: 70,
  },
  buttonPrevious: {
    // borderWidth: 1,
    // borderColor: 'black',
    bottom: 95,

  },
  buttonPreviousText: {
    color: '#EC9A1F',
    width: 'auto',
    fontFamily: 'Montserrat_700Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    marginHorizontal: 20
  },
  buttonNextText: {
    color: '#FFF1E2',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  inputQuizz: {
    borderColor: 'black',
    right: 10
  },
  textTitleQuizz: {
    color: '#5571D7',
    fontFamily: 'Montserrat_900Black',
    fontSize: 56,
  },
  textQuizz: {
    color: '#5571D7',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20,
  },
  count: {
    top: windowHeight / 4,
  },
  stepContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '70%',
    height: windowHeight / 2,
    left: 60,
  },
  problemCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: windowHeight / 20,
    padding: 4,
    backgroundColor: '#FFCC99',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    margin: 10,
  },
  textProblem: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    marginRight: 30,
    textAlign: 'center',
  },
  problemCardBis: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: windowHeight / 20,
    padding: 4,
    backgroundColor: '#BCC8F0',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    margin: 10,
  },
  buttonDate: {
    backgroundColor: "#FFF1E2",
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
  },
  birthDate: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18
  },
  emailError: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18,
    color: 'red',
  },
  pseudoError: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18,
    color: 'red',
  }
});
