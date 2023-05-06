import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from 'react-native';

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
    <Modal visible={visible} animationType="slide" onRequestClose={() => onBackdropPress()} transparent={true}>
      <TouchableOpacity style={styles.backdrop} onPress={() => onBackdropPress()} />
      <View style={styles.modal}>
        <Text style={styles.heading}>Create Vehicle</Text>
        <Text style={{ padding: 5 }}>Vehicle Type: </Text>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Type Here..."
          value={vehicleType}
          onChangeText={(value) => setVehicleType(value)}
        />
        <Text style={{ padding: 5 }}>Vehicle Model: </Text>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Model Here..."
          value={vehicleModel}
          onChangeText={(value) => setVehicleModel(value)}
        />
        <Text style={{ padding: 5 }}>Plate No: </Text>
        <TextInput
          style={styles.input}
          placeholder="Plate No. Here..."
          value={plateNo}
          onChangeText={(value) => setPlateNo(value)}
        />
        <Text style={{ padding: 5 }}>Color: </Text>
        <TextInput
          style={styles.input}
          placeholder="Color Here..."
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
    backgroundColor: 'rgba(0,0,0,0.1)',
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
    backgroundColor: '#213A5C',
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
