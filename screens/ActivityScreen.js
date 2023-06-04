import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet  } from 'react-native';
import { firebase } from '../config';
import { database } from 'firebase/compat/database';

const ActivityScreen = () => {
  const [parkingTime, setParkingTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userId, setUserId] = useState('')
  const [floatPrice, setFloatPrice] = useState(0);

  useEffect(() => { //Get User's Name
    const auth = firebase.auth();
    setUserId(auth.currentUser.uid);
  })

  useEffect(() => {
    const userRef = firebase.database().ref('users/' + userId);
    const parkingTimeRef = userRef.child('parking_time');
    let intervalId;
  
    const startListener = parkingTimeRef.child('start_time').on('value', (snapshot) => {
      const startTime = snapshot.val();
      if (startTime) {
        const diff = Date.now() - startTime;
        setElapsedTime(diff < 0 ? 0 : diff);
        intervalId = setInterval(() => {
          const now = Date.now();
          const diff = now - startTime;
          setElapsedTime(diff < 0 ? 0 : diff);
        }, 1000);
      } else {
        setElapsedTime(0);
        clearInterval(intervalId);
      }
    });
  
    return () => {
      userRef.off('value', startListener);
      clearInterval(intervalId);
    };
  }, [userId]);

  const formatTime = (time) => {
    const hours = Math.floor(time / (60 * 60 * 1000)).toString().padStart(2, '0');
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000)).toString().padStart(2, '0');
    const seconds = Math.floor((time % (60 * 1000)) / 1000).toString().padStart(2, '0');
    return `${hours} h : ${minutes} m : ${seconds} s` ;
  }

  const paymentSettingsRef = firebase.database().ref('parking_payment_settings');
  let initialHours;
  let initialPayment;
  let incrementalPayment;

  paymentSettingsRef.once('value', (snapshot) => {
    const parkingPaymentData = snapshot.val();
    initialHours = parseInt(parkingPaymentData.initial_hours);
    initialPayment = parseInt(parkingPaymentData.initial_payment);
    incrementalPayment = parseInt(parkingPaymentData.incremental_payment);

    let amountToPay = 0;
    const ratePerHour = incrementalPayment;
    const minimumCharge = initialPayment;

    if (elapsedTime <= initialHours * 60 * 60 * 1000) {
      if (elapsedTime === 0) {
        amountToPay = 0;
      } else {
        amountToPay = minimumCharge;
      }
    } else {
      const extraTime = Math.floor((elapsedTime - initialHours * 60 * 60 * 1000) / (60 * 60 * 1000));
      amountToPay = minimumCharge + (extraTime * ratePerHour);
    }

    setFloatPrice(parseFloat(amountToPay).toFixed(2));
  });

  let string = "Total Amount of Parking Fee"
  let string_1 = "(Before applicable discount)"

  if (!parkingTime) {
  
    return (
      <View  style={styles.container}>
        <Text style={{ color: '#213A5C', marginVertical: 40, fontSize: 18, fontWeight: 'bold' }}>Parking Activity</Text>
        <Image
          source={ require('../assets/Timer1.png') }
        />
        <Text style={{ color: '#213A5C', marginVertical: 20, fontSize: 36, fontWeight: 'bold' }}>{formatTime(elapsedTime)}</Text>
        <Text style={{ color: 'gray' }}>{string} </Text>
        <Text style={{ color: 'gray' }}>{string_1} </Text>
        <Text style={{ color: '#213A5C', marginVertical: 10, fontSize: 24, fontWeight: 'bold' }}>PHP {floatPrice}</Text>
      </View>
    );
  }

  return (
    <View  style={styles.container}>
      <Text style={{ color: '#213A5C', marginVertical: 40, fontSize: 18, fontWeight: 'bold' }}>Parking Activity</Text>
        <Image
          source={ require('../assets/Timer1.png') }
        />
        <Text style={{ color: '#213A5C', marginVertical: 20, fontSize: 36, fontWeight: 'bold' }}>{formatTime(elapsedTime)}</Text>
        <Text style={{ color: 'gray' }}>{string} </Text>
        <Text style={{ color: 'gray' }}>{string_1} </Text>
        <Text style={{ color: '#213A5C', marginVertical: 10, fontSize: 24, fontWeight: 'bold' }}>PHP {floatPrice}</Text>
    </View>
  );
};


export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});