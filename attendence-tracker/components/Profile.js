import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, Modal, TouchableOpacity, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBar from './NavigationBar';
import { launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("Vineet Channe");
  const [avatarSource, setAvatarSource] = useState('https://your-avatar-url.com');

  // Mock data - replace with actual user data
  const user = {
    name: editedName,
    username: "@channey",
    location: "Mumbai",
    joinedDate: "March 2023",
    stats: {
      totalRides: 156,
      totalDistance: 2890,
      avgSpeed: 18.5,
      calories: 28500
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.headerSection}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: avatarSource }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
            
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={16} color="#fff" />
              <Text style={styles.locationText}>{user.location}</Text>
              <Icon name="calendar" size={16} color="#fff" style={styles.calendarIcon} />
              <Text style={styles.locationText}>Joined {user.joinedDate}</Text>
            </View>

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Icon name="pencil" size={16} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Cycling Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="bike" size={24} color="#1a237e" />
              <Text style={styles.statNumber}>{user.stats.totalRides}</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="map-marker-distance" size={24} color="#1a237e" />
              <Text style={styles.statNumber}>{user.stats.totalDistance}</Text>
              <Text style={styles.statLabel}>Total KM</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="speedometer" size={24} color="#1a237e" />
              <Text style={styles.statNumber}>{user.stats.avgSpeed}</Text>
              <Text style={styles.statLabel}>Avg Speed</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="fire" size={24} color="#1a237e" />
              <Text style={styles.statNumber}>{user.stats.calories}</Text>
              <Text style={styles.statLabel}>Calories Burned</Text>
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
              <Image
                source={{ uri: avatarSource }}
                style={styles.previewImage}
              />
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
      <View style={styles.navContainer}>
        <NavigationBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    backgroundColor: '#1a237e',
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  locationText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  calendarIcon: {
    marginLeft: 16,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingBottom: 80,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statNumber: {
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
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
});

export default Profile;