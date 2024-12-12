import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * Hook to fetch the Near Earth Object (NEO) feed from NASA's API.
 * @param {string} start_date - The start date for fetching data (YYYY-MM-DD).
 * @param {string} end_date - The end date for fetching data (YYYY-MM-DD).
 * @returns {object} - { data, loading, error }
 */
const useNEOFeed = (start_date, end_date) => {
  const [data, setData] = useState(null); // Holds the fetched data
  const [loading, setLoading] = useState(false); // Indicates the loading state
  const [error, setError] = useState(null); // Holds any error message

  useEffect(() => {
    if (!start_date || !end_date) {
      console.error("Start and end dates are required for NEO Feed.");
      return;
    }

    const fetchNEOFeed = async () => {
      setLoading(true);
      setError(null);

      try {
        const neoData = await api.getNEOFeed(start_date, end_date);
        // Limit the data to 10 entries per day
        const limitedData = Object.keys(neoData.near_earth_objects).reduce((acc, date) => {
          acc[date] = neoData.near_earth_objects[date].slice(0, 1);
          return acc;
        }, {});
        setData({ ...neoData, near_earth_objects: limitedData });
      } catch (err) {
        setError(err.message || "Failed to fetch NEO feed data.");
      } finally {
        setLoading(false);
      }
    };

    fetchNEOFeed();
  }, [start_date, end_date]); // Re-run the effect when dates change

  return { data, loading, error };
};

export default useNEOFeed;