import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import "../styles/AverageRatingsList.css";

const AverageRatingsList = ({ instructorId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAverageRatings();
  }, [instructorId]);

  const fetchAverageRatings = async () => {
    try {
      const response = await axios.get(
        `http://localhost/eduplatform/api/getAverageRatings.php?instructor_id=${instructorId}`
      );
      if (response.data.success) {
        setRatings(response.data.ratings);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch average ratings:", error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading ratings...</p>;

  return (
    <div className="average-ratings-container">
      <h2>Μέσος Όρος Αξιολογήσεων Εκπαιδευτικών Προγραμμάτων</h2>
      <table className="average-ratings-table">
        <thead>
          <tr>
            <th>Εκπαιδευτικό Πρόγραμμα</th>
            <th>Μέση Αξιολόγηση</th>
            <th>Δικό μου Πρόγραμμα</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating) => (
            <tr key={rating.training_plan_id}>
              <td>{rating.training_title}</td>
              <td>
                {rating.average_rating !== "Χωρίς αξιολογήσεις" ? (
                  <>
                    {[...Array(5)].map((_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        className={
                          starIndex < Math.round(rating.average_rating)
                            ? "star selected"
                            : "star"
                        }
                      />
                    ))}
                    ({rating.average_rating})
                  </>
                ) : (
                  "Χωρίς αξιολογήσεις"
                )}
              </td>
              <td>
                {rating.is_owner ? (
                  <FaCheckCircle className="owner-icon" title="Δικό μου πρόγραμμα" />
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AverageRatingsList;

