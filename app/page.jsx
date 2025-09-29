"use client";
import Explorer from "./components/Explorer";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PublicationCard from "./components/PublicationCard";
import TrendingTopics from "./components/TrendingTopics";
import DashboardPage from "./components/DashBoard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard"); // main navbar tab
  const [isResearchPage, setIsResearchPage] = useState(false); // false = Bioscience, true = Research

  // Existing Bioscience page state
  const [search, setSearch] = useState("");
  const [publications, setPublications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchCounts, setSearchCounts] = useState({});
  const [selectedPublication, setSelectedPublication] = useState(null);

  // Load local JSON or API data
  useEffect(() => {
    const fetchLocal = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        setPublications(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching publications:", err);
      }
    };
    fetchLocal();
  }, []);

  // Filter publications based on search
  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredPubs = publications.filter((pub) =>
      pub.title?.toLowerCase().includes(lower)
    );
    setFiltered(filteredPubs);

    if (lower.trim() !== "") {
      setSearchCounts((prev) => ({
        ...prev,
        [lower]: (prev[lower] || 0) + 1,
      }));
    }
    setSelectedPublication(null);
  }, [search, publications]);

  // Reset selected publication on tab change
  useEffect(() => {
    setSelectedPublication(null);
  }, [activeTab]);

  // Render content based on active tab
  let content;
  if (activeTab === "dashboard") {
    content = <DashboardPage />;
  } else if (activeTab === "publications") {
    content = (
      <div className="relative text-center">
        {/* Toggle button on top-right */}
        <button
          onClick={() => setIsResearchPage(!isResearchPage)}
          className="absolute right-5 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-800 transition-colors"
        >
          {isResearchPage ? "Go to Bioscience" : "Go to Explorer "}
        </button>

        {/* Page content */}
        {isResearchPage ? (
          <ResearchPage />
        ) : (
          <BiosciencePage
            search={search}
            setSearch={setSearch}
            filtered={filtered}
            searchCounts={searchCounts}
            setSelectedPublication={setSelectedPublication}
          />
        )}
      </div>
    );
  } else if (activeTab === "usecases") {
    content = <UseCasesContent />;
  } else if (activeTab === "team") {
    content = <TeamContent />;
  } else if (activeTab === "admin") {
    content = <AdminContent />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 font-sans">
      <Navbar active={activeTab} setActive={setActiveTab} />
      <div className="max-w-full mx-5">{content}</div>
      <footer className="mt-5 text-center text-gray-400 fixed bottom-0 bg-gray-900/95 w-full p-3  text-sm">
        Powered by NASA Space Biology | Challenge Dashboard
      </footer>
    </main>
  );
}

// ------------------ Empty NASA Research Page ------------------
function ResearchPage() {
  return (
    <div className="mt-10 text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-primary">
        NASA Research Explore
      </h1>
      <p className="mt-2 text-muted-foreground w-full mx-auto">
        {/* Add your NASA Research content here */}
        <Explorer/>
      </p>
    </div>
  );
}

// ------------------ Existing NASA Bioscience Page ------------------
function BiosciencePage({ search, setSearch, filtered, searchCounts, setSelectedPublication }) {
  return (
    <div className="mt-10 text-center text-purple-400">
      <h1 className="text-3xl md:text-4xl font-bold text-primary">
        Explore NASA Bioscience
      </h1>
      <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
        An AI-powered dashboard to search, summarize, and understand decades of space biology research.
      </p>

      <div className="flex mb-8 justify-center mt-5">
        <input
          type="text"
          placeholder="🔍 Search publications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl text-2xl px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
        />
      </div>

      <TrendingTopics
        searchCounts={searchCounts}
        onTopicSelect={(topic) => setSearch(topic)}
      />

      <div className="grid grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-300 animate-pulse">No results found.</p>
        ) : (
          filtered.map((pub, idx) => (
            <PublicationCard
              key={idx}
              publication={pub}
              onClick={() => setSelectedPublication(pub)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ------------------ Other Sections ------------------
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
