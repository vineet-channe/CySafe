import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBar from './NavigationBar';

const Leaderboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('Worldwide');

  const filters = ['Hacks', '6Dimens', 'SPIT', 'India'];
  const leaderboardData = [
    {
      id: 2,
      rank: 2,
      name: 'Krishna Sharma',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      distance: 105
    },
    {
      id: 1,
      rank: 1,
      name: 'Prasad Chopade',
      avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
      distance: 146
    },
    {
      id: 3,
      rank: 3,
      name: 'Vineet Channe',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      distance: 99
    },
    {
      id: 4,
      rank: 4,
      name: 'Paarth Bahety',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      distance: 56
    },
    {
      id: 5,
      rank: 5,
      name: 'Dhureen Shettigar',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      distance: 46
    },
    {
      id: 6,
      rank: 6,
      name: 'Lokesh Chaudhari',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
      distance: 35
    }
  ];

  const TopThree = () => (
    <View style={styles.podiumWrapper}>
      {/* Podium Background */}
      <View style={styles.podiumBackground}>
        <View style={styles.podiumSecond} />
        <View style={styles.podiumFirst} />
        <View style={styles.podiumThird} />
      </View>

      <View style={styles.podiumContainer}>
        {/* Second Place */}
        <View style={[styles.podiumItem, styles.secondPlace]}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>2</Text>
          </View>
          <Image source={{ uri: leaderboardData[0].avatar }} style={styles.podiumAvatar} />
          <Text style={styles.podiumName}>{leaderboardData[0].name}</Text>
          <View style={styles.distanceContainer}>
            <Icon name="bike" size={16} color="#666" />
            <Text style={styles.distanceText}>{leaderboardData[0].distance}</Text>
          </View>
        </View>

        {/* First Place */}
        <View style={[styles.podiumItem, styles.firstPlace]}>
          <View style={[styles.rankBadge, styles.firstBadge]}>
            <Text style={styles.rankText}>1</Text>
          </View>
          <Image source={{ uri: leaderboardData[1].avatar }} style={[styles.podiumAvatar, styles.firstAvatar]} />
          <Text style={styles.podiumName}>{leaderboardData[1].name}</Text>
          <View style={styles.distanceContainer}>
            <Icon name="bike" size={16} color="#666" />
            <Text style={styles.distanceText}>{leaderboardData[1].distance}</Text>
          </View>
        </View>

        {/* Third Place */}
        <View style={[styles.podiumItem, styles.thirdPlace]}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>3</Text>
          </View>
          <Image source={{ uri: leaderboardData[2].avatar }} style={styles.podiumAvatar} />
          <Text style={styles.podiumName}>{leaderboardData[2].name}</Text>
          <View style={styles.distanceContainer}>
            <Icon name="bike" size={16} color="#666" />
            <Text style={styles.distanceText}>{leaderboardData[2].distance}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <TopThree />

        <View style={styles.listContainer}>
          {leaderboardData.slice(3).map((item) => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.listRank}>{item.rank}</Text>
              <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
              <Text style={styles.listName}>{item.name}</Text>
              <View style={styles.listDistanceContainer}>
                <Icon name="bike" size={14} color="#666" />
                <Text style={styles.listDistanceText}>{item.distance} km</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <NavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#1a237e',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  podiumWrapper: {
    height: 220,
    position: 'relative',
  },
  podiumBackground: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  podiumFirst: {
    width: 80,
    height: 100,
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 25,
  },
  podiumSecond: {
    width: 80,
    height: 80,
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginRight: 10,
  },
  podiumThird: {
    width: 80,
    height: 60,
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: 10,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 1,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  firstPlace: {
    marginBottom: 100,
  },
  secondPlace: {
    marginBottom: 80,
  },
  thirdPlace: {
    marginBottom: 60,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  firstAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  rankBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#FFD700',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  firstBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    top: -14,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  podiumName: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  listRank: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  listName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  listDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listDistanceText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
});

export default Leaderboard; 