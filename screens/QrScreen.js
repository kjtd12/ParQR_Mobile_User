import { StyleSheet, Text, View, TouchableOpacity, Modal, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react'
import QRCode from 'react-native-qrcode-svg';
import { firebase } from '../config'
import { useIsFocused } from '@react-navigation/native';

const QrScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const initialVisibilityRef = useRef(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userUid, setUserUid] = useState(null);
  const [carPlate, setCarPlate] = useState(null);
  const [carModel, setCarModel] = useState(null);
  const [carColor, setCarColor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popUpisVisible, setPopUpisVisible] = useState(false);
  const [popUpisVisible1, setPopUpisVisible1] = useState(false);
  const [data, setData] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [status, setStatus] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Subscribe to Firebase Authentication state changes
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Unsubscribe from Firebase Authentication state changes on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsModalOpen(true); // Set the initial visibility of the modal to true
  
    return () => {
      setIsModalOpen(false); // Reset the visibility of the modal to false when the screen is unmounted
    };
  }, []);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsModalOpen(true); // Set the visibility of the modal to true when the screen is re-focused
    });
  
    return unsubscribe;
  }, [navigation]);
  

  useEffect(() => { //Get User's Name
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot) => {
      if(snapshot.exists){
        setData(snapshot.data())
        setProfilePicture(snapshot.get('profile_picture'));
        const car = snapshot.data().vehicles.find((v) => v.isDefault)
        setCarPlate(car ? car.plateNo : '');
        setCarModel(car ? car.vehicleModel : '')
        setCarColor(car ? car.color : '')
      } else {
        console.log('user does not exist')
      }
    })
  }, []);

  useEffect(() => {
    // Get the user's UID and store it in a variable
    if (currentUser) {
      setUserUid(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
    const unsubscribe = userRef.onSnapshot(snapshot => {
      if (snapshot.exists) {
        const status = snapshot.get('paymentStatus');
        
        const balance = snapshot.get('balance')
        setStatus(status);
        setBalance(balance)
        if (status == null || status == undefined) {
        } else {
          if (!status) {
            setPopUpisVisible(true);
            setPopUpisVisible1(false);
            setIsModalOpen(false);
          } else {
            setPopUpisVisible(false);
            setPopUpisVisible1(true);
            setIsModalOpen(false);
          }
        }
      } else {
        console.log('user does not exist');
      }
    });
    
    return () => unsubscribe();
  }, []);
  

  const handleClosePopUp = async () => {
    setPopUpisVisible1(false)
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(firebase.auth().currentUser.uid);
    await userRef.update({
      paymentStatus: null,
    });
  } 

  const profileImage = profilePicture ? { uri: profilePicture } : { uri: 'https://via.placeholder.com/150x150.png?text=Profile+Image' };
  const spacer = (n) => [...Array(n)].map(() => ' ').join('');
  let space = spacer(34)

  return (
    <View style={styles.container}>
    <View style={{ padding: 30, borderColor: 'black', borderWidth: 2, borderRadius: 10 }}>
      <TouchableOpacity
        style={{ padding: 20, borderColor: 'black', borderWidth: 1, borderRadius: 10 }}
        onPress={() => setIsModalOpen(true)}
      >
        <Text>Re-Open QR Code</Text>
      </TouchableOpacity>
    </View>
    <Modal visible={isModalOpen} style={{ backgroundColor: '#213A5C' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#213A5C' }}>
        <TouchableOpacity onPress={() => {setIsModalOpen(false); navigation.navigate('Home')}} style={{ position: 'absolute', top: 40, left: 40, paddingTop: 1 }}>
          <Image
            source={require('../assets/icons/ArrowLeft.png')}
            style={{ tintColor: 'white', height: 30, width: 30 }}
          />
        </TouchableOpacity>
        <Text style={{ position: 'absolute', top: 40, fontSize: 20, color: 'white', paddingTop: 5 }}>My QR Code</Text>
        <TouchableOpacity onPress={() => {setIsModalOpen(false); navigation.navigate('Home')}} style={{ position: 'absolute', top: 40, right: 40, paddingTop: 10 }}>
          <Image
            source={require('../assets/transactionIcons/close.png')}
            style={{ tintColor: 'white', height: 15, width: 15 }}
          />
        </TouchableOpacity>
        <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 10, width: '90%', paddingVertical: 20 }}>
          <View>
            <Image
              source={profileImage && { uri: profileImage.uri }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{data.name}</Text>
          <View style={{ width: '60%' }}>
            <Text style={{ color: 'gray', fontSize: 16 }}>Plate: {carPlate} {space}</Text>
            <Text style={{ color: 'gray', fontSize: 16 }}>Car Model: {carModel}</Text>
            <Text style={{ color: 'gray', fontSize: 16 }}>Car Color: {carColor}</Text>
          </View>
          {userUid && <QRCode value={userUid} size={200}/>}
          
        </View>
        <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: 'white' }}>Please wait until the operator scans</Text>
            <Text style={{ fontSize: 18, color: 'white' }}>the QR Code completely for</Text>
            <Text style={{ fontSize: 18, color: 'white' }}>verification</Text>
        </View>
      </View>
    </Modal>
    <Modal visible={popUpisVisible}>
      <View style={{ backgroundColor: '#213A5C', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ position: 'absolute', top: 40, fontSize: 20, color: 'white', paddingTop: 5 }}>My Payment</Text>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '70%', alignItems: 'center', padding: 40 }}>
          <Image
            source={ require('../assets/icons/red.png') }
            style={{ borderRadius: 50 }}
          />
          <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 10 }}>Sorry, e-Wallet Payment Failed.</Text>
          <Text style={{ color: 'gray' }}>e-wallet Balance is insufficient.</Text>
          <Text style={{ color: 'gray' }}>Please Pay directly to the</Text>
          <Text style={{ marginBottom: 10, color: 'gray'}}>operator</Text>
          <Text style={{ marginBottom: 10, fontSize: 16, color: '#213A5C' }}>Amount to be paid:</Text>
          <Text style={{ marginBottom: 20, fontSize: 16, color: '#213A5C' }}>Php {parseFloat(balance).toFixed(2)}</Text>
        </View>
      </View>
    </Modal>
    <Modal visible={popUpisVisible1}>
      <View style={{ backgroundColor: '#213A5C', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ position: 'absolute', top: 40, fontSize: 20, color: 'white', paddingTop: 5 }}>My Payment</Text>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '70%', alignItems: 'center', padding: 40 }}>
          <Image
            source={ require('../assets/icons/green.png') }
            style={{ borderRadius: 50 }}
          />
          <Text style={{ fontSize: 26, fontWeight: 'bold', alignItems: 'center' }}>Parking Fee Paid Successfully!</Text>
          <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 10, alignItems: 'center' }}></Text>
          <Text style={{ fontSize: 16, color: 'gray'}}>Thank you for using</Text>
          <Text style={{ marginBottom: 20, fontSize: 16, color: 'gray' }}>ParQR App</Text>
          <TouchableOpacity style={{ backgroundColor: '#F3BB01', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 5 }} onPress={handleClosePopUp}>
            <Text style={{ color: 'white', fontSize: 20 }}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
  )
}

export default QrScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
})