import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import MessageList from "./MessageList";
const Dashboard = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // 🔥 Διαβάζουμε το user μόνο μία φορά

  useEffect(() => {
    fetchTrainingPlans();
  }, []);

  const fetchTrainingPlans = async () => {
    try {
      const response = await axios.get("http://localhost/eduplatform/api/getTrainingPlans.php");
      setTrainingPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch training plans:", error);
    }
  };

  const handleTrainingClick = (plan) => {
    if (!user) {
      console.error("User not found!");
      return;
    }

    console.log("Navigating as:", user.role, "to", plan.id);

    if (user.role === "instructor" && plan.user_id === user.id) {
      navigate(`/preview-training/${plan.id}`); // 🔥 Ελέγχουμε instructor και αν είναι δημιουργός
    } else {
      navigate(`/training-details/${plan.id}`); // 🔥 Trainee μεταφέρεται στις λεπτομέρειες
    }
  };

  const getImageUrl = (url) => {
    if (!url || url === "NULL") return "/default-training.jpg";
    if (url.startsWith("http")) return url;
    return `http://localhost/eduplatform/${url}`;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    pauseOnHover: true,
  };

  return (
    <div style={styles.container}>
<div className="welcome-banner">
<h1>Καλώς ήρθες, {user.full_name || (user.role === "instructor" ? "Εκπαιδευτή" : "Εκπαιδευόμενε")}!</h1>

  <p>{user.role === "instructor" ? "Δημιούργησε και διαχειρίσου εκπαιδεύσεις!" : "Συνέχισε την εκπαίδευσή σου και δες την πρόοδό σου."}</p>
</div>


      {trainingPlans.length > 0 ? (
        <Slider {...settings} style={styles.slider}>
          {trainingPlans.map((plan) => (
            <div
            key={plan.id}
            onClick={() => handleTrainingClick(plan)}
            style={{ ...styles.slide }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = styles.slideHover.transform)}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img src={getImageUrl(plan.image_url)} alt={plan.title} style={styles.image} />
            <div style={styles.overlay}>
              <h3>{plan.title}</h3>
            </div>
          </div>
          
          ))}
        </Slider>
      ) : (
        <p>No training plans available.</p>
      )}
    </div>
  );
};

const styles = {
  slide: {
    position: "relative",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
  },
  slideHover: {
    transform: "scale(1.05)", // 🔥 Μικρό zoom effect όταν περνάει το ποντίκι
  },
  image: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "8px",
    transition: "opacity 0.3s ease-in-out",
  },
  overlay: {
    position: "absolute",
    bottom: "10px",
    left: "0",
    width: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: "10px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
};


export default Dashboard;











