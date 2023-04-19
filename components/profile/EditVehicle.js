import React, { useState, useEffect, useCallback  } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStorage, ref, uploadBytes, getDownloadURL   } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';
import { firebase } from '../../config';

const EditVehicle = () => {
    const [vehicleData, setVehicleData] = useState({});
  const [newVehicleList, setNewVehicleList] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  console.log(vehicleData);

  const getVehicleData = useCallback((vehicleIndex) => {
    return firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const vehicles = snapshot.data().vehicles || [];
          if (vehicleIndex >= 0 && vehicleIndex < vehicles.length) {
            setVehicleData(vehicles[vehicleIndex]);
          } else {
            console.log('invalid vehicle index');
          }
        } else {
          console.log('user does not exist');
        }
      });
  }, []);
  
  useEffect(() => {
    const { vehicleIndex } = route.params;
    const unsubscribe = getVehicleData(vehicleIndex);
    return unsubscribe;
  }, [route.params, getVehicleData]);

  const handleSetDefault = () => {
    setVehicleData({ ...vehicleData, isDefault: !vehicleData.isDefault });
  };
  
  const updateVehicle = async () => {
    const { vehicleIndex } = route.params;
    console.log(vehicleIndex);
    const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
  
    // Get the current vehicles array from Firestore and set up a listener for real-time updates
    const vehiclesSnapshot = await userRef.get({ source: 'server' }); // Read from the server to ensure consistency
    const newVehicleList = vehiclesSnapshot.data()?.vehicles || [];
    const unsubscribe = userRef.onSnapshot((snapshot) => {
    const updatedVehicleList = snapshot.data()?.vehicles || [];
      // Update the newVehicleList with the updatedVehicleList and trigger a re-render
      setNewVehicleList(updatedVehicleList);
    });
  
    const updatedVehicleData = { ...vehicleData };
    console.log(newVehicleList);
  
    // Check if any field in updatedVehicleData is undefined
    if (Object.values(updatedVehicleData).some((value) => value === undefined)) {
      console.log('One or more fields in vehicleData is undefined');
      return;
    }
  
    if (updatedVehicleData.isDefault) {
      // Set all other vehicles to non-default
      newVehicleList.forEach((vehicle, index) => {
        if (index !== vehicleIndex && vehicle.isDefault) {
          vehicle.isDefault = false;
        }
      });
    }
  
    // Update the vehicle data in Firestore
    newVehicleList[vehicleIndex] = updatedVehicleData;
    console.log(newVehicleList);
    await userRef.update({ vehicles: newVehicleList });
  
    // Clean up the listener
    unsubscribe();
    navigation.goBack();
  };
  
  const handleUploadPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { vehicleIndex } = route.params;
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (result.cancelled) {
        return;
      }
  
      const currentUser = firebase.auth().currentUser.uid;
      const storage = getStorage();
      const imageRef = ref(storage, `vehicle-photos/${currentUser+vehicleIndex}.jpg`);
      const response = await fetch(result.uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
  
      const photoUrl = await getDownloadURL(imageRef);
  
      // Get the current user's vehicles from Firestore
      const userRef = firebase.firestore().collection('users').doc(currentUser);
      const userDoc = await userRef.get();
      const vehicles = userDoc.data().vehicles;
  
      // Create a copy of the vehicles array and update the photoUrl of the current vehicle
      const updatedVehicles = [...vehicles];
      updatedVehicles[vehicleIndex] = {
        ...updatedVehicles[vehicleIndex],
        photoUrl,
      };
  
      // Update the vehicles array in Firestore
      await userRef.update({ vehicles: updatedVehicles });
  
      // Update the local state to trigger a re-render
      setVehicleData((prevData) => ({
        ...prevData,
        [vehicleIndex]: {
          ...prevData[vehicleIndex],
          photoUrl,
        },
      }));
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading the photo.');
    }
  };
  
  
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ margin: 30 }}>Back</Text>
        </TouchableOpacity>

        <View style={styles.horizontalContainer}>
            <TouchableOpacity style={styles.photoButton} onPress={handleUploadPhoto}>
            <Text style={styles.buttonText}>Add Photo</Text>
            </TouchableOpacity>

            <View style={styles.verticalContainer}>
            <View style={styles.plateNoContainer}>
                <Text style={styles.plateNoText}>{vehicleData.plateNo}</Text>
            </View>

            <View style={styles.defaultContainer}>
                <TouchableOpacity onPress={handleSetDefault}>
                    <Text style={styles.defaultText}>⭐ Set as Default</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>

        <Text style={styles.heading}>Edit Vehicle</Text>

        <TextInput
            value={vehicleData.vehicleType}
            onChangeText={(value) => setVehicleData({ ...vehicleData, vehicleType: value })}
            style={styles.input}
            placeholder="Vehicle Type"
        />

        <TextInput
            value={vehicleData.vehicleModel}
            onChangeText={(value) => setVehicleData({ ...vehicleData, vehicleModel: value })}
            style={styles.input}
            placeholder="Vehicle Model"
        />

        <TextInput
            value={vehicleData.plateNo}
            onChangeText={(value) => setVehicleData({ ...vehicleData, plateNo: value })}
            style={[styles.input]}
            placeholder="Plate No."
        />

        <TextInput
            value={vehicleData.color}
            onChangeText={(value) => setVehicleData({ ...vehicleData, color: value })}
            style={styles.input}
            placeholder="Vehicle Color"
        />

        <TouchableOpacity style={styles.button} onPress={updateVehicle}>
            <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      fontSize: 24,
      marginBottom: 30,
    },
    input: {
      borderWidth: 1,
      borderColor: '#999',
      padding: 10,
      marginBottom: 20,
      width: '80%',
    },
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 5,
      padding: 10,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 18,
    },
    photoButton: {
      backgroundColor: '#007AFF',
      borderRadius: 5,
      padding: 10,
      marginRight: 15,
      width: 100,
        height: 100,
        alignItems: 'center',
      justifyContent: 'center',
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    verticalContainer: {
      flexDirection: 'column',
    },
    defaultContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    defaultText: {
      fontSize: 16,
      marginRight: 10,
    },
    plateNoContainer: {
        backgroundColor: '#213A5C',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    plateNoText: {
        color: 'white',
        fontSize: 18,
    },
  });

export default EditVehicle;
