"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PublicationCard from "./components/PublicationCard";
// import PublicationModal from "./components/PublicationDetailModal";
import TrendingTopics from "./components/TrendingTopics";
import DashboardPage from "./components/DashBoard";

export default function Home() {
  const [search, setSearch] = useState("");
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [searchCounts, setSearchCounts] = useState({}); // track counts of searches

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        setPublications(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching publications:", err);
      }
    };
    fetchPublications();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredPubs = publications.filter((pub) => {
      const title = pub.title || "";
      return title.toLowerCase().includes(lower);
    });
    setFiltered(filteredPubs);

    if (lower.trim() !== "") {
      setSearchCounts((prev) => ({
        ...prev,
        [lower]: (prev[lower] || 0) + 1,
      }));
    }
    setSelectedPublication(null);
  }, [search, publications]);

  // reset when changing tab
  useEffect(() => {
    setSelectedPublication(null);
  }, [active]);

  let content;
  if (active === "dashboard") {
    content = <DashboardContent />;
  } else if (active === "publications") {
    content = (
      <>
      <div class="text-center mt-5 text-purple-400"><h1 class="text-3xl md:text-4xl font-bold text-primary">Explore NASA Bioscience</h1><p class="mt-2 text-muted-foreground max-w-2xl mx-auto">An AI-powered dashboard to search, summarize, and understand decades of space biology research.</p></div>
        <div className="flex mb-8 justify-center">
          <input
            type="text"
            placeholder="🔍 Search publications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl text-2xl px-4 py-2 mt-15 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
          />
        </div>

        <TrendingTopics
          searchCounts={searchCounts}
          onTopicSelect={(topicName) => {
            setSearch(topicName);
          }}
        />
      

        <div className="grid grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <p className="text-center text-gray-300 animate-pulse">
              No results found.
            </p>
          )}
          {filtered.map((pub, idx) => (
            <PublicationCard
              key={idx}
              publication={pub}
              onClick={() => setSelectedPublication(pub)}
            />
          ))}
        </div>
      </>
    );
  } else if (active === "usecases") {
    content = <UseCasesContent />;
  } else if (active === "team") {
    content = <TeamContent />;
  } else if (active === "admin") {
    content = <AdminContent />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 font-sans">
      <Navbar active={active} setActive={setActive} />
      <div className="max-w-full mx-5">
        {content}
        <footer className="mt-5 text-center text-gray-400 text-sm">
          Powered by NASA Space Biology | Challenge Dashboard
        </footer>
      </div>

      {active === "publications" && selectedPublication && (
        <PublicationModal
          publication={selectedPublication}
          onClose={() => setSelectedPublication(null)}
        />
      )}
    </main>
  );
}

function DashboardContent() {
  return (<> 
  <DashboardPage/>
  </>
   
  );
}

function UseCasesContent() {
  return (
    <div className="text-white text-lg py-12">
      <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
      <ul className="list-disc ml-6">
        <li>Mission planning for Moon/Mars</li>
        <li>Identifying research gaps</li>
        <li>Supporting hypothesis generation</li>
        <li>Education and outreach</li>
      </ul>
    </div>
  );
}

function TeamContent() {
  return (
    <div className="text-white text-lg py-12">
      <h2 className="text-2xl font-bold mb-4">Team</h2>
      <p>Meet the Space Bio Engine team! Add your team info here.</p>
    </div>
  );
}

function AdminContent() {
  return (
    <div className="text-white text-lg py-12">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <p>Admin tools and settings will be available here.</p>
    </div>
  );
}
