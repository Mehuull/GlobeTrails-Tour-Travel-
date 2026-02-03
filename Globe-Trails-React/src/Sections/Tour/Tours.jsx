import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import TourCard from './components/TourCard';
import './Tours.css';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/tours${search}`);
        if (res.data.success) {
          setTours(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tours", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [search]);

  return (
    <div className="tours-page">
      <div className="tours-header">
        <h1>Our Popular Tours</h1>
        <p className="subtitle">Explore the world with our curated travel packages</p>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="tours-grid-container">
          <div className="tours-grid">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
          {tours.length === 0 && <p className="no-tours">No tours available at the moment.</p>}
        </div>
      )}
    </div>
  );
};

export default Tours;