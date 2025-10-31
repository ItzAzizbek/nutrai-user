import React, { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  Loader,
  AlertCircle,
  LogOut,
  User,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AzizbekID from "azizbekid";

export default function NutrAI() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState("");
  const [initError, setInitError] = useState("");

  const apiKey = import.meta.env.VITE_GEMINI_API;
  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const idBackend = "https://azizbekid-backend.vercel.app";

  // Initialize AzizbekID once on mount
  useEffect(() => {
    try {
      console.log("Initializing AzizbekID with backend:", idBackend);
      AzizbekID.init({
        backendUrl: idBackend,
        appOrigin: window.location.origin,
        appName: "NutrAI",
      });
      console.log("✓ AzizbekID initialized successfully");
    } catch (err) {
      console.error("✗ Failed to initialize AzizbekID:", err);
      setInitError("Failed to initialize authentication. Check console for details.");
    }
  }, []); // Empty dependency array - only runs once

  const handleLogin = async () => {
    if (initError) {
      setError("Authentication system not ready. Please refresh the page.");
      return;
    }

    setLoadingAuth(true);
    setError("");

    try {
      console.log("Starting sign in...");
      const userData = await AzizbekID.signIn();

      if (userData) {
        console.log("✓ Successfully signed in:", userData);
        setUser(userData);
      } else {
        throw new Error("No user data returned from sign in");
      }
    } catch (err) {
      console.error("✗ Sign in failed:", err);
      setError(
        err.message || 
        "Failed to sign in. Make sure popups are allowed and try again."
      );
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setImageInput("");
    setNutritionData(null);
    setError("");
  };

  const analyzeImage = async () => {
    if (!apiKey?.trim()) {
      setError("Please configure your Google AI API key (VITE_GEMINI_API)");
      return;
    }

    if (!backendUrl?.trim()) {
      setError("Please configure your backend URL (VITE_BACKEND_URI)");
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

      if (imageInput.startsWith("data:")) {
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

      const response = await fetch(`${backendUrl}/analyze-food`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Analysis failed with status ${response.status}`
        );
      }

      const result = await response.json();
      setNutritionData(result);
    } catch (err) {
      console.error("✗ Analysis error:", err);
      setError(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageInput(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearAll = () => {
    setImageInput("");
    setNutritionData(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {user && (
        <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
              <User size={16} />
              {user.name}
            </div>
            <span className="text-gray-600 text-sm">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded">
              🥗
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Nutr AI</h1>
          </div>
          <p className="text-gray-600">Analyze food nutrition from pictures instantly</p>
        </div>

        {!user ? (
          <div className="bg-white rounded-lg shadow-lg p-12 max-w-sm mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Sign in with AzizbekID to start analyzing your food's nutrition content.
            </p>

            {initError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded p-3 flex gap-2">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{initError}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loadingAuth || !!initError}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-lg text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loadingAuth ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <User size={20} />
                  Sign In with AzizbekID
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded p-3 flex gap-2">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 text-xs text-gray-500 border-t pt-4 text-left">
              <p className="font-semibold mb-2">Troubleshooting:</p>
              <ul className="space-y-1">
                <li>• Check browser console (F12) for errors</li>
                <li>• Allow popups for this site</li>
                <li>• Verify AzizbekID backend is accessible</li>
                <li>• Clear cache and reload the page</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <label>
                <div className="border-2 border-dashed border-green-300 hover:border-green-500 rounded-lg p-8 text-center cursor-pointer transition">
                  <Camera size={40} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-700 font-medium">Click to upload photo</p>
                  <small className="text-gray-500">or drag and drop</small>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imageInput && (
                <div className="relative mt-4">
                  <img
                    src={imageInput}
                    alt="Preview"
                    className="w-full rounded-lg max-h-96 object-cover"
                  />
                  <button
                    onClick={clearAll}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <button
                onClick={analyzeImage}
                disabled={loading || !imageInput}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-lg text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 flex gap-2">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {nutritionData && (
              <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Nutrition Analysis
                </h2>

                {nutritionData.calories && (
                  <div className="bg-gradient-to-r from-yellow-200 to-red-200 p-4 rounded">
                    <p className="text-gray-600 text-sm">Estimated Calories</p>
                    <p className="text-3xl font-bold text-yellow-800">
                      {nutritionData.calories}
                    </p>
                  </div>
                )}

                {nutritionData.items && (
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="font-bold mb-2">Food Items</p>
                    <p className="text-gray-700">{nutritionData.items}</p>
                  </div>
                )}

                {nutritionData.protein && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Protein</p>
                      <p className="text-xl font-bold text-purple-700">
                        {nutritionData.protein}g
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Carbs</p>
                      <p className="text-xl font-bold text-yellow-700">
                        {nutritionData.carbs}g
                      </p>
                    </div>
                    <div className="bg-pink-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Fat</p>
                      <p className="text-xl font-bold text-pink-700">
                        {nutritionData.fat}g
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded">
                      <p className="text-sm text-gray-600">Fiber</p>
                      <p className="text-xl font-bold text-green-700">
                        {nutritionData.fiber}g
                      </p>
                    </div>
                  </div>
                )}

                {nutritionData.vitamins && (
                  <div className="bg-indigo-50 p-4 rounded">
                    <p className="font-bold mb-2">Vitamins & Minerals</p>
                    <p className="text-gray-700 text-sm">
                      {nutritionData.vitamins}
                    </p>
                  </div>
                )}

                {nutritionData.summary && (
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="font-bold mb-2">Analysis</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {nutritionData.summary}
                    </ReactMarkdown>
                  </div>
                )}

                <button
                  onClick={clearAll}
                  className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition"
                >
                  Analyze Another Image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}