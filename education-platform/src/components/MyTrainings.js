import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/MyTrainings.css"; // Προσθήκη στυλ

const MyTrainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // Παίρνουμε το user από το localStorage

    useEffect(() => {
        if (!user || !user.id) {
            navigate("/login"); // Αν δεν υπάρχει χρήστης, τον πάμε στο login
        } else {
            fetchTrainings();
        }
    }, []);

    const fetchTrainings = async () => {
        try {
            const response = await axios.get(`http://localhost/eduplatform/api/getUserTrainings.php?user_id=${user.id}`);
            if (response.data.success) {
                setTrainings(response.data.trainings);
            }
        } catch (error) {
            console.error("Error fetching trainings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleContinueTraining = (trainingId) => {
        navigate(`/start-training/${trainingId}`); // Ο χρήστης συνεχίζει από εκεί που σταμάτησε
    };

    if (loading) {
        return <p>Loading trainings...</p>;
    }

    return (
        <div className="my-trainings">
            <h2>My Trainings</h2>
            {trainings.length === 0 ? (
                <p>No trainings started yet.</p>
            ) : (
                <ul>
                    {trainings.map((training) => (
 <li key={training.id} className="training-card">
 <img src={`http://localhost/eduplatform/${training.image_url}`} alt={training.title} />
 <div className="training-info">
     <h3>{training.title}</h3>
     <p>{training.description}</p>
     <div className="progress-container">
         <div className="progress-bar" style={{ width: `${training.progress}%` }}>
             {training.progress}%
         </div>
     </div>

     {training.progress < 100 && (
         <button onClick={() => handleContinueTraining(training.id)}>Continue Training</button>
     )}

     {training.progress === 100 && (
         <span className="completed-label">Completed</span>
     )}
 </div>
</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyTrainings;

