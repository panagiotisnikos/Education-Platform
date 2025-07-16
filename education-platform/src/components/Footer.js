import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import "../App.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Πανεπιστήμιο Πειραιώς - EduPlatform. Όλα τα δικαιώματα διατηρούνται.</p>
        <p>
          <a href="https://www.unipi.gr" target="_blank" rel="noopener noreferrer">
            Επίσημη Ιστοσελίδα Πανεπιστημίου Πειραιώς
          </a>
        </p>
        <div className="social-icons">
          <a href="https://www.facebook.com/unipi.gr" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://twitter.com/unipi" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://www.linkedin.com/school/university-of-piraeus/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/universityofpiraeus/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.youtube.com/user/UniversityOfPiraeus" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

