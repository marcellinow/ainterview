import React, { useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowToDo from "./HowToDo";
import Footer from "../../components/Footer/Footer";
const LandingPage = () => {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="LandingPage">
        <Hero scrollToQuotes={scrollToFeatures} />
        <HowToDo />
        <div ref={featuresRef}>
          <Features />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
