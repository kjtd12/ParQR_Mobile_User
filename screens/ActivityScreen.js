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
  let motorcycleDeduct;

  paymentSettingsRef.once('value', (snapshot) => {
    const parkingPaymentData = snapshot.val();
    initialHours = parseInt(parkingPaymentData.initial_hours);
    initialPayment = parseInt(parkingPaymentData.initial_payment);
    incrementalPayment = parseInt(parkingPaymentData.incremental_payment);
    motorcycleDeduct = parseInt(parkingPaymentData.motorcycle_deduct);
    // Use the updated values of initialHours, initialPayment, and incrementalPayment within this listener if needed

    let paymentAmount = parseInt(initialPayment);

    const parkingRef = firebase.database().ref(`users/${userId}/parking_time`);
    const customerRef = firebase.database().ref('activeCustomer/' + userId);

    customerRef.once('value', async (snapshot) => {
      const customerVal = snapshot.val();

      if (customerVal) {
        const parkingSnapshot = await parkingRef.once('value');
        const parkingRefSnapshot = parkingSnapshot.val();

        if (parkingRefSnapshot && parkingRefSnapshot.start_time) {
          const discountRef = firebase.database().ref('activeCustomer/' + userId + '/discount');
          const discountSnapshot = await discountRef.once('value');
          const discountType = discountSnapshot.val();

          const duration = (new Date().getTime() - parkingRefSnapshot.start_time) / 1000;

          const durationInHours = Math.ceil(duration / (60 * 60));
          const durationInMinutes = Math.ceil((durationInHours % 3600) / 60);
          let additionalHoursWithCostFree;

          if (customerVal.vehicle_type == "motorcycle") {
            paymentAmount = paymentAmount - motorcycleDeduct;
          }

          paymentSettingsRef.once('value', (snapshot) => {
            const parkingSettingsData = snapshot.val();

            if (discountType !== "none") {
              const discountSettings = parkingSettingsData[discountType];

              additionalHoursWithCostFree = Math.max(Math.max(durationInHours - parseInt(discountSettings.costfree_amount), 0) - parseInt(initialHours), 0);

              if (duration == discountSettings.costfree_amount && durationInMinutes == 0) {
                paymentAmount = parseInt(0);
              }

              if (durationInHours <= discountSettings.costfree_amount) {
                paymentAmount = 0;
              } else if (additionalHoursWithCostFree === 0 && durationInMinutes > 0) {
                paymentAmount = 30;
              }

              if (additionalHoursWithCostFree > 0) {
                paymentAmount += additionalHoursWithCostFree * parseInt(incrementalPayment);
              }

              if (discountSettings) {
                if (discountSettings.discount_by === 'Percentage') {
                  const discountPercentage = parseFloat(discountSettings.amount) / 100;
                  let discountablePaymentAmount = paymentAmount;
                  discountablePaymentAmount -= discountablePaymentAmount * discountPercentage;
                  paymentAmount = parseFloat(Math.max(discountablePaymentAmount, 0));
                } else if (discountSettings.discount_by === 'Deduct') {
                  const discountAmount = parseFloat(discountSettings.amount);
                  let discountablePaymentAmount = paymentAmount;
                  discountablePaymentAmount -= discountAmount;
                  paymentAmount = parseFloat(Math.max(discountablePaymentAmount, 0));
                }
              }
            }

            setFloatPrice(parseFloat(paymentAmount).toFixed(2));
          });
        } else {
          // Handle the case where parking time data is not available
          console.log("Parking time data not found for user: ", userId);
        }
      }
    });
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