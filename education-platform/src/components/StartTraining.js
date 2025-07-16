import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StartTraining.css";
import { FaStar } from "react-icons/fa";

const StartTraining = () => {
  const { id } = useParams();
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedSections, setCompletedSections] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  useEffect(() => {
    fetchTrainingPlanDetails();
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      setSelectedSectionIndex(0);
      fetchMaterials(sections[0].id);
    }
  }, [sections]);

  useEffect(() => {
    if (sections.length > 0 && sections[selectedSectionIndex]) {
      fetchMaterials(sections[selectedSectionIndex].id);
    }
  }, [selectedSectionIndex]);

  const fetchCompletedSections = async (trainingPlanId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await axios.get(
            `http://localhost/eduplatform/api/getUserProgress.php?user_id=${user.id}&training_plan_id=${trainingPlanId}`
        );
        if (response.data.success) {
            const completed = {};
            response.data.completedSections.forEach((sectionId) => {
                completed[sectionId] = true;
            });
            setCompletedSections(completed);
        }
    } catch (error) {
        console.error("Error fetching completed sections:", error);
    }
};

  const fetchTrainingPlanDetails = async () => {
    try {
        const response = await axios.get(
            `http://localhost/eduplatform/api/getTrainingPlanDetails.php?training_plan_id=${id}`
        );
        if (response.data.success) {
            setTrainingPlan(response.data.trainingPlan);
            setSections(response.data.sections);

            // ✅ Φόρτωσε τα ολοκληρωμένα sections από τη βάση
            fetchCompletedSections(response.data.trainingPlan.id);
        }
        setLoading(false);
    } catch (error) {
        console.error("Failed to fetch training plan details:", error);
        setLoading(false);
    }
};


  const fetchMaterials = async (sectionId) => {
    try {
      const response = await axios.get(
        `http://localhost/eduplatform/api/getMaterials.php?section_id=${sectionId}`
      );
      if (response.data.success) {
        setMaterials((prev) => ({
          ...prev,
          [sectionId]: response.data.materials,
        }));
      } else {
        setMaterials((prev) => ({
          ...prev,
          [sectionId]: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const trackProgress = async (sectionId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.post("http://localhost/eduplatform/api/trackTrainingProgress.php", {
        user_id: user.id,
        training_plan_id: id,
        section_id: sectionId,
      });

      // ✅ Μόλις ολοκληρωθεί το section, το προσθέτουμε στο state
      setCompletedSections((prev) => ({
        ...prev,
        [sectionId]: true,
      }));
    } catch (error) {
      console.error("Failed to update training progress:", error);
    }
  };

  //για track training
  const handleCheckboxChange = (sectionId) => {
    if (!completedSections[sectionId]) {
        trackProgress(sectionId); 
        setCompletedSections((prev) => ({
            ...prev,
            [sectionId]: true,
        }));
    }
};


  const handleNext = () => {
    if (selectedSectionIndex < sections.length - 1) {
      const nextIndex = selectedSectionIndex + 1;
      setSelectedSectionIndex(nextIndex);
      fetchMaterials(sections[nextIndex].id);
    }
  };

  const handleBack = () => {
    if (selectedSectionIndex > 0) {
      const prevIndex = selectedSectionIndex - 1;
      setSelectedSectionIndex(prevIndex);
      fetchMaterials(sections[prevIndex].id);
    }
  };

  const handleCompleteTraining = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await axios.post("http://localhost/eduplatform/api/trackTrainingProgress.php", {
            user_id: user.id,
            training_plan_id: id,
            status: "completed"
        });

        console.log("Full API Response:", response);
        console.log("API Response Data:", response.data);

        if (response.data && response.data.success) {
            console.log("Training completed successfully!");
            setShowRatingModal(true); // ✅ Εμφάνιση του pop-up αξιολόγησης
        } else {
            console.error("Error updating training progress:", response.data?.error || "Unexpected response format");
        }
    } catch (error) {
        console.error("Error sending request:", error);
        console.log("Error Response:", error.response);
    }
};

const handleSubmitRating = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    await axios.post("http://localhost/eduplatform/api/saveRating.php", {
      training_plan_id: trainingPlan.id,
      user_id: user.id,
      rating: rating,
    });

    setShowRatingModal(false);
    setShowThankYouPopup(true);
  } catch (error) {
    console.error("Error submitting rating:", error);
  }
};

  const isCompleteButtonEnabled =
    sections.length > 0 && sections.every((section) => completedSections[section.id]);

  if (loading) return <p>Loading...</p>;
  if (!trainingPlan) return <p>Training Plan not found.</p>;

  const selectedSection = sections[selectedSectionIndex];

  return (
    <div className="start-training-container">
      <aside className="course-sidebar">
        <h2>Course Content</h2>
        <ul>
          {sections.map((section, index) => (
            <li key={section.id} className="section-item">
              <input
                type="checkbox"
                checked={completedSections[section.id] || false}
                onChange={() => handleCheckboxChange(section.id)}
              />
              <button
                className={`section-btn ${selectedSectionIndex === index ? "active" : ""}`}
                onClick={() => setSelectedSectionIndex(index)}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="training-content">
        <div className="nav-buttons-container">
          <button onClick={handleBack} disabled={selectedSectionIndex === 0} className="nav-button back">
            ⬅ Back
          </button>
          <button onClick={handleNext} disabled={selectedSectionIndex === sections.length - 1} className="nav-button next">
            Next ➡
          </button>
        </div>

        <h1>{trainingPlan.title}</h1>
        {selectedSection && (
          <div className="section-content">
            <h2>{selectedSection.title}</h2>
            <p>{selectedSection.content}</p>

            {materials[selectedSection.id] && materials[selectedSection.id].length > 0 ? (
              <div className="materials">
                {materials[selectedSection.id].map((file) => (
                  <div key={file.id} className="file-item">
                    {file.type === "video" ? (
                      <video controls width="100%">
                        <source src={`http://localhost/eduplatform/api/${file.file_path}`} type="video/mp4" />
                      </video>
                    ) : (
                      <iframe src={`http://localhost/eduplatform/api/${file.file_path}`} width="100%" height="500px"></iframe>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No materials available.</p>
            )}
          </div>
        )}
{/* Rating Modal */}
{showRatingModal && (
  <div className="rating-modal-overlay">
  <div className="rating-modal">
    <h3>Rate this training</h3>
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? "star selected" : "star"}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
    <button onClick={handleSubmitRating}>Submit</button>
  </div>
</div>
)}

{/* Thank You Message */}
{showThankYouPopup && (
  <div className="thank-you-popup">
  <p>Thank you for your rating!</p>
  <button onClick={() => setShowThankYouPopup(false)}>Close</button>
</div>
)}

<button className="complete-training-btn" onClick={handleCompleteTraining}>
        Complete Training
      </button>
      </div>
    </div>
  );
};

export default StartTraining;









