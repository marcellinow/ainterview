import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./StartQuestion.css";

export default function StartQuestion() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/Questions/Questions/1");
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
