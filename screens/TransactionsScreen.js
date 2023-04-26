import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '../config';

const ParkingHistoryScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);
  const [searchText, setSearchText] = useState('');

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
    const { start_time, duration, operator_name, payment } = item;
    const date = new Date(start_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const startTime = new Date(start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTime = new Date(start_time + duration * 60 * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const formattedPrice = parseInt(payment) ? `${parseInt(payment).toFixed(2)} PHP` : 'N/A';
    
    return (
      <TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.row}>
              <Image
                source={{ uri: 'https://via.placeholder.com/30x30' }}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
              <View style={{ marginLeft: 15, marginTop: 5 }}>
                <Text style={styles.date}>{date}</Text>
                {operator_name && (
                  <Text style={styles.operator}>Operator: {operator_name}</Text>
                )}
              </View>
            </View>
            <View style={styles.row_1}>
              <View style={{ marginTop: 5, alignItems: 'flex-end' }}>
                <Text style={[styles.price, { color: '#F3BB01' }]}>{formattedPrice}</Text>
                <Text style={styles.time}>{startTime} - {endTime}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
      <View style={[styles.searchContainer, { marginTop: 40 }]}>
        <Image
          source={{ uri: 'https://www.freeiconspng.com/uploads/search-icon-png-7.png' }}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          // onChangeText={handleSearch}
          // value={searchQuery}
        />
      </View>
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
    backgroundColor: '#F5F5F5',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  row_1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  row_2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  operator: {
    fontSize: 10,
  },
  time:{
    fontSize: 10,
  },
  list:{
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF1F8',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: 'black',
  },
});



export default ParkingHistoryScreen;
