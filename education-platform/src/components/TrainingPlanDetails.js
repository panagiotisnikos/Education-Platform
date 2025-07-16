import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TrainingPlanDetails.css";

const TrainingPlanDetails = () => {
  const { id } = useParams();
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainingPlanDetails();
  }, []);

  const fetchTrainingPlanDetails = async () => {
    try {
      console.log(`Fetching training plan details for ID: ${id}`);
      const response = await axios.get(`http://localhost/eduplatform/api/getTrainingPlanDetails.php?training_plan_id=${id}`);
      console.log("API Response:", response.data);

      if (response.data.success) {
        setTrainingPlan(response.data.trainingPlan);
        setSections(response.data.sections);
      } else {
        console.error("Training Plan not found:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to fetch training plan details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!trainingPlan) return <p>Training Plan not found.</p>;

  return (
    <div className="training-plan-container">
      <div className="training-header">
        <h1>{trainingPlan.title}</h1>
        <p className="training-description">{trainingPlan.description}</p>
        <button className="start-training-btn" onClick={() => navigate(`/start-training/${id}`)}>
          Παρακολούθηση
        </button>
      </div>

      <div className="training-materials">
        <h2>Course Content</h2>
        {sections.length > 0 ? (
          <ul>
            {sections.map((section) => (
              <li key={section.id}>{section.title}</li>
            ))}
          </ul>
        ) : (
          <p>No sections available.</p>
        )}
      </div>
    </div>
  );
};

export default TrainingPlanDetails;




