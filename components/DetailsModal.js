import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const DetailsModal = ({ isVisible, onClose, item }) => {

    const { start_time, duration, operator_name, payment } = item;
    const startTimeDate = new Date(start_time);
    const endTimeDate = new Date(start_time + duration * 1000);

    const date = startTimeDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const startTime = startTimeDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTime = endTimeDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const parsedPayment = parseInt(payment);
    const formattedPrice = parsedPayment ? parsedPayment.toFixed(2) : 'N/A';

    const durationInSeconds = (endTimeDate - startTimeDate) / 1000;
    const durationInMinutes = Math.floor(durationInSeconds / 60);
    const durationInHours = Math.floor(durationInMinutes / 60);

    let durationText;
    if (durationInHours < 1) {
        const remainingSeconds = Math.round(durationInSeconds % 60);
        durationText = `0 mins ${remainingSeconds} secs`;
    } else {
        durationText = `${durationInHours} hours ${durationInMinutes % 60} min`;
    }

  return (
    <Modal visible={isVisible} transparent={true}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)', }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#213A5C', marginBottom: 20 }}>Transaction Details</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#213A5C', padding: 20,  }}>Transfer from {item.number ? item.number : item.user_name} to ParQr Pay</Text>
                <View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Transaction Type</Text>
                        <Text style={styles.secondText}>{item.top_up ? 'Top-up' : 'Parking'}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Customers's Name</Text>
                        <Text style={styles.secondText}>{item.user_name}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Plate No.</Text>
                        <Text style={styles.secondText}>{item.plate_no}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Date & Time</Text>
                        <Text style={styles.secondText}>{date} {startTime}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Parking Operator</Text>
                        <Text style={styles.secondText}>{item.operator_name}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Hours Parked</Text>
                        <Text style={styles.secondText}>{startTime} - {endTime}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Duration</Text>
                        <Text style={styles.secondText}>{durationText}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Discounts</Text>
                        <Text style={styles.secondText}>{item.discount}</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.firstText}>Amount</Text>
                        <Text style={styles.secondText}>{formattedPrice}</Text>
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: '#213A5C', marginVertical: 15 }} />
                <View style={styles.detailLine}>
                    <Text style={styles.firstText}>Reference Number</Text>
                    <Text style={styles.secondText}>{item.reference_number}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#213A5C', padding: 10, alignItems: 'center', marginTop: 15, marginBottom: 5, borderRadius: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Okay</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  )
}

export default DetailsModal

const styles = StyleSheet.create({
    detailLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    firstText: {
        color: 'lightgrey',
        fontSize: 16
    },
    secondText: {
        color: '#213A5C',
        fontSize: 16
    }
})