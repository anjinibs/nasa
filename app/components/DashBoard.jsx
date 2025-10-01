"use client";
import React, { useState, useEffect } from "react";
import PublicationCard from "./PublicationCard";
import AddResearchModal from "./AddResearchModal";
import RecentResearch from "./RecentResearch";

export default function DashboardPage({ publications}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [recentPublications, setRecentPublications] = useState([]);
  const [show, setShow] = useState(false);
  const [activeView, setActiveView] = useState('opened');

  // Load recent publications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentPublications");
    if (stored) setRecentPublications(JSON.parse(stored));
  }, []);

  // Apply search + filter
  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || pub.category === filter)
  );

  const categories = ["All", ...new Set(publications.map((p) => p.category))];

  // Function to update recent publications dynamically
  const addToRecent = (pub) => {
    setRecentPublications((prev) => {
      const updated = [pub, ...prev.filter((p) => p.link !== pub.link)].slice(0, 10);
      localStorage.setItem("recentPublications", JSON.stringify(updated));
      return updated;
    });
  };

  function publicationlength(){
    publications.length=publications.length+1
  }

  return (
    <div className="min-h-screen  text-white p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">Research Dashboard</h1>
        <button
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          onClick={() => setShow(true)}
        >
          ADD Research
        </button>
      </div>
      <AddResearchModal show={show} onClose={() => setShow(false)} publicationlength={publicationlength} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-purple-700 to-blue-700 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white">Total Publications</h2>
          <p className="text-cyan-300 text-3xl mt-2">{publications.length}</p>
        </div>
        
      </div>

      {/* Recently Opened / Added Toggle */}
      <div className="mb-10">
        <div className="flex border-b border-gray-700 mb-4">
          <button
            className={`px-4 py-2 text-lg font-medium ${activeView === 'opened' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveView('opened')}
          >
            Recently Opened
          </button>
          <button
            className={`px-4 py-2 text-lg font-medium ${activeView === 'added' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveView('added')}
          >
            Recently Added
          </button>
        </div>

        {activeView === 'opened' && (
          <div>
            {recentPublications.length === 0 ? (
              <p className="text-gray-400">No recent publications.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recentPublications.map((pub, i) => (
                  <div key={i} className="flex justify-center">
                    <PublicationCard
                      publication={pub}
                      onClick={(clickedPub) => addToRecent(clickedPub)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'added' && <RecentResearch  />}
      </div>
    </div>
  );
}
