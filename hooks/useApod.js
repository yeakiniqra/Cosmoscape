import { useState, useEffect } from "react";
import api from "../services/api";

const useApod = (date = null) => {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      setError(null);
      try {
        const apodData = await api.getAPOD(date);
        setData(apodData);
      } catch (err) {
        setError(err.message || "Failed to fetch APOD data.");
      } finally {
        setLoading(false);
      }
    };

    fetchApod();
  }, [date]); 

  return { data, loading, error };
};

export default useApod;
