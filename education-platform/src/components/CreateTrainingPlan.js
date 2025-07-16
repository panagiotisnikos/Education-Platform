import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const CreateTrainingPlan = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "instructor") {
      setMessage("Μόνο εκπαιδευτές μπορούν να δημιουργήσουν εκπαιδευτικό πλάνο");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("user_id", user.id);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost/eduplatform/api/createTrainingPlan.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        setMessage("Το πλάνο εκπαίδευσης δημιουργήθηκε με επιτυχία!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(`Error: ${response.data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Request Error:", error);
      setMessage("Η δημιουργία εκπαιδευτικού πλάνου απέτυχε. Check console for details.");
    }
  };

  return (
    <div className="training-plan-container">
      <h1 className="form-title">Δημιουργία Εκπαιδευτικού Πλάνου</h1>
      <form className="training-plan-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          placeholder="Τίτλος"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-input"
          placeholder="Σύντομη Περιγραφή"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label className="form-label">Προσθήκη εικόνας (Optional):</label>
        <input type="file" className="form-input" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <div className="preview-container">
            <h4>Προεπισκόπιση:</h4>
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}

        <button type="submit" className="form-button">Δημιουργία</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default CreateTrainingPlan;



