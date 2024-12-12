import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { 
  Card, 
  Text as PaperText 
} from 'react-native-paper';
import { 
  MaterialIcons, 
  Ionicons, 
  Feather 
} from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const NEOCard = ({ neoData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to determine hazard level color
  const getHazardColor = (isHazardous) => 
    isHazardous ? '#FF6B6B' : '#4ECB71';

  return (
    <Card style={styles.neoCard}>

      {/* Card Content */}
      <View style={styles.cardContentContainer}>
        <View style={styles.cardHeader}>
          <MaterialIcons 
            name="space-dashboard" 
            size={24} 
            color="#002339" 
          />
          <Text style={styles.neoName}>{neoData.name}</Text>
        </View>

        {/* Diameter Information */}
        <View style={styles.infoRow}>
          <Ionicons 
            name="resize" 
            size={20} 
            color="#4A90E2" 
          />
          <Text style={styles.infoText}>
            Diameter: {neoData.estimated_diameter.meters.estimated_diameter_min.toFixed(2)}m - 
            {neoData.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}m
          </Text>
        </View>

        {/* Hazard Level */}
        <View style={styles.infoRow}>
          <MaterialIcons 
            name="warning" 
            size={20} 
            color={getHazardColor(neoData.is_potentially_hazardous_asteroid)} 
          />
          <Text 
            style={[
              styles.infoText, 
              { color: getHazardColor(neoData.is_potentially_hazardous_asteroid) }
            ]}
          >
            {neoData.is_potentially_hazardous_asteroid 
              ? 'Potentially Hazardous' 
              : 'Safe Trajectory'}
          </Text>
        </View>

        {/* Close Approach Details */}
        {neoData.close_approach_data && neoData.close_approach_data.length > 0 && (
          <View>
            <View style={styles.infoRow}>
              <Feather 
                name="calendar" 
                size={20} 
                color="#FF9F1C" 
              />
              <Text style={styles.infoText}>
                Close Approach: {neoData.close_approach_data[0].close_approach_date}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons 
                name="speed" 
                size={20} 
                color="#6A5ACD" 
              />
              <Text style={styles.infoText}>
                Velocity: {neoData.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h
              </Text>
            </View>
          </View>
        )}

        {/* Read More/Less Toggle */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            onPress={() => setIsExpanded(!isExpanded)}
            style={styles.readMoreButton}
          >
            <Text style={styles.readMoreText}>
              {isExpanded ? 'Collapse' : 'More Details'}
            </Text>
          </TouchableOpacity>

          {/* Share Icon */}
          <TouchableOpacity>
            <Feather 
              name="share-2" 
              size={24} 
              color="#002339" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const NearEarthObjectsScreen = ({ neoData }) => {
  // Filter and limit NEO data to 10 per day
  const firstTenObjects = Object.values(neoData.near_earth_objects)
    .flat()
    .slice(0, 10);

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
    >
      {firstTenObjects.map((neo, index) => (
        <NEOCard 
          key={index} 
          neoData={neo} 
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  neoCard: {
    width: width * 0.85,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  lottieBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  cardContentContainer: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 10,
  },
  neoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#002339',
  },
  infoRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  readMoreButton: {
    paddingVertical: 5,
  },
  readMoreText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});

export default NearEarthObjectsScreen;