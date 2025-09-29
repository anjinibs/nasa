"use client";
import React, { useState, useEffect } from "react";
import PublicationCard from "./PublicationCard";

export default function DashboardPage({ publications }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [recentPublications, setRecentPublications] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-cyan-400">Research Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-purple-700 to-blue-700 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white">Total Publications</h2>
          <p className="text-cyan-300 text-3xl mt-2">{publications.length}</p>
        </div>
        <div className="bg-gradient-to-r from-teal-700 to-cyan-700 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white">Filtered</h2>
          <p className="text-cyan-300 text-3xl mt-2">{filteredPublications.length}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-700 to-red-700 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white">Categories</h2>
          <p className="text-cyan-300 text-3xl mt-2">{categories.length - 1}</p>
        </div>
      </div>

      {/* Recently Opened Publications */}
      <h2 className="text-2xl font-bold mb-4 text-cyan-300">Recently Opened</h2>
      {recentPublications.length === 0 ? (
        <p className="text-gray-400">No recent publications.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPublications.map((pub, i) => (
            <PublicationCard
              key={i}
              publication={pub}
              onClick={(clickedPub) => addToRecent(clickedPub)} // pass the publication clicked
            />
          ))}
        </div>
      )}
    </div>
  );
}
