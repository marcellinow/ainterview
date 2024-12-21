import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./StartQuestion.css";

export default function StartQuestion() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">You Interview Has Done!</h1>
        <p className="description">See Your Results</p>
        <button onClick={handleStart} className="button">
          Results
        </button>
      </div>
      <Footer />
    </>
  );
}
