import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react'
import QRCode from 'react-native-qrcode-svg';
import { firebase } from '../config'

const QrScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    // Subscribe to Firebase Authentication state changes
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Unsubscribe from Firebase Authentication state changes on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Get the user's UID and store it in a variable
    if (currentUser) {
      setUserUid(currentUser.uid);
    }
  }, [currentUser]);

  console.log(userUid);

  return (
    <View style={styles.container}>
      {userUid && <QRCode value={userUid} />} 
      <StatusBar style="auto" />
    </View>
  )
}

export default QrScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
})