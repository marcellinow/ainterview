import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../backend/supabase";
import "./Interview.css";

const Interview = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  // Drag-and-drop functionality
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB.");
      return false;
    }
    return true;
  };

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setError(null);
      }
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    }
  };

  // Upload file to Supabase and insert into the database
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Check if the user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User is not authenticated. Please sign in.");
      }

      const userId = user.id; // Authenticated user ID
      const fileName = `${Date.now()}_${file.name}`; // Unique file name

      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("cvs_uploaded")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Generate the public URL for the file
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("cvs_uploaded")
        .getPublicUrl(fileName);

      if (urlError) {
        throw urlError;
      }

      const publicUrl = publicUrlData.publicUrl;
      console.log("publicURL di Interview.jsx: ", { publicUrl });

      // Insert the file link into the database
      const { data: insertedData, error: insertError } = await supabase
        .from("cv_upload")
        .insert([
          { user_id: userId, cv_link: publicUrl, created_at: new Date() },
        ])
        .select(); // Return the inserted row for further use

      if (insertError) {
        throw insertError;
      }

      const cvId = insertedData[0].cv_id; // Get the inserted `cv_id`
      console.log("CV ID:", cvId);

      setUploadComplete(true);

      // Navigate to the ChoosenCareer page and pass `user_id` and `cv_id`
      navigate("/ChoosenCareer", {
        state: { user_id: userId, cv_id: cvId },
      });
    } catch (error) {
      console.error("Upload error: ", error);
      setError(error.message || "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="interview-container">
      <div className="interview-card">
        <h1 className="interview-title">Interview</h1>
        <p className="interview-description">
          Upload your CV to initialize the interview process.
        </p>

        <div
          className={`upload-section ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            id="cv-upload"
            accept=".pdf,.doc,.docx"
            disabled={uploading}
          />
          <label htmlFor="cv-upload" className="file-label">
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <span className="upload-icon">📄</span>
                <span>Drag and drop your CV here or click to select</span>
                <span className="file-types">
                  Supports PDF, DOC, DOCX (max 5MB)
                </span>
              </>
            )}
          </label>
          {file && <p className="file-name">{file.name}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? "Processing..." : "Continue"}
        </button>

        {uploadComplete && (
          <p className="success-message">
            CV uploaded successfully! You can now proceed with the interview.
          </p>
        )}
      </div>
    </div>
  );
};

export default Interview;
