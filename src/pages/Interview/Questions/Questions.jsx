import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Questions.css";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Ensure id is correctly retrieved from URL
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      // Retrieve user_id and publicUrl from location state or localStorage
      const user_id =
        location.state?.user_id || localStorage.getItem("user_id");
      const publicUrl =
        location.state?.publicUrl || localStorage.getItem("public_url");

      if (!user_id || !publicUrl) {
        setError("User ID or Public URL not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/process_cv/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user_id, public_url: publicUrl }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
          const questionIndex = parseInt(id, 10) - 1;
          console.log(`Question Index: ${questionIndex}`);
          if (questionIndex >= 0 && questionIndex < data.questions.length) {
            setCurrentQuestion(data.questions[questionIndex]);
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

  const saveResponse = async () => {
    const user_id = location.state?.user_id || localStorage.getItem("user_id");

    try {
      const response = await fetch("http://localhost:8000/save_response/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          responses: response,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save responses");
      }
      console.log("Responses saved succesfully");
    } catch (error) {
      console.log("Error saving responses:", error);
    }
  };
  const handleNext = () => {
    const nextId = parseInt(id, 10) + 1;
    if (nextId <= questions.length) {
      navigate(`/Questions/Questions/${nextId}`, {
        state: {
          user_id: location.state?.user_id,
          publicUrl: location.state?.publicUrl,
        },
      });
    } else {
      // navigate("/EndQuestion");
      handleFinish();
    }
  };

  const handlePrevious = () => {
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
    await saveResponse();
    navigate("/Questions/EndQuestion");
  };

  useEffect(() => {
    console.log(`ID from URL: ${id}`);
    if (questions.length > 0) {
      const questionIndex = parseInt(id, 10) - 1;
      console.log(`Question Index: ${questionIndex}`);
      if (questionIndex >= 0 && questionIndex < questions.length) {
        setCurrentQuestion(questions[questionIndex]);
      } else {
        setError("Invalid question ID");
      }
    }
  }, [id, questions]);

  if (loading) return <div className="text-center">Loading...</div>;
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
          onChange={(e) => setResponse(e.target.value)}
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
