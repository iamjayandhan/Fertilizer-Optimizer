import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

// Fertilizer Suggestion Screen Component
const FertilizerSuggestionScreen = () => {
  const [soilReport, setSoilReport] = useState(null);
  const [cropType, setCropType] = useState('');
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle file picker
  const handleFilePick = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setSoilReport(result);
    }
  };

  // Function to handle file removal
  const handleRemoveFile = () => {
    setSoilReport(null);
  };

  // Function to request location access
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  // Function to show the modal
  const showDetails = () => {
    setModalVisible(true);
  };

  // Function to hide the modal
  const hideDetails = () => {
    setModalVisible(false);
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
      <Button title="Pick Soil Report" onPress={handleFilePick} />
      {soilReport && (
        <View style={styles.fileContainer}>
          <Text style={styles.infoText}>Selected file: {soilReport.name}</Text>
          <Button title="Remove File" onPress={handleRemoveFile} />
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
            <Text style={styles.infoText}>Selected file: {soilReport ? soilReport.name : 'No file selected'}</Text>
            <Text style={styles.infoText}>Crop Type: {cropType || 'Not selected'}</Text>
            {location && <Text style={styles.infoText}>Location: {location.coords.latitude}, {location.coords.longitude}</Text>}
            <Button title="Close" onPress={hideDetails} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Main App Component
const App = () => {
  return (
    <View style={styles.container}>
      <FertilizerSuggestionScreen />
    </View>
  );
};

// Styles
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
});

export default App;
