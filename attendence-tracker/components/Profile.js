import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, Modal, TouchableOpacity, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBar from './NavigationBar';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from "expo-router";

const BASE_URL = 'http://10.10.61.225:5000/api/auth';

const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("Vineet Channe");
  const [avatarSource, setAvatarSource] = useState('https://your-avatar-url.com');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      const { id } = JSON.parse(storedUserData);
      
      const response = await axios.get(`${BASE_URL}/profile/${id}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      router.replace("/");
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const selectImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: false,
    };

    try {
      const result = await launchImageLibrary(options);
      
      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else if (result.assets && result.assets[0]) {
        setAvatarSource(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsModalVisible(false);
  };

  const getInitialLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (name) => {
    const colors = [
      '#1a237e', // Deep Blue
      '#0D47A1', // Blue
      '#1B5E20', // Green
      '#B71C1C', // Red
      '#4A148C', // Purple
      '#004D40', // Teal
      '#E65100', // Orange
      '#263238', // Blue Grey
    ];
    
    // Use name to consistently get same color for same user
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const InitialAvatar = ({ name, size = 100 }) => (
    <View 
      style={[
        styles.initialAvatar, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: getRandomColor(name)
        }
      ]}
    >
      <Text style={[styles.initialText, { fontSize: size * 0.4 }]}>
        {getInitialLetter(name)}
      </Text>
    </View>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.profileCard}>
              {avatarSource === 'https://your-avatar-url.com' ? (
                <InitialAvatar name={userData?.name} size={100} />
              ) : (
                <Image source={{ uri: avatarSource }} style={styles.avatar} />
              )}
              <Text style={styles.name}>{userData?.name}</Text>
              <Text style={styles.username}>@{userData?.username}</Text>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Icon name="pencil" size={16} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Icon name="bike" size={24} color="#1a237e" />
                <Text style={styles.statValue}>{userData?.stats.numOfRides}</Text>
                <Text style={styles.statLabel}>Total Rides</Text>
              </View>

              <View style={styles.statCard}>
                <Icon name="map-marker-distance" size={24} color="#1a237e" />
                <Text style={styles.statValue}>{userData?.stats.totalKm}km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>

              <View style={styles.statCard}>
                <Icon name="speedometer" size={24} color="#1a237e" />
                <Text style={styles.statValue}>{userData?.stats.avgSpeed}km/h</Text>
                <Text style={styles.statLabel}>Avg Speed</Text>
              </View>

              <View style={styles.statCard}>
                <Icon name="fire" size={24} color="#1a237e" />
                <Text style={styles.statValue}>{userData?.stats.caloriesBurned}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Info</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(userData?.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity 
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.imagePickerButton}
                onPress={selectImage}
              >
                {avatarSource === 'https://your-avatar-url.com' ? (
                  <InitialAvatar name={userData?.name} />
                ) : (
                  <Image
                    source={{ uri: avatarSource }}
                    style={styles.previewImage}
                  />
                )}
                <View style={styles.imageOverlay}>
                  <Icon name="camera" size={24} color="#fff" />
                  <Text style={styles.imagePickerText}>Change Photo</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
              />

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Navigation bar fixed at bottom */}
        <NavigationBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a237e',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  profileCard: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 35, 126, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  closeButton: {
    padding: 4,
  },
  imagePickerButton: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initialText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;