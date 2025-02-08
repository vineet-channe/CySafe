// Ride.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import MapView, { Marker, UrlTile, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import NavigationBar from './NavigationBar';

// EXAMPLE: Pothole data from your DB
const POTHOLES_DB = [
  { id: 1, latitude: 20.595, longitude: 78.965 },
  { id: 2, latitude: 20.596, longitude: 78.969 },
  { id: 3, latitude: 19.1255, longitude: 72.8531 },
];

// You might want a haversine distance library, but let's do a quick approximation
function getDistanceLatLng(lat1, lng1, lat2, lng2) {
  // returns approximate distance in meters using the haversine formula
  const R = 6371e3; // Earth radius in meters
  const toRad = (x) => (x * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance; // in meters
}

export default function Ride() {
  const [currentLocation, setCurrentLocation] = useState(null); // Blue marker
  const [locationSubscription, setLocationSubscription] = useState(null);

  const [destinationCoord, setDestinationCoord] = useState(null); // Red marker

  // Text fields
  const [currentLocationInput, setCurrentLocationInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  // Example placeholders
  const [potholePrediction, setPotholePrediction] = useState('High');
  const [predictiveCollision, setPredictiveCollision] = useState('5%');
  const [fatigueLevel, setFatigueLevel] = useState('Low');
  const [collisionProbability, setCollisionProbability] = useState('5%');

  const [distance, setDistance] = useState(2023);
  const [avgSpeed, setAvgSpeed] = useState(15);

  const [mapRegion, setMapRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Route
  const [routeCoords, setRouteCoords] = useState([]);
  
  // Potholes that lie on the route
  const [potholesOnRoute, setPotholesOnRoute] = useState([]); 

  // 1) Request location & track user
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your current location.'
        );
        return;
      }

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setCurrentLocation({ latitude, longitude });
          setCurrentLocationInput(
            `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          );
        }
      );
      setLocationSubscription(sub);
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Tapping the map -> set red marker
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setDestinationCoord({ latitude, longitude });
  };

  // 2) Fetch route & detect potholes
  const handleSetDestination = async () => {
    if (!destinationCoord) {
      Alert.alert('No Destination', 'Please tap the map to place the red marker first.');
      return;
    }
    setDestinationInput(
      `Lat: ${destinationCoord.latitude.toFixed(4)}, Lng: ${destinationCoord.longitude.toFixed(4)}`
    );

    if (!currentLocation) {
      Alert.alert('No Current Location', 'We do not have your current location yet.');
      return;
    }

    try {
      const ORS_API_KEY = '5b3ce3597851110001cf62481d7f7e0470d341efa47b5e7ddc6eadf7';

      const start = `${currentLocation.longitude},${currentLocation.latitude}`;
      const end = `${destinationCoord.longitude},${destinationCoord.latitude}`;
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start}&end=${end}`;
      
      const resp = await fetch(url);
      const data = await resp.json();
      if (!data.features || !data.features[0]) {
        Alert.alert('Route Error', 'No route found by ORS.');
        return;
      }

      const route = data.features[0].geometry.coordinates; // [lon, lat]
      const polylineCoords = route.map(([lon, lat]) => ({
        latitude: lat,
        longitude: lon,
      }));
      setRouteCoords(polylineCoords);

      // === DETECT POTHOLES ON ROUTE ===
      // We'll do a simple "closest route coordinate" check
      const threshold = 30; // meters
      const found = [];

      POTHOLES_DB.forEach((pothole) => {
        let isOnRoute = false;
        for (let i = 0; i < polylineCoords.length; i++) {
          const dist = getDistanceLatLng(
            pothole.latitude,
            pothole.longitude,
            polylineCoords[i].latitude,
            polylineCoords[i].longitude
          );
          if (dist < threshold) {
            // This pothole is "close enough"
            isOnRoute = true;
            break;
          }
        }
        if (isOnRoute) {
          found.push(pothole);
        }
      });

      setPotholesOnRoute(found);

      Alert.alert(
        'Directions Loaded',
        `Route displayed! Found ${found.length} pothole(s) on this path.`
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Could not fetch route from OpenRouteService.');
    }
  };

  const handleStartRide = () => {
    Alert.alert('Ride Started', 'Ride logic/integration goes here!');
  };

  if (!currentLocation) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Fetching your current location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Ride</Text>

      {/* Current Location */}
      <Text style={styles.label}>Current Location:</Text>
      <TextInput
        style={styles.input}
        value={currentLocationInput}
        onChangeText={setCurrentLocationInput}
        placeholder="Enter your current location"
      />

      {/* Destination */}
      <Text style={styles.label}>Destination:</Text>
      <TextInput
        style={styles.input}
        value={destinationInput}
        onChangeText={setDestinationInput}
        placeholder="Tap the map, then click 'Set Destination Marker'"
      />

      <Button title="Set Destination Marker" onPress={handleSetDestination} />

      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(reg) => setMapRegion(reg)}
        onPress={handleMapPress}
      >
        {/* OSM tiles */}
        <UrlTile urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Blue marker for user */}
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          pinColor="blue"
          title="You are here"
        />

        {/* Red marker for destination */}
        {destinationCoord && (
          <Marker
            coordinate={destinationCoord}
            pinColor="red"
            title="Destination"
          />
        )}

        {/* Polyline for route */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#ff0000"
            strokeWidth={3}
          />
        )}

        {/* Markers for potholes on route */}
        {potholesOnRoute.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={`Pothole #${p.id}`}
            // Optionally use an icon
            // icon={require('../assets/pothole-icon.png')} // If you have a local image
            pinColor="orange"
          />
        ))}
      </MapView>

      {/* Route Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Route Status</Text>
        <Text>Pothole Prediction: {potholePrediction}</Text>
        <Text>Predictive Collision Risk: {predictiveCollision}</Text>
        <Text>Fatigue Level: {fatigueLevel}</Text>
        <Text>Collision Probability: {collisionProbability}</Text>
      </View>

      {/* Start Ride */}
      <View style={styles.section}>
        <Text>Fastest route now (3.6 mi), approx 18 min</Text>
        <Button title="Start Ride" onPress={handleStartRide} />
      </View>

      {/* Ride Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ride Summary</Text>
        <View style={styles.row}>
          <Text>Distance: {distance}</Text>
          <Text>Avg Speed: {avgSpeed}</Text>
        </View>
      </View>

      {/* Add NavigationBar at the bottom */}
      <NavigationBar />
    </View>
  );
}

// ---------------------------------
// STYLES
// ---------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 70, // Add padding for NavigationBar
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    marginBottom: 8,
    borderRadius: 4,
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
});
