import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  const [soilReport, setSoilReport] = useState(null);
  const [cropType, setCropType] = useState('');
  const [locationData, setLocationData] = useState('Fetching location...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        // Use web-specific geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const data = `Latitude: ${latitude}, Longitude: ${longitude}`;
              console.log('Web Location Data:', data); // Debugging statement
              setLocationData(data);
            },
            (error) => {
              console.error('Geolocation error:', error.message);
              setErrorMsg(error.message);
              setLocationData('Error fetching location');
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          setErrorMsg('Geolocation is not supported by this browser.');
          setLocationData('Geolocation not supported');
        }
      } else {
        // Use mobile-specific geolocation API
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          setLocationData('Location permission denied');
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        const data = `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`;
        console.log('Mobile Location Data:', data); // Debugging statement
        setLocationData(data);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location');
      setLocationData('Error fetching location');
    }
  };

  const uploadFileOnPressHandler = async () => {
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (pickedFile.type === 'cancel') {
        console.log('User cancelled the file picker');
        return;
      }

      if (pickedFile.assets && pickedFile.assets.length > 0) {
        const file = pickedFile.assets[0]; // Access the first file in assets array

        setSoilReport({
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        });
      } else {
        Alert.alert('Error', 'No file was picked');
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Error', 'Error picking file');
    }
  };

  const showDetails = () => {
    setModalVisible(true);
  };

  const hideDetails = () => {
    setModalVisible(false);
  };

  const openFile = async () => {
    if (soilReport && soilReport.uri) {
      await Linking.openURL(soilReport.uri); // Handle file URI for web
    } else {
      Alert.alert('Error', 'No file available to open');
    }
  };

  const clearData = () => {
    setSoilReport(null);
    setCropType('');
    setLocationData('Fetching location...');
    setErrorMsg(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fertilizer Suggestion</Text>

      {/* Soil Report File Picker */}
      <Button title="Pick Soil Report" onPress={uploadFileOnPressHandler} />
      {soilReport && (
        <View style={styles.fileContainer}>
          <Text style={styles.infoText}>
            Selected file: {soilReport.name}
            {Platform.OS === 'web' && soilReport.uri && (
              <Text style={styles.infoText}>
                {' '}<a href={soilReport.uri} download={soilReport.name} style={styles.link}>Download</a>
              </Text>
            )}
          </Text>
          <Button title="Remove File" onPress={() => setSoilReport(null)} />
        </View>
      )}

      {/* Crop Type Dropdown */}
      <Text style={styles.label}>Select Crop Type:</Text>
      <Picker
        selectedValue={cropType}
        style={styles.picker}
        onValueChange={(itemValue) => setCropType(itemValue)}
      >
        <Picker.Item label="Maize" value="Maize" />
        <Picker.Item label="Sugarcane" value="Sugarcane" />
        <Picker.Item label="Cotton" value="Cotton" />
        <Picker.Item label="Tobacco" value="Tobacco" />
        <Picker.Item label="Paddy" value="Paddy" />
        <Picker.Item label="Barley" value="Barley" />
        <Picker.Item label="Wheat" value="Wheat" />
        <Picker.Item label="Millets" value="Millets" />
        <Picker.Item label="Oil seeds" value="Oil seeds" />
        <Picker.Item label="Pulses" value="Pulses" />
        <Picker.Item label="Ground Nuts" value="Ground Nuts" />
      </Picker>

      {/* Location Access */}
      <Button title="Get Location" onPress={getLocation} />
      <Text style={styles.infoText}>{locationData}</Text>
      {errorMsg && (
        <Text style={styles.infoText}>{errorMsg}</Text>
      )}

      {/* Get Details Button */}
      <Button title="Get Details" onPress={showDetails} />

      {/* Clear Button */}
      <Button title="Clear" onPress={clearData} />

      {/* Modal for displaying details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideDetails}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={hideDetails}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Details</Text>
            <Text style={styles.infoText}>
              Selected file: {soilReport ? soilReport.name : 'No file selected'}
              {Platform.OS === 'web' && soilReport && soilReport.uri && (
                <Text style={styles.infoText}>
                  {' '}<a href={soilReport.uri} download={soilReport.name} style={styles.link}>Download</a>
                </Text>
              )}
            </Text>
            <Text style={styles.infoText}>Crop Type: {cropType || 'Not selected'}</Text>
            <Text style={styles.infoText}>Location Data: {locationData}</Text>
            <Button title="Close" onPress={hideDetails} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 18,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 10,
  },
  fileContainer: {
    marginVertical: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
  },
});

export default App;
