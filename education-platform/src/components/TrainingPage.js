import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/TrainingPage.css";

const TrainingPage = () => {
  const { id } = useParams();
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingPlanDetails();
  }, []);

  const fetchTrainingPlanDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost/eduplatform/api/getTrainingPlanDetails.php?training_plan_id=${id}`
      );
      if (response.data.success) {
        setTrainingPlan(response.data.trainingPlan);
        setSections(response.data.sections);
        if (response.data.sections.length > 0) {
          setSelectedSectionIndex(0);
          fetchMaterials(response.data.sections[0].id);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch training plan details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sections.length > 0) {
      fetchMaterials(sections[selectedSectionIndex]?.id);
    }
  }, [selectedSectionIndex]); // κάθε φορά που αλλάζει το επιλεγμένο section

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
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleNext = () => {
    if (selectedSectionIndex < sections.length - 1) {
      setSelectedSectionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (selectedSectionIndex > 0) {
      setSelectedSectionIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!trainingPlan) return <p>Training Plan not found.</p>;

  const selectedSection = sections[selectedSectionIndex];

  return (
    <div className="training-container">
      <aside className="sidebar">
        <h2>Course Content</h2>
        <ul>
          {sections.map((section, index) => (
            <li
              key={section.id}
              className={selectedSectionIndex === index ? "active" : ""}
              onClick={() => setSelectedSectionIndex(index)}
            >
              {section.title}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <h1>{trainingPlan.title}</h1>
        <h2>{selectedSection?.title}</h2>
        <p className="section-content">{selectedSection?.content}</p>

        {/* προβολή Αρχείων */}
        {materials[selectedSection?.id] &&
        materials[selectedSection?.id].length > 0 ? (
          <div className="materials">
            {materials[selectedSection.id].map((file) => (
              <div key={file.id} className="file-item">
                {file.type === "video" ? (
                  <video controls>
                    <source
                      src={`http://localhost/eduplatform/uploads/${file.file_path}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={`http://localhost/eduplatform/uploads/${file.file_path}`}
                    width="100%"
                    height="500px"
                  ></iframe>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No materials available.</p>
        )}

        {/* back next buttons */}
        <div className="navigation-buttons">
          <button onClick={handleBack} disabled={selectedSectionIndex === 0}>
            ⬅ Back
          </button>
          <button
            onClick={handleNext}
            disabled={selectedSectionIndex === sections.length - 1}
          >
            Next ➡
          </button>
        </div>
      </main>
    </div>
  );
};

export default TrainingPage;







