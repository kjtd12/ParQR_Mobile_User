import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Image  } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../config'
import React, {useState, useEffect} from 'react'
import moment from 'moment';

const MyWallet = () => {
  const [data, setData] = useState([])
  const [topUpHistory, setTopUpHistory] = useState([])
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setData(snapshot.data());
          setTopUpHistory(snapshot.data().top_up_history ? snapshot.data().top_up_history.slice().reverse() : [])
        } else {
          console.log('user does not exist');
        }
      });

    return unsubscribe;
  }, [])

  const renderListItem = ({ item }) => {

    return (
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image
            source={ require('../../assets/icons/Wallet.png') }
          />
          <View>
            <Text style={[styles.cardDate, { color: '#606470' }]}>{moment(item.datetime, 'MM-DD-YYYYTHH:mm:ss').format('MMM DD, YYYY')}</Text>
            <Text style={[styles.cardTime, { color: '#606470' }]}>{item.datetime[1]}</Text>
          </View>
        </View>
        <Text style={[styles.cardAmount, { color: '#F3BB01' }]}>{`+₱${item.amount.toFixed(2)}`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardTop}>
        <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, alignItems: 'flex-start' }}>
            <Image
                source={ require('../../assets/icons/ArrowLeft.png') }
                style={{ tintColor: 'white' }}
              />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>My Wallet</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <View style={{ marginLeft: 20, marginTop: 40 }}>
        <Text style={[styles.balance, styles.cardTopText, { color: '#aaa', fontWeight: 'normal' }]}>
          Hi, {data?.name || 'User'}!
        </Text>
        <Text style={[styles.balance, styles.cardTopText]}>
          Total Balance
        </Text>
        <Text style={{ fontSize: 42, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>
          ₱ {data?.e_wallet?.toFixed(2) || '0.00'}
        </Text>
        </View>
      </View>
      <Text style={[styles.label, { color: '#213A5C' }]}>Top-up History</Text>
      <FlatList
        data={topUpHistory}
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
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  cardTop: {
    backgroundColor: '#213A5C',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTime: {
    fontSize: 14,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
  },
  cardTopText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalQRCode: {
    marginVertical: 20,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#F3BB01',
    borderRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 10,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
