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
    if (onClick) onClick(publication);
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
        className="border border-gray-700 rounded-lg p-6 bg-gradient-to-r from-gray-700 to-gray-800 cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col justify-between"
      >
        <h3 className="text-xl font-semibold text-white">{publication.title}</h3>
        <div className="flex space-x-4 justify-between mt-4">
          <a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-800 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              addToRecentStorage(publication); // update recently opened
              if (onClick) onClick(publication);
            }}
          >
            Read
          </a>
          <button
            onClick={handleAIClick}
            className="px-4 py-2 bg-blue-800 text-white rounded-full"
          >
            🤖 AI Summary
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900 p-8 rounded-2xl max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl text-cyan-300 mb-4">{publication.title}</h2>
            {loadingAI ? (
              <p className="text-gray-400 animate-pulse">Generating summary...</p>
            ) : (
              <>
                <p className="text-gray-200">{aiSummary}</p>
                {keyPoints.length > 0 && (
                  <ul className="text-gray-200 list-disc ml-6 mt-2">
                    {keyPoints.map((kp, i) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
