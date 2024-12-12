import axios from "axios";

// Base URL and API Key
const BASE_URL = "https://api.nasa.gov";
const API_KEY = "DEMO_KEY"; 

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// API Services
const api = {
  // 1. Astronomy Picture of the Day (APOD)
  getAPOD: async (date = null) => {
    try {
      const response = await apiClient.get("/planetary/apod", {
        params: date ? { date } : {}, // If date is provided, include it in the params
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching APOD:", error);
      throw error;
    }
  },

  // 2. Earth Imagery (Bangladesh)
  getEarthImagery: async (lon = 90.3563, lat = 23.685) => { // Fixed syntax error in function declaration
    try {
      const response = await apiClient.get("/planetary/earth/imagery", {
        params: { lon, lat, dim: 0.15, date: "2024-01-01" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Earth imagery:", error);
      throw error;
    }
  },

  // 3. Mars Rover Photos - Query by Sol
  getMarsPhotosBySol: async (sol = 1000, page = 1) => {
    try {
      const response = await apiClient.get("/mars-photos/api/v1/rovers/curiosity/photos", {
        params: { sol, page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Mars photos by Sol:", error);
      throw error;
    }
  },

  // 4. Mars Rover Photos - Query by Earth Date
  getMarsPhotosByEarthDate: async (earth_date, page = 1) => {
    try {
      const response = await apiClient.get("/mars-photos/api/v1/rovers/curiosity/photos", {
        params: { earth_date, page },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Mars photos by Earth date:", error);
      throw error;
    }
  },

  // 5. Near Earth Object (Asteroid Feed)
  getNEOFeed: async (start_date, end_date) => {
    try {
      const response = await apiClient.get("/neo/rest/v1/feed", {
        params: { start_date, end_date },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching NEO feed:", error);
      throw error;
    }
  },
};

export default api;
