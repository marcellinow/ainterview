import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../backend/supabase";
import Logo from "../../assets/img/logo-inv.png";
import GoogleLogo from "../../assets/img/google-pic.png";

import "./SignIn.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setMessage("Sign in successful!");
      setMessageType("success");
      navigate("/home");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        throw error;
      }

      setMessage("Redirecting to Google sign-in...");
      setMessageType("info");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    }
  };

  const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <img src={Logo} alt="Ai-nterview Logo" className="signin-logo" />
        <h3 style={{ color: "#FFF6E9" }}>Sign In</h3>
        {message && <p className={`message ${messageType}`}>{message}</p>}
        <form onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            className="signin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="signin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="google-auth" onClick={handleGoogleSignIn}>
            <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
            Sign in with Google
          </button>

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <p>
          Don’t have an account?{" "}
          <span className="signup-link" onClick={handleSignUpClick}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
