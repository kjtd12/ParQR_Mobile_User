import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const VehicleModal = ({ visible, onBackdropPress, onSubmit }) => {
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [color, setColor] = useState('');
  const [vehicleTypeOpen, setVehicleTypeOpen] = useState(false);

  const handleSubmit = () => {
    if (vehicleType && vehicleModel && plateNo && color) {
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
    } else {
      alert('Please fill out the missing fields');
    }
  };
  

  return (
  <Modal visible={visible} animationType="slide" onRequestClose={onBackdropPress} transparent={true}>
    <TouchableOpacity style={styles.backdrop} onPress={onBackdropPress} />
      <KeyboardAvoidingView style={styles.modal} behavior={Platform.OS === 'ios' ? 'padding' : 'undefined'}>
        <Text style={styles.heading}>Create Vehicle</Text>
        <Text style={{ padding: 5 }}>Vehicle Type: </Text>
        <View style={{ position: "relative", zIndex: 10 }}>
          <DropDownPicker
                items={[ { label: 'Car', value: 'car' }, { label: 'Motorcycle', value: 'motorcycle' } ]}
                defaultValue={'car'}
                placeholder="Select Vehicle Type"
                style={styles.input}
                itemStyle={{
                  justifyContent: 'flex-start'
                }}
                dropDownStyle={{ // add this to remove the default border of the DropDownPicker dropdown
                    borderWidth: 0,
                    color: '#213A5C',
                }}
                setValue={(value) => setVehicleType(value)}
                value={vehicleType}
                open={vehicleTypeOpen}
                setOpen={setVehicleTypeOpen}
              />
        </View>
        <Text style={{ padding: 5 }}>Vehicle Model: </Text>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Model Here..."
          value={vehicleModel}
          onChangeText={setVehicleModel}
        />
        <Text style={{ padding: 5 }}>Plate No: </Text>
        <TextInput
          style={styles.input}
          placeholder="Plate No. Here..."
          value={plateNo}
          onChangeText={setPlateNo}
        />
        <Text style={{ padding: 5 }}>Color: </Text>
        <TextInput
          style={styles.input}
          placeholder="Color Here..."
          value={color}
          onChangeText={setColor}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    borderWidth: 0
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
