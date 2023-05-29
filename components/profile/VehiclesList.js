import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../config'
import React, { useState, useEffect } from 'react'
import VehicleModal from '../../components/VehicleModal';

const VehiclesList = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setData(snapshot.data().vehicles || []);
        } else {
          console.log('user does not exist');
        }
      });
    return unsubscribe;
  }, []);

  const deleteVehicle = async (index) => {
    const newVehicleList = [...data];
    newVehicleList.splice(index, 1);
    await firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({ vehicles: newVehicleList });
  };

  const editVehicle = (index) => {
    navigation.navigate('EditVehicle', { vehicleIndex: index });
  };

  const createVehicle = async (vehicleData) => {
    const newVehicleList = [...data, vehicleData];
    if (newVehicleList.length === 1) {
      // Set the isDefault property of the first vehicle to true
      newVehicleList[0].isDefault = true;
    }
    await firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({ vehicles: newVehicleList });
    alert("Vehicle Created Successfully");
  };
  
  const setDefaultVehicle = async (index) => {
    const newVehicleList = [...data];
    const defaultVehicle = newVehicleList.splice(index, 1)[0];
    defaultVehicle.isDefault = true;
    for (let i = 0; i < newVehicleList.length; i++) {
      newVehicleList[i].isDefault = false;
    }
    newVehicleList.unshift(defaultVehicle);
    await firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({ vehicles: newVehicleList });
  };

  const renderListItem = ({ item, index }) => {
    const carImage = item.photoUrl ? { uri: item.photoUrl } : { uri: 'https://via.placeholder.com/150x150.png?text=Profile+Image' };
    return (
    <TouchableOpacity style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={carImage} style={styles.carImage} />
            <View>
              <Text style={styles.cardLabel}>{item.vehicleModel}</Text>
              <Text>{item.plateNo}</Text>
              {item.isDefault ? (
                  <Text style={styles.defaultVehicle}>⭐Default</Text>
              ) : (
                  <TouchableOpacity onPress={() => setDefaultVehicle(index)}>
                  <Text>Set as Default</Text>
                  </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.cardActions}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={styles.cardActionButton} onPress={() => editVehicle(index)}>
                <Image source={ require('../../assets/icons/CarEdit.png') }/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardActionButton} onPress={() => deleteVehicle(index)}>
                <Image source={ require('../../assets/icons/CarDelete.png') }/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardTop}>
        <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.replace('App', { screen: 'Profile' })} style={{ flex: 1, alignItems: 'flex-start' }}>
            <Image
                source={ require('../../assets/icons/ArrowLeft.png') }
              />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#213A5C', fontSize: 16, fontWeight: 'bold' }}>Vehicle List</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.buttonText}>Create Vehicle</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: '#213A5C', fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>My Vehicles</Text>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderListItem}
          keyExtractor={(item, index) => index.toString()}
          style={{ flexGrow: 1 }}
        />
      </View>
      <VehicleModal
        visible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onSubmit={createVehicle}
      />
    </View>
  )
}

export default VehiclesList;

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#F5F5F5',
      padding: 10,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#213A5C',
      padding: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    list: {
      marginTop: 16,
    },
    cardTop: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: 'black',
        marginTop: 30,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1.75,
        borderColor: '#213A5C',
    }, 
    card: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 16,
      shadowColor: 'black',
      marginVertical: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 1.75,
      borderColor: '#213A5C',
  }, 
    carImage: {
        width: 50,
        height: 50,
        marginRight: 16,
    },
    cardLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    defaultVehicle: {
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cardActionButton: {
        marginLeft: 16,
    },
});
  