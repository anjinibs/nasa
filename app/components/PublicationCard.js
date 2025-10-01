"use client";
import React, { useState } from "react";

export default function PublicationCard({ publication, onClick }) {
  const [showModal, setShowModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState([]);

  // Handle AI Summary modal
  const handleAIClick = async (e) => {
    e.stopPropagation();
    setShowModal(true);
    setLoadingAI(true);

    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: publication.link, title: publication.title }),
      });

      const data = await res.json();
      console.log(data)
      setAiSummary(data.aiSummary || "No summary available.");
      setKeyPoints(data.keyPoints || []);
    } catch (err) {
      console.error(err);
      setAiSummary("Error generating summary.");
    } finally {
      setLoadingAI(false);
    }

    // Count as recently opened when opening AI modal
    addToRecentStorage(publication);
  };

  // Handle card click
  const handleCardClick = () => {
    addToRecentStorage(publication);
    if (onClick) onClick(publication);
  };

  // Add to localStorage for Recently Opened
  const addToRecentStorage = (pub) => {
    const stored = JSON.parse(localStorage.getItem("recentPublications") || "[]");
    const updated = [pub, ...stored.filter(p => p.link !== pub.link)].slice(0, 10);
    localStorage.setItem("recentPublications", JSON.stringify(updated));
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="border border-gray-700 rounded-lg p-6 bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col justify-between shadow-lg"
      >
        <h3 className="text-xl font-semibold text-cyan-300">{publication.title}</h3>
        <div className="flex space-x-4 justify-between mt-4">
          <a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              addToRecentStorage(publication); // update recently opened
            }}
          >
            Read
          </a>
          <button
            onClick={handleAIClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            🤖 AI Summary
          </button>
        </div>
      </div>

{showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900 p-6 rounded-2xl w-full max-w-2xl shadow-2xl border border-cyan-400 transform transition-all duration-300 scale-100 sm:scale-95"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-4xl font-bold  text-gray-100 hover:text-red-700"
        onClick={() => setShowModal(false)}
        aria-label="Close"
      >
        ×
      </button>

      <h2 className="text-2xl font-semibold text-cyan-300 mb-4">{publication.title}</h2>

      <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
        {loadingAI ? (
          <p className="text-gray-400 animate-pulse">Generating summary...</p>
        ) : (
          <>
            <section className="mb-4">
              <h3 className="text-4xl text-green-300 font-semibold mb-2 text-start">Summary</h3>
              <p className="text-gray-200 leading-relaxed whitespace-pre-line text-start">
                {aiSummary}
              </p>
            </section>

            {keyPoints.length > 0 && (
              <section>
                <h4 className="text-3xl text-green-300 font-semibold mb-2 text-start">Key Points</h4>
                <ul className="text-gray-200 list-disc list-inside space-y-1 text-start">
                  {keyPoints.map((kp, i) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>

      {/* Read button aligned to the right */}
      <div className="flex justify-end mt-4">
        <a
          href={publication.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            addToRecentStorage(publication); // update recently opened
          }}
        >
          Read  Publication
        </a>
      </div>
    </div>
  </div>
)}


    </>
  );
}
