import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";

export default function EndQuestion() {
  const navigate = useNavigate();

  const handleViewResults = () => {
    // Navigate to results page or show results modal
    console.log("View results");
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold text-[#1C1B23]">
          Your Interview is Done
        </h1>
        <p className="text-xl text-gray-600">see the results!</p>
        <button
          onClick={handleViewResults}
          className="bg-[#5B21B6] hover:bg-[#4C1D95] text-white px-8 py-2 rounded-md"
        >
          Results
        </button>
      </div>
    </Layout>
  );
}
