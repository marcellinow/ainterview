import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignIn from "./pages/AuthenticationPage/SignIn";
import SignUp from "./pages/AuthenticationPage/SignUp";
import Home from "./pages/Home/Home";
import Interview from "./pages/Interview/Interview";
import StartQuestion from "./pages/Interview/Questions/StartQuestion";
import QuestionPage from "./pages/Interview/Questions/Questions";
import EndQuestion from "./pages/Interview/Questions/EndQuestion";

function App() {
  return (
    <Router basename="/ainterview">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Interview" element={<Interview />} />
        <Route path="Questions/StartQuestion" element={<StartQuestion />} />
        <Route path="Questions/Questions/:id" element={<QuestionPage />} />
        <Route path="Questions/EndQuestion" element={<EndQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
