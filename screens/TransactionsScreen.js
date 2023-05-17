import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '../config';
import DropDownPicker from 'react-native-dropdown-picker';
import DateModal from '../components/DateModal';
import DetailsModal from '../components/DetailsModal';

const ParkingHistoryScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortCurrentValue, setSortCurrentValue] = useState();
  const [filterCurrentValue, setFilterCurrentValue] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredParkingHistory, setFilteredParkingHistory] = useState([]);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState([]);

  function filterAndSortTransactions(parkingHistory, filterCurrentValue, sortCurrentValue, startDate, endDate) {
    let filteredParkingHistory = [...parkingHistory];
    
    switch (filterCurrentValue) {
      case 'today':
        filteredParkingHistory = filteredParkingHistory.filter((parkingHistory) => {
          const transactionDate = new Date(parkingHistory.start_time);
          const today = new Date();
          return transactionDate.toDateString() === today.toDateString();
        });
        break;
      case 'sevenDays':
        filteredParkingHistory = filteredParkingHistory.filter((parkingHistory) => {
          const transactionDate = new Date(parkingHistory.start_time);
          const today = new Date();
          const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
          return transactionDate >= sevenDaysAgo;
        });
        break;
      case 'thirtyDays':
        filteredParkingHistory = filteredParkingHistory.filter((parkingHistory) => {
          const transactionDate = new Date(parkingHistory.start_time);
          const today = new Date();
          const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
          return transactionDate >= thirtyDaysAgo;
        });
        break;
      case 'custom':
        setDateModalVisible(true)
        filteredParkingHistory = filteredParkingHistory.filter((parkingHistory) => {
          const transactionDate = new Date(parkingHistory.start_time);
          const start = startDate ? new Date(startDate.setDate(startDate.getDate())) : '';
          const end = endDate ? new Date(endDate.setDate(endDate.getDate())) : '';
          return transactionDate >= start && transactionDate <= end;
        });
        break;
      default:
        break;
    }
  
    switch (sortCurrentValue) {
      case 'ascending':
        filteredParkingHistory.sort((a, b) => a.operator_name.localeCompare(b.operator_name));
        break;
      case 'descending':
        filteredParkingHistory.sort((a, b) => b.operator_name.localeCompare(a.operator_name));
        break;
      case 'newest':
        filteredParkingHistory.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        break;
      case 'oldest':
        filteredParkingHistory.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        break;
      default:
        break;
    }
    
    return filteredParkingHistory;
  }

  useEffect(() => {
    const filteredAndSortedTransactions = filterAndSortTransactions(parkingHistory, filterCurrentValue, sortCurrentValue, startDate, endDate);
    setFilteredParkingHistory(filteredAndSortedTransactions);
  }, [parkingHistory, filterCurrentValue, sortCurrentValue, startDate, endDate]);

  const handleSubmit = (value1, value2) => {
    setStartDate(value1);
    setEndDate(value2);
  }

  useEffect(() => {
    const userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    const listener = userRef.on('value', (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.parking_time_history) {
        const reversedHistory = Object.values(userData.parking_time_history).reverse();
        setParkingHistory(reversedHistory);
      }
    });
    
    return () => userRef.off('value', listener);
  }, []);

  const renderParkingItem = ({ item }) => {
    const { start_time, duration, operator_name, payment } = item;
    const date = new Date(start_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const startTime = new Date(start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTime = new Date(start_time + duration * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const formattedPrice = parseInt(payment) ? `${parseInt(payment).toFixed(2)} PHP` : 'N/A';
  
    if (
      searchQuery &&
      !operator_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !formattedPrice.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !date.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !startTime.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !endTime.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return null;
    }
  
    const handlePress = () => {
      setDetailData(item);
      setDetailModalVisible(true);
    };
  
    return (
      <>
        <TouchableOpacity onPress={handlePress}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.row}>
                <Image
                  source={require('../assets/icons/CarIcon.png')}
                  style={{ width: 40, height: 40, borderRadius: 10 }}
                />
                <View style={{ marginLeft: 15, marginTop: 5 }}>
                  <Text style={styles.date}>{date}</Text>
                  {operator_name && (
                    <Text style={styles.operator}>Operator: {operator_name}</Text>
                  )}
                </View>
              </View>
              <View style={styles.row_1}>
                <View style={{ marginTop: 5, alignItems: 'flex-end' }}>
                  <Text style={[styles.price, { color: '#F3BB01' }]}>{formattedPrice}</Text>
                  <Text style={styles.time}>{startTime} - {endTime}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <DetailsModal
          isVisible={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false);
            setDetailData([]);
          }}
          item={detailData}
        />
      </>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#213A5C', fontSize: 20, fontWeight: 'bold', paddingBottom: 20, marginTop: 40 }}>Transaction History</Text>
      </View>
      <View style={[styles.searchContainer]}>
        <Image
          source={ require('../assets/transactionIcons/Search.png') }
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={(query) => setSearchQuery(query)}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginVertical: 5, position: "relative", zIndex: 10 }}>
        <View>
          <DropDownPicker 
            items={[
              { label: 'A-Z', value: 'ascending'},
              { label: 'Z-A', value: 'descending'},
              { label: 'Newest', value: 'newest'},
              { label: 'Oldest', value: 'oldest'}
            ]}
            containerStyle={{ 
              backgroundColor: '#fff',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}
            placeholder="Sort"
            defaultValue={'newest'}
            setValue={(value) => setSortCurrentValue(value)}
            value={sortCurrentValue}
            open={isSortOpen}
            setOpen={setIsSortOpen}
            
            showTickIcon={true}
            style={{ // add this to remove the default border of the DropDownPicker
              borderWidth: 0,
              width: 100 // add this to set the width
            }}
            dropDownStyle={{ // add this to remove the default border of the DropDownPicker dropdown
              borderWidth: 0,
              color: '#213A5C',
            }}
            labelStyle={{ // add this to style the label text
              fontSize: 16,
              color: '#213A5C',
            }}
            arrowIconStyle={{ // add this to style the arrow icon
              tintColor: '#213A5C',
            }}
          />
        </View>
        <View>
          <DropDownPicker 
            items={[
              { label: 'Today', value: 'today'},
              { label: 'Last 7 days', value: 'sevenDays'},
              { label: 'Last 30 Days', value: 'thirtyDays'},
              { label: 'Custom', value: 'custom'},
            ]}
            containerStyle={{ 
              backgroundColor: '#fff',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            placeholder="Filter"
            defaultValue={'today'}
            setValue={(value) => setFilterCurrentValue(value)}
            value={filterCurrentValue}
            open={isFilterOpen}
            setOpen={setIsFilterOpen}
            onChangeItem={item => console.log(item.label, item.value)}
            showTickIcon={true}
            style={{ // add this to remove the default border of the DropDownPicker
              borderWidth: 0,
              width: 100  // add this to set the width
            }}
            dropDownStyle={{ // add this to remove the default border of the DropDownPicker dropdown
              borderWidth: 0,
              color: '#213A5C',
            }}
            labelStyle={{ // add this to style the label text
              fontSize: 16,
              color: '#213A5C',
            }}
            arrowIconStyle={{ // add this to style the arrow icon
              tintColor: '#213A5C',
            }}
          />
        </View>
      </View>
      <DateModal isVisible={dateModalVisible} onClose={() => setDateModalVisible(false)} onSubmit={handleSubmit} />
      <FlatList
        data={filteredParkingHistory}
        renderItem={renderParkingItem}
        keyExtractor={(item) => item.start_time.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  row_1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  date: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  operator: {
    fontSize: 10,
  },
  time:{
    fontSize: 10,
  },
  list:{
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF1F8',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: 'black',
  },
});



export default ParkingHistoryScreen;
