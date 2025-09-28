"use client";

import React, { useState, useEffect } from "react";

export default function PublicationCard({ publication }) {
  const [showAI, setShowAI] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAIClick = (e) => {
    e.stopPropagation(); // Prevents card click
    setShowAI(true);
    setShowModal(true);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setShowAI(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Click outside overlay to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
      setShowAI(false);
    }
  };

  return (
    <>
      <div
        className="relative border border-gray-700 rounded-lg p-6 bg-gradient-to-r from-gray-700 to-gray-800 cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col justify-around "
      >
        <h3 className="text-xl font-semibold text-white">{publication.title}</h3>
        <p className="text-gray-300 mt-2 mb-4 line-clamp-3">
          {publication.summary}
        </p>

        <div className="flex space-x-4 justify-between">
          <a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-800 text-white rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            Read more
          </a>

          <button
            onClick={handleAIClick}
            className="inline-block px-4 py-2 bg-blue-800 text-white rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            🤖 AI Summary
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex z-50 items-center justify-center backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900 border border-cyan-500/40 rounded-2xl shadow-2xl max-w-xl w-full relative p-8 mx-4 flex flex-col">
            <button
              onClick={() => {
                setShowModal(false);
                setShowAI(false);
              }}
              className="absolute top-4 right-4 text-cyan-300 hover:text-white text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-cyan-300 mb-4 tracking-tight">
              {publication.title}
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {publication.topics?.map((topic) => (
                <span
                  key={topic}
                  className="bg-cyan-700/80 text-white px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="mb-6 flex-1">
              <p className="text-gray-200 text-base">{publication.summary}</p>
            </div>

            <div className="mt-auto flex space-x-4">
              <a
                href={publication.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-purple-600 transition-all duration-300 font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                Read Publication
              </a>
            </div>

            {showAI && (
              <div className="mt-6 bg-black/30 rounded-xl p-4 border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-300 mb-2">AI Summary</h3>
                <p className="text-gray-200 mb-4">{publication.aiSummary}</p>
                <h4 className="text-lg font-semibold text-purple-300 mb-2">
                  Key Points
                </h4>
                <ul className="list-disc ml-6 text-gray-200">
                  {publication.keyPoints?.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
  