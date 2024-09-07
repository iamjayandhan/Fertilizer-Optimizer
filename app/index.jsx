import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  const [soilReport, setSoilReport] = useState(null);
  const [cropType, setCropType] = useState('');
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const uploadFileOnPressHandler = async () => {
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      console.log('Picked File:', pickedFile);

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
        // Handle the case where no file is picked
        Alert.alert('Error', 'No file was picked');
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Error', 'Error picking file');
    }
  };

  // Function to request location access
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Error getting location');
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
      alert('No file available to open');
    }
  };

  // Function to clear all data
  const clearData = () => {
    setSoilReport(null);
    setCropType('');
    setLocation(null);
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
                {' '}
                (<a href={soilReport.uri} download={soilReport.name} style={styles.link}>Download</a>)
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
      {location && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Location: {location.coords.latitude}, {location.coords.longitude}</Text>
          <Button
            title="View on Map"
            onPress={() => Linking.openURL(`https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`)}
          />
        </View>
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
                  {' '}
                  (<a href={soilReport.uri} download={soilReport.name} style={styles.link}>Download</a>)
                </Text>
              )}
            </Text>
            <Text style={styles.infoText}>Crop Type: {cropType || 'Not selected'}</Text>
            {location && <Text style={styles.infoText}>Location: {location.coords.latitude}, {location.coords.longitude}</Text>}
            {soilReport && (
              <Button title="Open File" onPress={openFile} />
            )}
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
  infoContainer: {
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
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default App;
