import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/StartTraining.css";
import { useNavigate } from "react-router-dom";

const PreviewTraining = () => {
  const { id } = useParams();
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [instructorTrainings, setInstructorTrainings] = useState([]);

  useEffect(() => {
    fetchInstructorTrainings();
  }, []);

  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      fetchTrainingPlanDetails();
    }
  }, [id]);

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

  const fetchInstructorTrainings = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "instructor") return;

    try {
      const response = await axios.get(`http://localhost/eduplatform/api/getTrainingPlans.php?user_id=${user.id}`);
      if (Array.isArray(response.data)) {
        setInstructorTrainings([...response.data]);
      } else {
        console.error("Unexpected API Response Structure:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch instructor trainings:", error);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="start-training-container">
      <aside className="course-sidebar">
        <h2 className="sidebar-title">Select a Training to Preview</h2>
        <ul>
          {instructorTrainings && instructorTrainings.length > 0 ? (
            instructorTrainings.map((training) => (
              <li key={training.id} className="training-item">
                <button className="training-button" onClick={() => navigate(`/preview-training/${training.id}`)}>
                  {training.title || "Unnamed Training"}
                </button>
              </li>
            ))
          ) : (
            <p>No trainings available.</p>
          )}
        </ul>
      </aside>

      {trainingPlan && (
        <div className="training-content">
          <h1 className="training-title">{trainingPlan.title}</h1>
          {sections.length > 0 && (
            <>
              <h2 className="content-header">Course Content</h2>
              <ul>
                {sections.map((section, index) => (
                  <li key={section.id} className="section-item">
                    <button
                      className={`section-btn ${selectedSectionIndex === index ? "active" : ""}`}
                      onClick={() => setSelectedSectionIndex(index)}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {sections.length > 0 && selectedSectionIndex !== null && (
            <div className="section-content">
              <h2 className="section-title">{sections[selectedSectionIndex].title}</h2>
              <p className="section-description">{sections[selectedSectionIndex].content}</p>
              {materials[sections[selectedSectionIndex].id] && materials[sections[selectedSectionIndex].id].length > 0 ? (
                <div className="materials">
                  {materials[sections[selectedSectionIndex].id].map((file) => (
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
        </div>
      )}
    </div>
  );
};

export default PreviewTraining;

