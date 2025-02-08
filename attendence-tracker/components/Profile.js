import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationBar from './NavigationBar';

const Profile = () => {
  console.log("Profile component rendered"); // Debugging log
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Profile details go here.</Text>
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 70, // Add padding to prevent content from being hidden behind navbar
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

export default Profile;