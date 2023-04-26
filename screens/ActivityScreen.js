import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { firebase } from '../config';
import { database } from 'firebase/compat/database';

const ActivityScreen = () => {
  const [parkingTime, setParkingTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [userId, setUserId] = useState('')

  useEffect(() => { //Get User's Name
    const auth = firebase.auth();
    setUserId(auth.currentUser.uid);
  })

  useEffect(() => {
    const userRef = firebase.database().ref('users/' + userId);
    const listener = userRef.on('value', (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.parking_time) {
        setParkingTime(userData.parking_time);
        const { start_time, duration } = userData.parking_time;
        const endTime = start_time + duration * 60 * 1000;
        const intervalId = setInterval(() => {
          const now = Date.now();
          const diff = endTime - now;
          if (diff <= 0) {
            clearInterval(intervalId);
            setTimeLeft('00 h : 00 m : 00 s');
          } else {
            const hoursLeft = Math.floor(diff / (60 * 60 * 1000)).toString().padStart(2, '0');
            const minutesLeft = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)).toString().padStart(2, '0');
            const secondsLeft = Math.floor((diff % (60 * 1000)) / 1000).toString().padStart(2, '0');
            setTimeLeft(`${hoursLeft} h : ${minutesLeft} m : ${secondsLeft} s`);
          }
        }, 1000);
        return () => clearInterval(intervalId);
      } else {
        setTimeLeft('00:00:00');
      }
    }, (error) => {
      console.log(error);
      setTimeLeft('00:00:00');
    });
    return () => userRef.off('value', listener);
  }, [userId]);

  let amountToPay = 0;
  if (parkingTime && parkingTime.duration > 0) {
    const { duration } = parkingTime;
    if (duration <= 180) {
      amountToPay = 40;
    } else {
      const extraTime = Math.ceil((duration - 180) / 60);
      amountToPay = 40 + (extraTime * 20);
    }
  }

  if (!parkingTime) {
    return (
      <View style={{ padding: 20 }}>
        <Text>You have not parked yet.</Text>
        <Text>Time left: 00:00:00</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Time left: {timeLeft}</Text>
      <Text>Amount to pay: {amountToPay} PHP</Text>
    </View>
  );
};

export default ActivityScreen;
