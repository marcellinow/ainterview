import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../backend/supabase";
import "./Questions.css";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [response, setResponse] = useState("");
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      const user_id =
        location.state?.user_id || localStorage.getItem("user_id");
      const { data: cvlink, error: cvlinkError } = await supabase
        .from("cv_upload")
        .select("cv_link")
        .eq("user_id", user_id)
        .single();

      if (cvlinkError) {
        setError(cvlinkError.message);
        setLoading(false);
        return;
      }
      const publicUrl = cvlink.cv_link;
      console.log("publicURL di Questions.jsx: ", { publicUrl });

      if (!user_id || !publicUrl) {
        setError("User ID or Public URL not found");
        setLoading(false);
        return;
      }
      console.log(JSON.stringify({ user_id: user_id, cv_link: publicUrl }));
      try {
        const response = await fetch("http://localhost:8000/process_cv/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user_id, cv_link: publicUrl }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();

        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
          const questionIndex = parseInt(id, 10) - 1;
          if (questionIndex >= 0 && questionIndex < data.questions.length) {
            setCurrentQuestion(data.questions[questionIndex]);
            setResponse(responses[id] || ""); // Set response to saved response or empty
          } else {
            setError("Invalid question ID");
          }
        } else {
          throw new Error("Invalid questions data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id, location.state]);

  const saveResponse = async (questionId, responseText) => {
    const user_id = location.state?.user_id || localStorage.getItem("user_id");

    try {
      const response = await fetch("http://localhost:8000/save_response/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          question_id: questionId,
          response: responseText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save response");
      }

      console.log("Response saved successfully");
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  const handleNext = async () => {
    await saveResponse(parseInt(id, 10), response);

    const nextId = parseInt(id, 10) + 1;
    if (nextId <= questions.length) {
      navigate(`/Questions/Questions/${nextId}`, {
        state: {
          user_id: location.state?.user_id,
          publicUrl: location.state?.publicUrl,
        },
      });
    } else {
      handleFinish();
    }
  };

  const handlePrevious = async () => {
    await saveResponse(parseInt(id, 10), response);

    const prevId = parseInt(id, 10) - 1;
    if (prevId >= 1) {
      navigate(`/Questions/Questions/${prevId}`, {
        state: {
          user_id: location.state?.user_id,
          publicUrl: location.state?.publicUrl,
        },
      });
    }
  };

  const handleFinish = async () => {
    await saveResponse(parseInt(id, 10), response);
    await saveAllResponses(responses);
    navigate("/Questions/EndQuestion");
  };

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
    setResponses({
      ...responses,
      [id]: e.target.value,
    });
  };

  const saveAllResponses = async (responses) => {
    const user_id = location.state?.user_id || localStorage.getItem("user_id");

    try {
      const response = await fetch("http://localhost:8000/save_responses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          responses: responses,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save all responses");
      }

      console.log("All responses saved successfully");
    } catch (error) {
      console.error("Error saving all responses:", error);
    }
  };

  if (loading) return <div className="text-center">Loading questions...</div>;
  if (error) return <div className="text-center text-red">{error}</div>;
  if (!currentQuestion) return null;

  return (
    <div className="container">
      <div className="card">
        <h2 className="question-title">
          {id}. {currentQuestion}
        </h2>
        <textarea
          placeholder="Your response..."
          value={response}
          onChange={handleResponseChange}
          className="textarea"
        />
        <div className="button-group">
          <button
            onClick={handlePrevious}
            disabled={id === "1"}
            className="button button-prev"
          >
            Previous
          </button>
          <button onClick={handleNext} className="button button-next">
            {id === questions.length.toString() ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
