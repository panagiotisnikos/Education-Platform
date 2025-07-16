import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InstructorTraineeProgress = () => {
  const [traineeProgress, setTraineeProgress] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "instructor") {
      axios
        .get(`http://localhost/eduplatform/api/getTraineeProgress.php?instructor_id=${user.id}`)
        .then((response) => {
          if (response.data.success) {
            // μονο τις μοναδικές εγγραφές
            const uniqueProgress = filterUniqueProgress(response.data.traineeProgress);
            setTraineeProgress(uniqueProgress);
          }
        })
        .catch((error) => console.error("Error fetching trainee progress:", error));
    }
  }, [user]);

  //  σβηνω διπλοεγγραφές
  const filterUniqueProgress = (progressData) => {
    const uniqueEntries = new Map();
    progressData.forEach((entry) => {
      const key = `${entry.user_id}-${entry.training_plan_id}`;
      if (!uniqueEntries.has(key)) {
        uniqueEntries.set(key, entry);
      }
    });
    return Array.from(uniqueEntries.values());
  };

  return (
    <div className="trainee-progress-container">
      <h2>Trainee Progress</h2>
      {traineeProgress.length > 0 ? (
        <table className="trainee-progress-table">
          <thead>
            <tr>
              <th>Εκπαίδευση</th>
              <th>Όνομα Εκπαιδευόμενου</th>
              <th>Email</th>
              <th>Πρόοδος</th>
              <th>Κατάσταση</th>
            </tr>
          </thead>
          <tbody>
            {traineeProgress.map((trainee, index) => (
              <tr key={index}>
                <td>{trainee.title}</td>
                <td>{trainee.full_name}</td>
                <td>{trainee.email}</td>
                <td>
                  <progress value={trainee.progress} max="100"></progress> {trainee.progress}%
                </td>
                <td>{trainee.status === "completed" ? "Ολοκληρωμένη ✅" : "Σε εξέλιξη⏳"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No trainee progress data found.</p>
      )}
    </div>
  );
};

export default InstructorTraineeProgress;

