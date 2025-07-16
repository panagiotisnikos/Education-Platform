import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../styles/TrainingRatingsList.css";

const TrainingRatingsList = ({ trainingPlanId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [trainingPlanId]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `http://localhost/eduplatform/api/getRatings.php?training_plan_id=${trainingPlanId}`
      );
      if (response.data.success) {
        setRatings(response.data.ratings);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading ratings...</p>;

  if (ratings.length === 0)
    return <p>No ratings available for this training.</p>;

  return (
    <div className="ratings-container">
      <h2>Training Ratings</h2>
      {ratings.map((rating, index) => (
        <div key={index} className="rating-item">
          <p>
            <strong>{rating.trainee_name}</strong> -{" "}
            {new Date(rating.created_at).toLocaleDateString()}
          </p>
          <div className="star-rating">
            {[...Array(5)].map((_, starIndex) => (
              <FaStar
                key={starIndex}
                className={
                  starIndex < rating.rating ? "star selected" : "star"
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainingRatingsList;
