import React from "react";
import "./Hero.css";

const Hero = ({ scrollToQuotes }) => {
  return (
    <section className="hero">
      <h1>
        Get a proper interview based on who you are, what you are, and what you
        want to be
      </h1>
      <h2>AI-nterview</h2>
      <button className="hero-button" onClick={scrollToQuotes}>
        What do we do?
      </button>
    </section>
  );
};

export default Hero;
