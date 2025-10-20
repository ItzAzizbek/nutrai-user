import React, { useState, useRef } from "react";

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }

  .container {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #f0fdf4, #f0f9ff);
    padding: 1rem;
  }

  .content-wrapper {
    max-width: 56rem;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
    padding-top: 1.5rem;
  }

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .icon-box {
    background: linear-gradient(to right, #22c55e, #3b82f6);
    padding: 0.75rem;
    border-radius: 0.5rem;
  }

  .icon-box span {
    color: white;
    font-size: 1.5rem;
  }

  .header h1 {
    font-size: 2.25rem;
    font-weight: bold;
    color: #1f2937;
  }

  .header p {
    color: #4b5563;
  }

  .upload-section {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 1.5rem;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    margin-bottom: 1.5rem;
  }

  .button-group button {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-take {
    background: #3b82f6;
    color: white;
  }

  .btn-take:hover {
    background: #2563eb;
  }

  .btn-upload {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .btn-upload:hover {
    background: #f9fafb;
  }

  .preview-container {
    position: relative;
    margin-bottom: 1rem;
  }

  .preview-image {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }

  .btn-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .btn-close:hover {
    background: #dc2626;
  }

  .btn-analyze {
    width: 100%;
    background: linear-gradient(to right, #22c55e, #3b82f6);
    color: white;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }

  .btn-analyze:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .btn-analyze:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .camera-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .camera-feed {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .camera-controls {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1.5rem;
    z-index: 1001;
  }

  .camera-btn {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .camera-btn-capture {
    background: #22c55e;
    color: white;
  }

  .camera-btn-capture:hover {
    background: #16a34a;
    transform: scale(1.1);
  }

  .camera-btn-close {
    background: #ef4444;
    color: white;
  }

  .camera-btn-close:hover {
    background: #dc2626;
  }

  .camera-btn-flip {
    background: #3b82f6;
    color: white;
  }

  .camera-btn-flip:hover {
    background: #2563eb;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.75rem;
  }

  .error-icon {
    color: #dc2626;
    font-size: 1.25rem;
  }

  .error-text {
    color: #b91c1c;
  }

  .results-section {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .results-section h2 {
    font-size: 1.875rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .nutrition-card {
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .calories-card {
    background: linear-gradient(to right, #fef3c7, #fecaca);
  }

  .calories-label {
    color: #4b5563;
    font-size: 0.875rem;
  }

  .calories-value {
    font-size: 1.875rem;
    font-weight: bold;
    color: #b45309;
  }

  .items-card {
    background: #eff6ff;
  }

  .items-card p {
    color: #374151;
  }

  .macro-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .macro-item {
    padding: 0.75rem;
    border-radius: 0.5rem;
  }

  .protein-card {
    background: #f3e8ff;
  }

  .protein-label {
    color: #4b5563;
    font-size: 0.75rem;
  }

  .protein-value {
    font-size: 1.25rem;
    font-weight: bold;
    color: #9333ea;
  }

  .carbs-card {
    background: #fef3c7;
  }

  .carbs-value {
    color: #b45309;
  }

  .fat-card {
    background: #fce7f3;
  }

  .fat-value {
    color: #be185d;
  }

  .fiber-card {
    background: #f0fdf4;
  }

  .fiber-value {
    color: #16a34a;
  }

  .vitamins-card {
    background: #e0e7ff;
  }

  .vitamins-card p {
    color: #1f2937;
    font-size: 0.875rem;
  }

  .summary-card {
    background: #f3f4f6;
  }

  .summary-card p {
    color: #374151;
    font-size: 0.875rem;
    white-space: pre-wrap;
    line-height: 1.5;
  }

  .btn-secondary {
    width: 100%;
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 0.5rem;
    margin-top: 1.5rem;
  }

  .btn-secondary:hover {
    background: #f9fafb;
  }

  @media (max-width: 640px) {
    .macro-grid {
      grid-template-columns: 1fr;
    }

    .button-group {
      flex-direction: column;
    }
  }
`;

export default function NutrAI() {
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");

  const apiKey = import.meta.env.VITE_GEMINI_API || "";
  const backendUrl = import.meta.env.VITE_BACKEND_URI || "";

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        setError("");
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL("image/jpeg");
      setImageInput(imageData);
      stopCamera();
    }
  };

  const flipCamera = async () => {
    stopCamera();
    const newFacingMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacingMode);
    setTimeout(() => {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: newFacingMode } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        });
    }, 100);
  };

  const analyzeImage = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Google AI API key");
      return;
    }

    if (!backendUrl.trim()) {
      setError("Please enter your backend URL");
      return;
    }

    if (!imageInput.trim()) {
      setError("Please take a photo");
      return;
    }

    setLoading(true);
    setError("");
    setNutritionData(null);

    try {
      const formData = new FormData();

      if (imageInput.startsWith("http")) {
        const response = await fetch(imageInput);
        const blob = await response.blob();
        formData.append("image", blob);
      } else if (imageInput.startsWith("data:")) {
        const parts = imageInput.split(",");
        const bstr = atob(parts[1]);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        const blob = new Blob([u8arr], { type: "image/jpeg" });
        formData.append("image", blob);
      }

      formData.append("apiKey", apiKey);

      const analysisResponse = await fetch(`${backendUrl}/analyze-food`, {
        method: "POST",
        body: formData,
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const result = await analysisResponse.json();
      setNutritionData(result);
    } catch (err) {
      setError(
        err.message ||
          "Failed to analyze image. Check your backend URL and API key."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageInput(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAll = () => {
    setImageInput("");
    setNutritionData(null);
    setError("");
  };

  if (showCamera) {
    return (
      <>
        <style>{styles}</style>
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-feed"
          ></video>
          <div className="camera-controls">
            <button
              onClick={flipCamera}
              className="camera-btn camera-btn-flip"
              title="Flip camera"
            >
              🔄
            </button>
            <button
              onClick={capturePhoto}
              className="camera-btn camera-btn-capture"
              title="Take photo"
            >
              📷
            </button>
            <button
              onClick={stopCamera}
              className="camera-btn camera-btn-close"
              title="Close camera"
            >
              ✕
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="content-wrapper">
          {/* Header */}
          <div className="header">
            <div className="header-icon">
              <div className="icon-box">
                <span>🥗</span>
              </div>
              <h1>Nutr AI</h1>
            </div>
            <p>Analyze food nutrition from pictures instantly</p>
          </div>

          {/* Image Capture Section */}
          <div className="upload-section">
            {!imageInput && (
              <button
                onClick={startCamera}
                className="btn-analyze"
                style={{ width: "100%", marginTop: 0 }}
              >
                📷 Take Photo
              </button>
            )}

            {/* Image Preview */}
            {imageInput && (
              <div className="preview-container">
                <img
                  src={imageInput}
                  alt="Preview"
                  className="preview-image"
                />
                <button onClick={clearAll} className="btn-close">
                  ✕
                </button>
              </div>
            )}

            {/* Analyze Button */}
            {imageInput && (
              <button
                onClick={analyzeImage}
                disabled={loading}
                className="btn-analyze"
              >
                {loading ? "⏳ Analyzing..." : "Analyze Nutrition"}
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p className="error-text">{error}</p>
            </div>
          )}

          {/* Nutrition Results */}
          {nutritionData && (
            <div className="results-section">
              <h2>Nutrition Analysis</h2>

              {nutritionData.calories && (
                <div className="nutrition-card calories-card">
                  <p className="calories-label">Estimated Calories</p>
                  <p className="calories-value">{nutritionData.calories}</p>
                </div>
              )}

              {nutritionData.items && (
                <div className="nutrition-card items-card">
                  <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    Food Items
                  </p>
                  <p>{nutritionData.items}</p>
                </div>
              )}

              {nutritionData.protein && (
                <div className="macro-grid">
                  <div className="macro-item protein-card">
                    <p className="protein-label">Protein</p>
                    <p className="protein-value">
                      {nutritionData.protein}g
                    </p>
                  </div>
                  <div className="macro-item carbs-card">
                    <p className="protein-label">Carbs</p>
                    <p className="protein-value carbs-value">
                      {nutritionData.carbs}g
                    </p>
                  </div>
                  <div className="macro-item fat-card">
                    <p className="protein-label">Fat</p>
                    <p className="protein-value fat-value">
                      {nutritionData.fat}g
                    </p>
                  </div>
                  <div className="macro-item fiber-card">
                    <p className="protein-label">Fiber</p>
                    <p className="protein-value fiber-value">
                      {nutritionData.fiber}g
                    </p>
                  </div>
                </div>
              )}

              {nutritionData.vitamins && (
                <div className="nutrition-card vitamins-card">
                  <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    Vitamins & Minerals
                  </p>
                  <p>{nutritionData.vitamins}</p>
                </div>
              )}

              {nutritionData.summary && (
                <div className="nutrition-card summary-card">
                  <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                    Analysis
                  </p>
                  <p>{nutritionData.summary}</p>
                </div>
              )}

              <button
                onClick={clearAll}
                className="btn-secondary"
              >
                Analyze Another Image
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}