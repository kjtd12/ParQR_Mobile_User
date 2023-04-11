import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native'
import {useNavigation} from '@react-navigation/core'
import React, { useState, useEffect} from 'react'
import { firebase } from '../config'

const SplashScreen = () => {
  const [name, setName] = useState('')
  const navigation = useNavigation()

  const getStartedHandler = () => { 
    navigation.replace('App')
  }

  useEffect(() => { //Get User's Name
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setName(snapshot.data())
      } else {
        console.log('user does not exist')
      }
    })
  })

  return (
    <View style={[styles.container, styles.shadow]}>
        {/* <Text>Landing</Text> */}
        <Image 
            source={require('../assets/welcome.png')}
            style={{width: 360, height: 300, marginBottom: 20}}
        />
        <View>
        <Text style={{fontSize: 23, fontWeight: 'bold', color: '#213A5C', marginBottom: 20}}>
          Welcome, {name.name} 
        </Text>
        </View>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#213A5C', alignItems: 'center'}}>Let's Begin!</Text>
        <Image 
            source={require('../assets/started.png')}
            style={{width: 150, height: 150, marginTop: 15, marginBottom: 15}}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.line} />
                <TouchableOpacity 
                    onPress={getStartedHandler}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  button: {
      backgroundColor: '#F3BB01',
      width: '100%',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
  },
  buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
  },
  shadow: {
      shadowColor: "#7F5DF0",
      shadowOffset: {
          width: 0,
          height: 10
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5
  },
  text: {
      marginTop: 20,
      marginBottom: 20,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginVertical: 10,
  },
})