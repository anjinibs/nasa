'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecentResearch = () => {
  const [recentResearch, setRecentResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchRecentResearch = async () => {
      try {
        const response = await fetch('/api/recent-research');
        if (!response.ok) throw new Error('Failed to fetch recent research');
        const data = await response.json();
        setRecentResearch(data.research || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentResearch();
  }, []);

  const handleCardClick = (title) => {
    toast.success(`You clicked on "${title}"`, { autoClose: 3000 });
  };

  const handleAIClick = async (e, item) => {
    e.stopPropagation();
    setLoadingSummary(true);
    setAiSummary('');
    setKeyPoints([]);
    setSelectedItem(item);

    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: item.link, title: item.title }),
      });
      const data = await res.json();
      setAiSummary(data.aiSummary || 'No summary available.');
      setKeyPoints(data.keyPoints || []);
    } catch (err) {
      console.error(err);
      setAiSummary('Error generating summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const closeAISummary = () => {
    setAiSummary('');
    setKeyPoints([]);
    setSelectedItem(null);
    setLoadingSummary(false);
  };

  if (loading) return <p className="text-gray-400">Loading recent research...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className=" shadow-lg rounded-lg p-6 relative">
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentResearch.map((item) => (
          <div
            key={item._id}
            className="border border-gray-700 rounded-lg p-6 bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col justify-between shadow-lg"
            onClick={() => handleCardClick(item.title)}
          >
            <h3 className="text-xl font-semibold text-cyan-300">{item.title}</h3>
            {item.description && <p className="text-gray-400">{item.description}</p>}
            <div className="flex space-x-4 justify-between mt-4">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                Read
              </a>
              <button
                onClick={(e) => handleAIClick(e, item)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                🤖 AI Summary
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Summary Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
          onClick={closeAISummary}
        >
          <div
            className="bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900 p-6 rounded-2xl max-w-xl w-full shadow-2xl border border-cyan-400 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl text-cyan-300">{selectedItem.title}</h2>
              <button
                onClick={closeAISummary}
                className="text-gray-300 hover:text-white font-bold text-xl"
              >
                ✖
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {loadingSummary ? (
                <p className="text-gray-200 text-lg animate-pulse">Generating summary...</p>
              ) : (
                <>
                  <h3 className="text-3xl text-green-300 font-semibold mb-2 text-start">Summary</h3>
                  <p className="text-gray-200">{aiSummary}</p>

                  {keyPoints.length > 0 && (
                    <>
                      <h3 className="text-3xl text-green-300 font-semibold mb-2 text-start">Key Points</h3>
                      <ul className="text-gray-200 list-disc ml-6 mt-2">
                        {keyPoints.map((kp, i) => (
                          <li key={i}>{kp}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Fixed Button */}
            <div className="mt-4 flex justify-end">
              <a
                href={selectedItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
              >
                Read Publication
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentResearch;
