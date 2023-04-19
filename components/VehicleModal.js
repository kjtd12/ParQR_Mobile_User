import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const VehicleModal = ({ visible, onBackdropPress, onSubmit }) => {
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [color, setColor] = useState('');

  const handleSubmit = () => {
    const vehicleData = {
      vehicleType,
      vehicleModel,
      plateNo,
      color,
    };

    onSubmit(vehicleData);
    setVehicleType('');
    setVehicleModel('');
    setPlateNo('');
    setColor('');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={() => onBackdropPress()}>
      <TouchableOpacity style={styles.backdrop} onPress={() => onBackdropPress()} />
      <View style={styles.modal}>
        <Text style={styles.heading}>Create Vehicle</Text>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Type"
          value={vehicleType}
          onChangeText={(value) => setVehicleType(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Vehicle Model"
          value={vehicleModel}
          onChangeText={(value) => setVehicleModel(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Plate No"
          value={plateNo}
          onChangeText={(value) => setPlateNo(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={color}
          onChangeText={(value) => setColor(value)}
        />
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default VehicleModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
