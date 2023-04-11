import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '../config';

const ParkingHistoryScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);

  useEffect(() => {
    const userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    const listener = userRef.on('value', (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.parking_time_history) {
        setParkingHistory(Object.values(userData.parking_time_history));
      }
    });
    return () => userRef.off('value', listener);
  }, []);

  const renderParkingItem = ({ item }) => {
    const { start_time, duration, operator_name, price } = item;
    const end_time = start_time + duration * 60 * 1000;
    const startDateTime = new Date(start_time).toLocaleTimeString();
    const endDateTime = new Date(end_time).toLocaleTimeString();
    const formattedPrice = price ? `$${price.toFixed(2)}` : 'N/A';
    return (
      <View style={styles.card}>
        <Text style={styles.label}>Start time:</Text>
        <Text style={styles.text}>{startDateTime}</Text>
        <Text style={styles.label}>End time:</Text>
        <Text style={styles.text}>{endDateTime}</Text>
        {operator_name && (
          <>
            <Text style={styles.label}>Operator:</Text>
            <Text style={styles.text}>{operator_name}</Text>
          </>
        )}
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.text}>{formattedPrice}</Text>
      </View>
    );
  };

  if (!parkingHistory.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>You haven't parked yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={parkingHistory}
        renderItem={renderParkingItem}
        keyExtractor={(item) => item.start_time.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    margin: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  text: {
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#444',
  },
  list: {
    flex: 1,
    width: '100%',
  },
});

export default ParkingHistoryScreen;
