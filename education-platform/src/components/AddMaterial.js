import React, { useState, useEffect } from "react";
import axios from "axios";

const AddMaterial = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [selectedTrainingPlan, setSelectedTrainingPlan] = useState("");
  const [type, setType] = useState("video");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTrainingPlans();
  }, []);

  const fetchTrainingPlans = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "instructor") {
        console.error("User not found or not an instructor");
        return;
      }

      const response = await axios.get(
        `http://localhost/eduplatform/api/getTrainingPlans.php?user_id=${user.id}`
      );

      if (response.data.length > 0) {
        setTrainingPlans(response.data);
        setSelectedTrainingPlan(response.data[0].id); // Προεπιλεγμένο Training Plan
      } else {
        setTrainingPlans([]);
      }
    } catch (error) {
      console.error("Failed to fetch training plans:", error);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("training_plan_id", selectedTrainingPlan);
    formData.append("type", type);

    if (image) {
      formData.append("file", image);
    } else {
      formData.append("url", url);
    }

    try {
      const response = await axios.post(
        "http://localhost/eduplatform/api/addMaterial.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.success ? "Material added successfully!" : response.data.error);
    } catch (error) {
      setMessage("Failed to add material.");
    }
  };

  return (
    <div>
      <h2>Add Training Material</h2>
      <form onSubmit={handleSubmit}>
        <label>Training Plan:</label>
        <select value={selectedTrainingPlan} onChange={(e) => setSelectedTrainingPlan(e.target.value)}>
          {trainingPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.title}
            </option>
          ))}
        </select>

        <label>Material Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="video">Video</option>
          <option value="slide">Slide</option>
        </select>

        {type === "video" || type === "slide" ? (
          <>
            <label>Material URL:</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required={!image} />
          </>
        ) : null}

        <label>Upload Image (Optional):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit">Add Material</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddMaterial;



