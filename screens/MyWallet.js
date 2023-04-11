import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config'
import React, {useState, useEffect} from 'react'
import moment from 'moment';

const MyWallet = () => {
  const [data, setData] = useState('')
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setData(snapshot.data());
        } else {
          console.log('user does not exist');
        }
      });

    return unsubscribe;
  }, [])

  const renderListItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <Text>{moment(new Date(item.datetime)).format('MM/DD/YYYY hh:mm a')}</Text>
        <Text>{`+₱${item.amount.toFixed(2)}`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.replace('App', {screen: 'Profile'})}>
        <Text style={{ margin: 30 }}>Back</Text>
      </TouchableOpacity>
      <Text>MyWallet</Text>
      <Text style={styles.name}>Total Balance: ₱{data.e_wallet?.toFixed(2)}</Text>
      <FlatList
        data={data.top_up_history}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
    </View>
  )
}

export default MyWallet

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
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    flex: 1,
    width: '100%',
  },
});