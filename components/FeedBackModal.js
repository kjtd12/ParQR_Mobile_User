import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../config'
import { database } from 'firebase/compat/database';

const feedbackRef = firebase.database().ref('feedback_messages')
const usersCollection = firebase.firestore().collection('users');

const FeedBackModal = ({userId}) => {
    const [feedback, setFeedback] = useState('');

    const sendFeedback = async () => {
        try {
          // Retrieve user's name from Firestore
          const userDoc = await usersCollection.doc(userId).get();
          const userName = userDoc.data().name;
      
          // Get current date and time
          const currentDate = new Date();
          const dateTime = currentDate.toISOString();
      
          // Prepare feedback data
          const feedbackData = {
            feedback: feedback,
            userName: userName,
            date: dateTime,
          };
      
          // Save feedback in the database
          feedbackRef.push(feedbackData);
      
          // Clear feedback input
          setFeedback('');
        } catch (error) {
          console.error('Error sending feedback:', error);
        }
      };

  return (
    <View>
      <TextInput
        style={{
          width: '100%',
          borderRadius: 15,
          borderColor: '#213A5C',
          borderWidth: 1,
          alignItems: 'center',
          padding: 20,
          marginBottom: 10,
        }}
        placeholder="Feedback"
        value={feedback}
        onChangeText={setFeedback}
      />
      <TouchableOpacity
        style={{
          width: '100%',
          borderRadius: 15,
          borderColor: '#213A5C',
          borderWidth: 1,
          alignItems: 'center',
          padding: 10,
        }}
        onPress={sendFeedback}
      >
        <Text>Send Feedback</Text>
      </TouchableOpacity>
    </View>
  )
}

export default FeedBackModal
