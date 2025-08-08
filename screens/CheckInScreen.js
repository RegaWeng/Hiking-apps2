import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const CheckInScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('safe');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission was denied.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCheckIn = () => {
    if (!location || !image) {
      Alert.alert('Missing Info', 'Please select both location and photo.');
      return;
    }

    Alert.alert(
      'Confirm Check-In',
      'Are you sure you want to check in with this information?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            navigation.navigate('Status', {
              location,
              image,
              status,
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In Form</Text>

      <Text style={styles.label}>📍 Location:</Text>
      <Text style={styles.info}>
        {location
          ? `Latitude: ${location.latitude.toFixed(4)}\nLongitude: ${location.longitude.toFixed(4)}`
          : 'Fetching location...'}
      </Text>

      <Button title="📷 Take Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <Text style={styles.label}>🔽 Select Status:</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Safe" value="safe" />
        <Picker.Item label="Need Help" value="help" />
        <Picker.Item label="In Transit" value="transit" />
      </Picker>

      <View style={{ marginTop: 20 }}>
        <Button title="🚨 Confirm Check-In" onPress={handleCheckIn} color="#1e90ff" />
      </View>
    </View>
  );
};

export default CheckInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 220,
    marginTop: 10,
    borderRadius: 10,
  },
  picker: {
    backgroundColor: '#eee',
    marginTop: 5,
  },
});
