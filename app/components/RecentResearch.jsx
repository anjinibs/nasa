'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecentResearch = () => {
  const [recentResearch, setRecentResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('added');
  const [aiSummary, setAiSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState([]);

  useEffect(() => {
    const fetchRecentResearch = async () => {
      try {
        const response = await fetch('/api/recent-research');
        if (!response.ok) {
          throw new Error('Failed to fetch recent research');
        }
        const data = await response.json();
        setRecentResearch(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentResearch();
  }, []);

  const handleCardClick = (title) => {
    toast.success(`You clicked on "${title}"`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleAIClick = async (e, link, title) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link, title }),
      });

      const data = await res.json();
      setAiSummary(data.aiSummary || 'No summary available.');
      setKeyPoints(data.keyPoints || []);
    } catch (err) {
      console.error(err);
      setAiSummary('Error generating summary.');
    }
  };

  if (loading) return <p className="text-gray-400">Loading recent research...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6">
      <ToastContainer />
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {activeTab === 'added' &&
          recentResearch.map((item) => (
            <div
              key={item._id}
              className="border border-gray-700 rounded-lg p-6 bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col justify-between shadow-lg"
              onClick={() => handleCardClick(item.title)}
            >
              <h3 className="text-xl font-semibold text-cyan-300">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
              <div className="flex space-x-4 justify-between mt-4">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item.title);
                  }}
                >
                  Read
                </a>
                <button
                  onClick={(e) => handleAIClick(e, item.link, item.title)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  🤖 AI Summary
                </button>
              </div>
            </div>
          ))}
      </div>

      {aiSummary && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div
            className="bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900 p-8 rounded-2xl max-w-xl w-full shadow-2xl border border-cyan-400"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl text-cyan-300 mb-4">AI Summary</h2>
            <p className="text-gray-200">{aiSummary}</p>
            {keyPoints.length > 0 && (
              <ul className="text-gray-200 list-disc ml-6 mt-2">
                {keyPoints.map((kp, i) => (
                  <li key={i}>{kp}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentResearch;
