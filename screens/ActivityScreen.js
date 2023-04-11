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
            setTimeLeft('00:00:00');
            alert('Your parking time has ended!');
          } else {
            const hoursLeft = Math.floor(diff / (60 * 60 * 1000)).toString().padStart(2, '0');
            const minutesLeft = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)).toString().padStart(2, '0');
            const secondsLeft = Math.floor((diff % (60 * 1000)) / 1000).toString().padStart(2, '0');
            setTimeLeft(`${hoursLeft}:${minutesLeft}:${secondsLeft}`);
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

  if (!parkingTime) {
    return (
      <View style={{ padding: 20 }}>
        <Text>You have not parked yet.</Text>
        <Text>Time left: 00:00:00</Text>
      </View>
    );
  }

  const { start_time, duration } = parkingTime;
  const endTime = start_time + duration * 60 * 1000;
  const endDateTime = new Date(endTime).toLocaleString();

  return (
    <View style={{ padding: 20 }}>
      <Text>Your parking time:</Text>
      <Text>Start time: {new Date(start_time).toLocaleString()}</Text>
      <Text>End time: {endDateTime}</Text>
      <Text>Time left: {timeLeft}</Text>
    </View>
  );
};

export default ActivityScreen;
