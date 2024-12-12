import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  Image
} from "react-native";
import {
  Card,
  TouchableRipple,
  Text as PaperText,
  Button,
  Modal,
  Portal,
} from 'react-native-paper';
import { StatusBar } from "expo-status-bar";
import { AntDesign, Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/authContext";
import useApod from "../../../hooks/useApod";
import useNEOFeed from "../../../hooks/useNEOFeed";
import Loader from "../../../components/Loader";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, loading, error } = useApod();

  // Calculate dynamic dates for the current month
  const now = new Date();
  const startDate = now.toISOString().split("T")[0];
  const endDate = new Date(now.setDate(now.getDate() + 6)).toISOString().split("T")[0];

  const { data: neoData, loading: neoLoading, error: neoError } = useNEOFeed(startDate, endDate);

  const [isExpanded, setIsExpanded] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // Quick navigation items
  const quickLinks = [
    {
      icon: <MaterialIcons name="waves" size={24} color="#002339" />,
      title: "Mars Rover",
      route: "/mars-rover",
    },
    {
      icon: <Ionicons name="calendar-outline" size={24} color="#002339" />,
      title: "Space Events",
      route: "/space-events",
    },
    {
      icon: <AntDesign name="rocket1" size={24} color="#002339" />,
      title: "Missions",
      route: "/missions",
    },
    {
      icon: <MaterialIcons name="satellite" size={24} color="#002339" />,
      title: "Satellites",
      route: "/satellites",
    },
  ];

  const renderQuickLinks = () => {
    return quickLinks.map((link, index) => (
      <TouchableRipple
        key={index}
        onPress={() => router.push(link.route)}
        style={styles.quickLinkItem}
      >
        <View style={styles.quickLinkContent}>
          {link.icon}
          <PaperText style={styles.quickLinkText}>{link.title}</PaperText>
        </View>
      </TouchableRipple>
    ));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out today's Astronomy Picture of the Day: ${data.url}`,
        url: data.url,
      });
    } catch (error) {
      console.error('Error sharing APOD:', error);
    }
  };

  const getHazardColor = (isHazardous) =>
    isHazardous ? '#FF6B6B' : '#4ECB71';

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#002339" />

      {/* Image Background */}
      <Image
        source={require("../../../assets/images/topography.png")}
        style={styles.svgBackground}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>
            Hello, {user?.username || "Explorer"}
          </Text>

        </View>

        {/* Quick Links Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickLinksScroll}
        >
          {renderQuickLinks()}
        </ScrollView>
      </View>

      {/* APOD Section */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : data ? (
          <>
            <View style={styles.photoOfTheDayTag}>
              <AntDesign name="star" size={20} color="gold" />
              <Text style={styles.photoOfTheDayText}>Photo of the Day</Text>
              <AntDesign name="star" size={20} color="gold" />
            </View>
            <Card style={styles.apodCard}>
              <Card.Cover
                source={{ uri: data.url }}
                style={styles.apodImage}
              />
              <Card.Content>
                <PaperText variant="titleLarge" style={styles.apodTitle}>
                  {data.title}
                </PaperText>
                <PaperText
                  variant="bodyMedium"
                  style={styles.apodExplanation}
                  numberOfLines={isExpanded ? undefined : 3}
                >
                  {data.explanation}
                </PaperText>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setIsExpanded(!isExpanded)}
                    style={styles.readMoreButton}
                  >
                    <Text style={styles.readMoreText}>
                      {isExpanded ? "Read Less" : "Read More"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShareModalVisible(true)} style={styles.shareButton}>
                    <AntDesign name="sharealt" size={20} color="cyan" />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : null}

        <LottieView
          source={require("../../../assets/images/earth.json")}
          autoPlay
          loop
          style={styles.lottieEarth}
        />
        {/* NEO Feed Section */}
        {neoLoading ? (
          <Loader />
        ) : neoError ? (
          <Text style={styles.errorText}>Error: {neoError}</Text>
        ) : neoData?.near_earth_objects ? (
          <View style={styles.neoFeedContainer}>
            <Text style={styles.neoFeedTitle}>Near Earth Objects</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.values(neoData.near_earth_objects).flat().map((neo, index) => (
                <Card key={index} style={[styles.neoCard, { width: width * 0.8 }]}>
                  <Card.Content>
                    {/* Card Content */}
                    <View style={styles.cardContentContainer}>
                      <View style={styles.cardHeader}>
                        <MaterialIcons
                          name="space-dashboard"
                          size={24}
                          color="#FF9F1C"
                        />
                        <Text style={styles.neoName}>{neo.name}</Text>
                      </View>

                      {/* Diameter Information */}
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="resize"
                          size={20}
                          color="#4A90E2"
                        />
                        <Text style={styles.infoText}>
                          Diameter: {neo.estimated_diameter.meters.estimated_diameter_min.toFixed(2)}m -
                          {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}m
                        </Text>
                      </View>

                      {/* Hazard Level */}
                      <View style={styles.infoRow}>
                        <MaterialIcons
                          name="warning"
                          size={20}
                          color={getHazardColor(neo.is_potentially_hazardous_asteroid)}
                        />
                        <Text
                          style={[
                            styles.infoText,
                            { color: getHazardColor(neo.is_potentially_hazardous_asteroid) }
                          ]}
                        >
                          {neo.is_potentially_hazardous_asteroid
                            ? 'Potentially Hazardous'
                            : 'Safe Trajectory'}
                        </Text>
                      </View>

                      {/* Close Approach Details */}
                      {neo.close_approach_data && neo.close_approach_data.length > 0 && (
                        <View>
                          <View style={styles.infoRow}>
                            <Feather
                              name="calendar"
                              size={20}
                              color="#FF9F1C"
                            />
                            <Text style={styles.infoText}>
                              Close Approach: {neo.close_approach_data[0].close_approach_date}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <MaterialIcons
                              name="speed"
                              size={20}
                              color="#6A5ACD"
                            />
                            <Text style={styles.infoText}>
                              Velocity: {neo.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
      {/* Share Modal */}
      <Portal>
        <Modal
          visible={shareModalVisible}
          onDismiss={() => setShareModalVisible(false)}
          contentContainerStyle={styles.shareModal}
        >
          <View style={styles.shareModalContent}>
            <AntDesign name="sharealt" size={30} color="#002339" style={styles.shareModalIcon} />
            <Text style={styles.shareModalTitle}>Share Your Photo of the Day</Text>
            <Button
              mode="contained"
              onPress={handleShare}
              style={styles.shareButton}
              icon="share-variant"
            >
              Share
            </Button>
            <Button
              mode="text"
              onPress={() => setShareModalVisible(false)}
              style={styles.cancelButton}
              icon="close"
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081521",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: "100%",
  },
  header: {
    backgroundColor: "#002339",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greeting: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  avatarIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  quickLinksScroll: {
    marginTop: 15,
    paddingLeft: 5,
  },
  quickLinkItem: {
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  quickLinkContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cbcfd4",
    padding: 8,
    borderRadius: 30,
    elevation: 2,
  },
  quickLinkText: {
    marginLeft: 8,
    color: "#002339",
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  lottieEarth: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
  apodCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 15,
  },
  apodImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 250,
  },
  shareButton: {
    marginLeft: 20,
  },
  apodTitle: {
    marginTop: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  apodExplanation: {
    marginTop: 5,
    color: "gray",
    fontSize: 14,
  },
  readMoreButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    padding: 5,
  },
  readMoreText: {
    color: "#1E90FF",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  photoOfTheDayTag: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002339',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  photoOfTheDayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  apodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  neoFeedContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  neoFeedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
  neoCard: {
    marginRight: 12,
    borderRadius: 12,
    elevation: 4,
  },
  neoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cardContentContainer: {
    padding: 15,
  },
  neoCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  neoCardButton: {
    paddingVertical: 5,
  },
  shareModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  shareModalContent: {
    alignItems: 'center',
  },
  shareModalIcon: {
    marginBottom: 10,
  },
  shareModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#002339',
  },
  shareButton: {
    marginBottom: 10,
    color: 'white',
  },
  cancelButton: {
    color: 'red',
  },

  infoText: {
    fontSize: 14,
    color: 'gray',
  },

});
