import React, { useState } from "react";
import {
  Camera,
  Upload,
  Loader,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    font-weight: bold;
  }

  .header h1 {
    font-size: 2.25rem;
    font-weight: bold;
    color: #1f2937;
  }

  .header p {
    color: #4b5563;
  }

  .setup-section {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .setup-section h2 {
    font-size: 1.125rem;
    font-weight: bold;
    color: #1f2937;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .form-group input {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-group input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    border-color: #22c55e;
  }

  .help-text {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .help-text a {
    color: #22c55e;
    text-decoration: none;
  }

  .help-text a:hover {
    text-decoration: underline;
  }

  .btn {
    padding: 0.5rem 1rem;
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

  .btn-primary {
    width: 100%;
    background: #22c55e;
    color: white;
  }

  .btn-primary:hover {
    background: #16a34a;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary-gradient {
    width: 100%;
    background: linear-gradient(to right, #22c55e, #3b82f6);
    color: white;
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }

  .btn-primary-gradient:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .btn-secondary {
    width: 100%;
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .btn-secondary:hover {
    background: #f9fafb;
  }

  .btn-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.25rem;
    border-radius: 50%;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-close:hover {
    background: #dc2626;
  }

  .btn-link {
    background: none;
    border: none;
    color: #22c55e;
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .btn-link:hover {
    color: #16a34a;
  }

  .guide-box {
    background: #eff6ff;
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .guide-box p {
    font-size: 0.875rem;
    color: #0c2340;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .guide-box pre {
    font-size: 0.75rem;
    color: #075985;
    overflow-x: auto;
    white-space: pre-wrap;
  }

  .status-bar {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-icon {
    color: #16a34a;
  }

  .status-text {
    color: #047857;
    font-size: 0.875rem;
  }

  .upload-section {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 1.5rem;
  }

  .upload-label {
    display: block;
    margin-bottom: 1.5rem;
  }

  .upload-box {
    border: 2px dashed #bbf7d0;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .upload-box:hover {
    border-color: #22c55e;
  }

  .upload-box p {
    color: #374151;
    font-weight: 500;
  }

  .upload-box small {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .preview-container {
    position: relative;
    margin-bottom: 1rem;
  }

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
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
    flex-shrink: 0;
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

  .hidden {
    display: none;
  }

  @media (max-width: 640px) {
    .macro-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function NutrAI() {
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API;
  const backendUrl = import.meta.env.VITE_BACKEND_URI;

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
      setError("Please upload an image");
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

          

          {!showSetup && (
            <>
              {/* Image Upload Section */}
              <div className="upload-section">
                <label className="upload-label">
                  <div className="upload-box">
                    <Camera size={40} style={{ margin: "0 auto 0.5rem" }} />
                    <p>Click to upload photo</p>
                    <small>or drag and drop</small>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>

                {/* Image Preview */}
                {imageInput && (
                  <div className="preview-container">
                    <img
                      src={imageInput}
                      alt="Preview"
                      className="preview-image"
                    />
                    <button onClick={clearAll} className="btn-close">
                      <X size={20} />
                    </button>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={analyzeImage}
                  disabled={loading || !imageInput}
                  className="btn btn-primary-gradient"
                >
                  {loading ? (
                    <>
                      <Loader
                        size={20}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Analyze Nutrition
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <AlertCircle size={20} className="error-icon" />
                  <p className="error-text">{error}</p>
                  {console.log(error)}
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {nutritionData.summary}
                      </ReactMarkdown>
                    </div>
                  )}

                  <button
                    onClick={clearAll}
                    className="btn btn-secondary"
                    style={{ marginTop: "1.5rem" }}
                  >
                    Analyze Another Image
                  </button>
                </div>
              )}
            </>
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
