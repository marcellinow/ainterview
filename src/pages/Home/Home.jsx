import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
// import NavbarHome from "./NavbarHome";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import interviewIcon from "../../assets/img/interview-icon.png";
import insightsIcon from "../../assets/img/insights-icon.png";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />

      <div className="home-content">
        <h1 className="home-title">What do you want to do?</h1>
        <div className="options">
          <div
            className="option"
            onClick={() => handleNavigation("/interview")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && handleNavigation("/interview")
            }
          >
            <div className="icon-interview-icon"></div>
            <img src={interviewIcon} className="resources-icon" />
            <h2 className="option-title">Interview</h2>
            <p>Start your personalized interview here</p>
          </div>

          <div
            className="option"
            onClick={() => handleNavigation("/insights")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && handleNavigation("/insights")
            }
          >
            <div className="icon-insights-icon"></div>
            <img src={insightsIcon} className="resources-icon" />
            <h2 className="option-title">Insights</h2>
            <p>See your interview insights</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
