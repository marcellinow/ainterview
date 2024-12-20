import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo-rg.png";
import "./Navbar.css";

const Navbar = () => {
  const isLandingPage = useLocation().pathname === "/";
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/SignUp");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <img src={Logo} alt="Ai-nterview Logo" className="navbar-logo" />
        </div>
        {isLandingPage ? (
          <div className="navbar-right">
            <Link to="/employers" className="nav-link">
              For employers
            </Link>
            <Link to="/signin" className="nav-link">
              Sign In
            </Link>
            <button onClick={handleLogin} className="nav-button">
              Let's get started!
            </button>
          </div>
        ) : (
          <div className="navbar-right">
            <img src="" alt="Profile Icon" className="navbar-profile-icon" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
