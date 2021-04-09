import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_900Black, Montserrat_800ExtraBold, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import AppLoading from 'expo-app-loading';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

import HTTP_IP_DEV from '../mon_ip'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Filter(props) {

  const isFocused = useIsFocused();

  const [ageMin, setAgeMin] = useState(null)
  const [ageMax, setAgeMax] = useState(null)
  const [localisation, setLocalisation] = useState()
  const [problems, setProblems] = useState(['Amoureux'])
  const [genderSelected, setGenderSelected] = useState(['other'])
  const [isAdult, setIsAdult] = useState(false)

  var franceLocalisation = 'France'
  // const [problemsStatut, setProblemsStatut] = useState({ Amoureux: false, Familial: false, Physique: false, Professionnel: false, Scolaire: false })
  // const [genderStatut, setGenderStatut] = useState({other: true, male: true, female: true })

  useEffect(() => {
    AsyncStorage.getItem("filter", async function(error, data) {
      var dataStorage = await JSON.parse(data)
      console.log(dataStorage, '<------ DATA STORAGE ON USEFFECT')
      if(dataStorage.localisation[0] >= 90 || dataStorage.localisation == 'France') {
        setLocalisation(franceLocalisation)
      }else {
        setLocalisation(dataStorage.localisation[0])
      }
      setProblems(dataStorage.problemsTypes);
      setAgeMin(dataStorage.age.minAge);
      setAgeMax(dataStorage.age.maxAge);
      setGenderSelected(dataStorage.gender);
     });
  }, [isFocused]);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black,
    Montserrat_800ExtraBold,
    Montserrat_600SemiBold
  });

  const handleClickBack = () => {
    props.navigation.navigate('BottomNavigator', { screen: 'HomeScreen' })
  }

  const handleSelectGender = (element) => {
    if(genderSelected.includes(element) == false){
      var genderCopy = [...genderSelected];
      genderCopy.push(element);
      setGenderSelected(genderCopy);
    } else if (genderSelected.includes(element) == true) {
      var genderCopy = [...genderSelected];
      genderCopy = genderCopy.filter(e => e != element);
      setGenderSelected(genderCopy);
    }
  }

  const handleSelectProblems = (element) => {
    var problemsCopy = [...problems]
    if(problemsCopy.includes(element) == false) {
      problemsCopy.push(element);
      setProblems(problemsCopy);
    } else {
      problemsCopy = problemsCopy.filter(e => e != element);
      setProblems(problemsCopy);
    }
  }

  const handleSaveFilter = () => {
    AsyncStorage.setItem('filter', JSON.stringify(
      {
        problemsTypes: problems, 
        gender: genderSelected, 
        age: {
          minAge: ageMin, 
          maxAge: ageMax,
        },
        localisation: localisation
      }
    ));
    props.navigation.navigate('BottomNavigator', { screen: 'HomeScreen' })
  }
  
 
  var problemsBadge = [
    <TouchableOpacity onPress={() => { handleSelectProblems(`Amoureux`) }} style={problems.includes('Amoureux') ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Amoureux</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Familial`) }} style={problems.includes('Familial') ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Familial</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Physique`) }} style={ problems.includes('Physique') ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Physique</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Professionnel`) }} style={ problems.includes('Professionnel') ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Professionnel</Text></TouchableOpacity>,
    <TouchableOpacity onPress={() => { handleSelectProblems(`Scolaire`) }} style={ problems.includes('Scolaire') ? styles.badgeBis : styles.badge}><Text style={styles.fontBadge}>Scolaire</Text></TouchableOpacity>
  ]

  var imagesGender = [
    { unSelected: <TouchableOpacity onPress={() => { handleSelectGender(`other`) }}><Image source={require('../assets/gender_1.png')} /></TouchableOpacity>, selected: <TouchableOpacity onPress={() => { handleSelectGender(`other`) }}><Image source={require('../assets/gender_1_selected.png')} /></TouchableOpacity> },
    { unSelected: <TouchableOpacity onPress={() => { handleSelectGender(`male`) }}><Image source={require('../assets/gender_male.png')} /></TouchableOpacity>, selected: <TouchableOpacity onPress={() => { handleSelectGender(`male`) }}><Image source={require('../assets/gender_male_selected.png')} /></TouchableOpacity> },
    { unSelected: <TouchableOpacity onPress={() => { handleSelectGender(`female`) }}><Image source={require('../assets/gender_female.png')} /></TouchableOpacity>, selected: <TouchableOpacity onPress={() => { handleSelectGender(`female`) }}><Image source={require('../assets/gender_female_selected.png')} /></TouchableOpacity> },
  ];


  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (

      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.buttonPrevious} onPress={() => handleClickBack()} >
            <Ionicons name="chevron-back" size={30} color="#5571D7" style={{ alignSelf: 'center',}} />
          </TouchableOpacity>
          <Text style={styles.textTitle}>Mes filtres</Text>
        </View>
        <View style={styles.problemsSelect}>
          <Text style={styles.titleProblems}>J'aimerais parler de soucis...</Text>
          <View style={styles.badgeContainer}>
            {problemsBadge}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.titleProblems}>Je veux parler avec :</Text>
          <View style={styles.genderContainer}>
            {genderSelected.includes(`other`) ? imagesGender[0].selected : imagesGender[0].unSelected }
            {genderSelected.includes(`male`) ? imagesGender[1].selected : imagesGender[1].unSelected}
            {genderSelected.includes(`female`) ? imagesGender[2].selected : imagesGender[2].unSelected}
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={styles.titleProblems}>Age :</Text>
            <Text style={styles.textDynamic}>min: {ageMin}</Text>
            <Text style={styles.textDynamic}>max: {ageMax}</Text>
          </View>
          <MultiSlider
            selectedStyle={styles.selectedStyle}
            unselectedStyle={styles.unselectedStyle}
            style={styles.sliderLabel}
            markerStyle={styles.markerStyle}
            min={18}
            max={100}
            values={[ageMin, ageMax]}
            enabledTwo
            onValuesChange={value => { setAgeMin(value[0]); setAgeMax(value[1]) }}
            onValuesChangeFinish={value => { setAgeMin(value[0]); setAgeMax(value[1]) }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.titleProblems}>Distance :</Text>
            <Text style={styles.textDynamic}>{localisation == 'France' || localisation > 90 ? franceLocalisation : `${localisation} km`}</Text>
          </View>
          <MultiSlider
            selectedStyle={styles.selectedStyle}
            unselectedStyle={styles.unselectedStyle}
            markerStyle={styles.markerStyle}
            min={0}
            max={100}
            values={localisation != "France" ? [localisation] : [91]}
            enabledTwo
            onValuesChange={value => { value > 90 ? setLocalisation(franceLocalisation) : setLocalisation(value)}}
            pressedMarkerStyle={styles.stepLabelStyle}
            allowOverlap={false}

          />

          <Button
            title="enregistrer"
            type="solid"
            buttonStyle={styles.buttonSave}
            titleStyle={{
              fontFamily: 'Montserrat_700Bold'
            }}
          //   onPress={() => props.navigation.navigate('Quizz')}
          onPress={() => handleSaveFilter()}
          />
        </View>
      </View>

    );
  }
}

export default Filter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFF1E2',
    width: windowWidth,
    height: windowHeight,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 40,
    marginBottom: 20,
    width: '85%',
  },
  buttonPrevious: {
    backgroundColor: "#FFEEDD",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#5571D7',
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5
  },
  textTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontWeight: "900",
    fontSize: 26,
    lineHeight: 32,
    color: '#5571D7',
    left: '95%',
  },
  problemsSelect: {

  },
  badge: {
    backgroundColor: '#BCC8F0',
    margin: 2,
    fontSize: 10,
    borderRadius: 30,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  badgeBis: {
    backgroundColor: '#5571D7',
    margin: 2,
    fontSize: 10,
    borderRadius: 30,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  fontBadge: {
    color: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
  },
  badgeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '85%',
    marginBottom: 10,
  },
  titleProblems: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 20,
    marginBottom: 10,
    color: '#5571D7'
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  genderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonSave: {
    backgroundColor: '#5571D7',
    borderRadius: 86,
    width: 159,
    marginLeft: 60,
    marginBottom: 20,
  },
  markerStyle: {
    backgroundColor: '#EC9A1F',
    borderWidth: 0,
    width: 30,
    height: 30
  },
  selectedStyle: {
    height: 4,
    backgroundColor: '#5571D7'
  },
  unselectedStyle: {
    backgroundColor: '#BCC8F0'
  },
  sliderLabel: {
    bottom: 0,
    minWidth: 10,
    padding: 8,
    backgroundColor: 'red',
  },
  trackStyle: {
    backgroundColor: 'red'
  },
  textDynamic: {
    fontFamily: 'Montserrat_700Bold',
    color: '#EC9A1F',
    fontSize: 18
  }
})