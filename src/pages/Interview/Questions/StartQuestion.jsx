import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./StartQuestion.css";

export default function StartQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.user_id || localStorage.getItem("user_id");

  console.log("user id di StartQuestion:", user_id);

  const handleStart = () => {
    navigate("/Questions/Questions/1", {
      state: {
        user_id: user_id,
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Are you ready?</h1>

        <p className="description">Start your interview</p>
        <button onClick={handleStart} className="button">
          Start the Interview
        </button>
      </div>
      <Footer />
    </>
  );
}
