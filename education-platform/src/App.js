import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams  } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import MyTrainings from "./components/MyTrainings";
import AdminPanel from "./components/InstructorAdminPanel";
import CreateTrainingPlan from "./components/CreateTrainingPlan";
import InstructorTraineeProgress from "./components/InstructorTraineeProgress";
import PreviewTraining from "./components/PreviewTraining";
import Profile from "./components/UserProfile";
import Settings from "./components/SettingsPage";
import Login from "./components/Login";
import Register from "./components/Register";
import MessagesPage from "./components/MessagePage";
import Footer from "./components/Footer";
import StartTraining from "./components/StartTraining";
import TrainingPlanDetails from "./components/TrainingPlanDetails";
import "./App.css";
import unipiLogo from "./assets/unipi-logo.jpg";
import TrainingRatingsList from "./components/TrainingRatingsList";
import AverageRatingsList from "./components/AverageRatingsList";
const App = () => {
  const [user, setUser] = useState(null); // Εδώ το user είναι state πλέον
  const [unreadMessages, setUnreadMessages] = useState(0);
  const TrainingRatingsListWrapper = () => {
    const { trainingPlanId } = useParams();
    return (
      <div className="ratings-wrapper">
        <TrainingRatingsList trainingPlanId={trainingPlanId} />
      </div>
    );
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUnreadMessages = async () => {
        try {
          const response = await fetch(`http://localhost/eduplatform/api/getMessages.php?user_id=${user.id}`);
          const messages = await response.json();
          const unread = messages.filter(msg => !msg.is_read).length;
          setUnreadMessages(unread);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchUnreadMessages();
      const interval = setInterval(fetchUnreadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);
  useEffect(() => {
    document.title = "Πανεπιστήμιο - Πλατφόρμα Εκπαίδευσης";

    
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = "/unipi-logo.jpg";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = "/unipi-logo.jpg";
      document.head.appendChild(newFavicon);
    }
  }, []);
  return (
    <Router>
      {user ? <Navbar userId={user?.id} unreadMessages={unreadMessages} /> : null} 
      <div className="app-container">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-trainings" element={<MyTrainings />} />
          <Route path="/start-training/:id" element={<StartTraining/>} />
          <Route path="/training-details/:id" element={<TrainingPlanDetails/>} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/create-training-plan" element={<CreateTrainingPlan />} />
          <Route path="/instructor-trainee-progress" element={<InstructorTraineeProgress />} />
          <Route path="/preview-training/:id" element={<PreviewTraining />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings userId={user?.id} />} />
          <Route path="/messages" element={<MessagesPage userId={user?.id} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ratings" element={<TrainingRatingsList trainingPlanId={1} />} />
          <Route path="/average-ratings" element={<AverageRatingsList instructorId={user?.id} />} />
        </Routes>
        <Footer /> 
      </div>

    </Router>
  );
};

export default App;













