import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../backend/supabase";
import Logo from "../../assets/img/logo-inv.png";

import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/Home`,
        },
      });

      if (error) {
        throw error;
      }

      setMessage(
        "Sign up successful! Please check your email for confirmation."
      );
      setMessageType("success");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    }
  };

  const handleSignInClick = () => {
    navigate("/SignIn");
  };

  // Note: Google Sign-Up is currently disabled. Uncomment the code below to enable it again.
  // const handleGoogleSignUp = async () => {
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //     });

  //     if (error) {
  //       throw error;
  //     }

  //     setMessage("Redirecting to Google sign-up...");
  //     setMessageType("info");
  //   } catch (error) {
  //     setMessage(Error: ${error.message});
  //     setMessageType("error");
  //   }
  // };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img src={Logo} alt="Ai-nterview Logo" className="signup-logo" />
        <h3 style={{ color: "#FFF6E9" }}>Sign Up</h3>
        {message && <p className={`message ${messageType}`}>{message}</p>}
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="signup-input"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/*
          <button
            type="button"
            className="google-auth"
            onClick={handleGoogleSignUp}
          >
            <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
            Sign up with Google
          </button>
          */}

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <span className="signin-link" onClick={handleSignInClick}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
