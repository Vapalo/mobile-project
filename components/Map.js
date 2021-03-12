import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { Header } from "react-native-elements";

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
        let response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=3000&type=supermarket&key=${Constants.manifest.extra.key}`
        );
        let data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (Object.keys(markers).length !== 0) {
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "Map",
            style: { color: "#fff", fontSize: 20 },
          }}
        />
        <MapView
          style={{ flex: 1, width: "100%" }}
          region={region}
          showsUserLocation={true}
        >
          {markers.results.map((marker, index) => (
            <Marker
              key={index}
              title={marker.name}
              description={marker.vicinity}
              coordinate={{
                latitude: marker.geometry.location.lat,
                longitude: marker.geometry.location.lng,
              }}
            />
          ))}
        </MapView>
      </View>
    );
  } else {
    return <Text>Hups</Text>;
  }
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
