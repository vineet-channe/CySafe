import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBar from './NavigationBar';

const CommunityPage = () => {
  const featuredPosts = [
    {
      id: 1,
      title: 'RC - Night Cycling',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
      description: 'Exploring the city\'s nightlife is an adventure',
      readTime: '6 minutes ago'
    },
    {
      id: 2,
      title: 'Mountain Escape',
      image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
      description: 'Discover the tranquility of mountain trails',
      readTime: '2 hours ago'
    },
    {
      id: 3,
      title: 'SPIT Cycling',
      image: 'https://images.unsplash.com/photo-1541625810516-44f1ce894bcd',
      description: 'Exploring the campus trails is an adventure',
      readTime: '1 day ago'
    }
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Cyclothon - Mumbai',
      description: 'Join us for the annual community cookout!',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Volunteer Needed',
      description: 'Looking for volunteers for the neighborhood cleanup.',
      time: '5 hours ago'
    },
    {
      id: 3,
      title: 'Workshop Alert',
      description: 'Sign up for the cycling workshop next weekend.',
      time: '1 day ago'
    },
    {
      id: 4,
      title: 'Lost & Found',
      description: 'A pair of gloves was found at the park.',
      time: '3 days ago'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Page</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="bell-outline" size={24} color="#1a237e" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Featured Posts</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.featuredContainer}
        >
          {featuredPosts.map(post => (
            <TouchableOpacity key={post.id} style={styles.featuredCard}>
              <Image source={{ uri: post.image }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{post.title}</Text>
                <Text style={styles.featuredDescription}>{post.description}</Text>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Read More</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Posts</Text>
        <View style={styles.recentContainer}>
          {recentPosts.map(post => (
            <TouchableOpacity key={post.id} style={styles.recentCard}>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>{post.title}</Text>
                <Text style={styles.recentDescription}>{post.description}</Text>
                <Text style={styles.timeText}>{post.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <NavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a237e',
  },
  featuredContainer: {
    marginBottom: 24,
  },
  featuredCard: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  readMoreButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  recentContainer: {
    marginBottom: 16,
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  recentContent: {
    padding: 16,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a237e',
  },
  recentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
});

export default CommunityPage; 