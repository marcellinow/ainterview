import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../backend/supabase";
import "./ChoosenCareer.css";

const ChoosenCareer = () => {
  const [selectedCareer, setSelectedCareer] = useState(""); // Karir yang dipilih user
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCareerChange = (event) => {
    setSelectedCareer(event.target.value); // Update karir yang dipilih
  };

  const handleCareerSubmit = async () => {
    // Ambil `user_id` dan `cv_id` dari state lokasi (dikirim dari Interview.jsx)
    const user_id = location.state?.user_id || localStorage.getItem("user_id");
    const cv_id = location.state?.cv_id || localStorage.getItem("cv_id");
    console.log("user id di ChoosenCareer:", user_id);
    console.log("cv id:", cv_id);
    if (!user_id || !cv_id) {
      setError("User ID or CV ID not found. Please try again.");
      return;
    }

    try {
      // Simpan karir yang dipilih ke tabel `user_career`
      const { error } = await supabase.from("user_career").insert([
        {
          user_id: user_id,
          cv_id: cv_id, // Simpan ID CV yang dipilih
          career_path: selectedCareer,
          created_at: new Date(),
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Career path inserted successfully");

      // Navigasi ke halaman StartQuestion
      navigate("/Questions/StartQuestion", {
        state: {
          user_id: user_id,
          cv_id: cv_id,
        },
      });
    } catch (err) {
      console.error("Error inserting career path:", err.message);
      setError(err.message || "Failed to save career path. Please try again.");
    }
  };

  return (
    <div className="choosen-career">
      <h1 className="career-title">Choose Your Career Path</h1>
      <select
        className="career-dropdown"
        value={selectedCareer}
        onChange={handleCareerChange}
      >
        <option value="">Select a career</option>
        <option value="Software Engineer">Software Engineer</option>
        <option value="Data Scientist">Data Scientist</option>
        <option value="Product Manager">Product Manager</option>
        <option value="Information Technology">Information Technology</option>
      </select>

      {selectedCareer && (
        <div className="career-description">
          {selectedCareer === "Software Engineer" && (
            <div className="career-card">
              <h2 className="career-title">Software Engineer</h2>
              <p className="career-description">
                Software engineers design, develop, and maintain software
                applications to meet the needs of businesses and consumers.
              </p>
            </div>
          )}
          {selectedCareer === "Data Scientist" && (
            <div className="career-card">
              <h2 className="career-title">Data Scientist</h2>
              <p className="career-description">
                Data scientists analyze and interpret complex data to help
                businesses make informed decisions.
              </p>
            </div>
          )}
          {selectedCareer === "Product Manager" && (
            <div className="career-card">
              <h2 className="career-title">Product Manager</h2>
              <p className="career-description">
                Product managers oversee the development and launch of new
                products to meet market demands.
              </p>
            </div>
          )}
          {selectedCareer === "Information Technology" && (
            <div className="career-card">
              <h2 className="career-title">Information Technology</h2>
              <p className="career-description">
                Information Technology focuses on the use of computer systems to
                boost business operations.
              </p>
            </div>
          )}
        </div>
      )}
      <button
        className="start-interview"
        onClick={handleCareerSubmit}
        disabled={!selectedCareer}
      >
        Continue
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ChoosenCareer;
