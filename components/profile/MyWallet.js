import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal  } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { firebase } from '../../config'
import React, {useState, useEffect} from 'react'
import moment from 'moment';

const MyWallet = () => {
  const [data, setData] = useState([])
  const [topUpHistory, setTopUpHistory] = useState([])
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setData(snapshot.data());
          setTopUpHistory(snapshot.data().top_up_history.slice().reverse())
        } else {
          console.log('user does not exist');
        }
      });

    return unsubscribe;
  }, [])

  const renderListItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.cardDate}>{moment(item.datetime, 'MM-DD-YYYYTHH:mm:ss').format('MMM DD, YYYY')}</Text>
          <Text style={styles.cardTime}>{moment(item.datetime, 'MM-DD-YYYYTHH:mm:ss').format('hh:mm a')}</Text>
        </View>
        <Text style={[styles.cardAmount, { color: '#F3BB01' }]}>{`+₱${item.amount.toFixed(2)}`}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardTop}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.replace('App', { screen: 'Profile' })}>
            <Text style={styles.cardTopText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, styles.cardTopText]}>My Wallet</Text>
        <Text style={[styles.balance, styles.cardTopText]}>Total Balance</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>₱{data.e_wallet?.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text style={[styles.cardTopText, { marginLeft: 10 }]}>QR Code</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.label, { color: '#213A5C' }]}>Top-up History</Text>
      <FlatList
        data={topUpHistory}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ flexGrow: 1 }}
      />
      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowModal(false)}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
          <View style={styles.card}>
            <View style={[styles.modalContent]}>
              <Text style={styles.modalText}>Scan the QR Code for Top-Up</Text>
              <View style={styles.modalQRCode}>
                <QRCode value="QR Code Data Here" size={200} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default MyWallet

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 24,
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
