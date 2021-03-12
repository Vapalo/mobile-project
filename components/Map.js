import React, { useEffect, useState } from "react";
import { SliderComponent, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";

const Map = ({ navigation }) => {
  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  };
  const [region, setRegion] = useState(initial);
  const [markers, setMarkers] = useState({});

  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("No permission to access location");
    } else {
      try {
        let location = await Location.getCurrentPositionAsync({});

        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const getPlaces = async () => {
    let response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${region.latitude},${region.longitude}&radius=1500&type=supermarket&key=${Constants.manifest.extra.key}`
    );
    let data = await response.json();
    setMarkers(data);
  };

  useEffect(() => {
    getLocation();
    getPlaces();
  }, []);
  console.log(markers);
  return (
    <View style={styles.container}>
      <MapView
        style={{ height: "100%", width: "100%" }}
        region={region}
        showsUserLocation={true}
      ></MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
