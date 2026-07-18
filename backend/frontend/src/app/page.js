"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  // Fallback backend URL for local testing. 
  // When deploying, your frontend developer will swap this with your live Render/HuggingFace URL.
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setReport(null); // Clear previous reports
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/diagnose`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Diagnostic failed");

      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      alert("Error processing X-Ray. Ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar Layout */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span>🩺</span> MedVision AI
        </h1>
        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200">
          Orthopedic Decision Support Platform
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control / Image Upload Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upload X-Ray Image</h2>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50">
                <span className="text-3xl mb-2">📁</span>
                <span className="text-sm text-slate-600 font-medium">Click to select digital X-ray</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {previewUrl && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500 font-medium mb-1">File Preview:</p>
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                </div>
              )}

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Analyzing Engine Running..." : "Run Intelligent Analysis"}
              </button>
            </form>
          </div>

          {/* Visualization Block */}
          {report && report.fracture_detected && report.heatmap_url && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
              <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-3">
                Grad-CAM Explainability Map
              </h3>
              <div className="relative rounded-xl overflow-hidden border">
                <img 
                  src={`${BACKEND_URL}${report.heatmap_url}`} 
                  alt="Grad-CAM Heatmap" 
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 italic">
                *The glowing regions highlight where the vision framework identified structural disruption.
              </p>
            </div>
          )}
        </div>

        {/* Right Diagnosis & Gemini Advisory Panel */}
        <div className="lg:col-span-7">
          {report ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 animate-fade-in">
              
              {/* Top Summary Badges */}
              <div className="border-b pb-4 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    System Diagnostic
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${report.fracture_detected ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                    <h3 className="text-xl font-bold">
                      {report.fracture_detected ? report.fracture_type : "No Fracture Found"}
                    </h3>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Model Certainty
                  </span>
                  <span className="text-lg font-black text-blue-600">
                    {((report.classification_confidence || report.confidence) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Gemini Agent AI Prompt Output */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Clinical Companion Advice (Gemini Agent)
                </h4>
                {/* Preformatted style preserves the clear structural markdown headings cleanly */}
                <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100 text-sm">
                  {report.gemini_advice}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed border-slate-300 bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 shadow-inner">
              <span className="text-4xl mb-3">📊</span>
              <p className="font-medium text-slate-500">Awaiting Preliminary Screening Data</p>
              <p className="text-xs max-w-xs mt-1">
                Upload an orthopedic X-ray scan on the left to review metrics and automated AI insights[cite: 1].
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}