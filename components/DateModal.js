import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateModal = ({ isVisible, onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartDatePress = () => {
    setShowStartDatePicker(true);
  };

  const handleEndDatePress = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const handleSubmit = () => {
    onSubmit(startDate, endDate);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%' }}>
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 10, right: 15, padding: 5 }}>
            <Image
              source={require('../assets/transactionIcons/close.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 30, marginTop: 20, color: '#213A5C' }}>
              Custom Range
            </Text>
          </View>
          <Text style={{ color: '#213A5C', fontWeight: 'bold' }}>From</Text>
          <TouchableOpacity activeOpacity={1} onPress={handleStartDatePress} style={{ margin: 20 }}>
            <View style={{ borderWidth: 1, borderColor: '#213A5C', borderRadius: 5 }}>
              <TextInput
                value={startDate ? startDate.toLocaleDateString() : ''}
                placeholder="Select a start date"
                style={{ margin: 10 }}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          <Text style={{ color: '#213A5C', fontWeight: 'bold' }}>To</Text>
          <TouchableOpacity activeOpacity={1} onPress={handleEndDatePress}style={{ margin: 20 }}>
              <View style={{ borderWidth: 1, borderColor: '#213A5C', borderRadius: 5 }}>
                <TextInput
                  value={endDate ? endDate.toLocaleDateString() : ''}
                  placeholder="Select an end date"
                  style={{ margin: 10 }}
                  editable={false}
                />
              </View>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#213A5C', borderRadius: 5, padding: 10, marginTop: 30, marginHorizontal: 20}}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DateModal;
