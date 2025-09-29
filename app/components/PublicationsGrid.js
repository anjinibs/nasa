"use client";
import { useState, useEffect } from "react";
import PublicationCard from "./PublicationCard";
import Papa from "papaparse";

export default function PublicationsGrid() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const csvUrl =
          "https://raw.githubusercontent.com/jgalazka/SB_publications/main/SB_publication_PMC.csv";
        const res = await fetch(csvUrl);
        const text = await res.text();

        const parsed = Papa.parse(text, { header: true });
        const data = parsed.data
          .filter(row => row.title && row.link)
          .map(row => ({
            title: row.title.trim(),
            link: row.link.trim(),
          }));

        setPublications(data);
      } catch (err) {
        console.error("Error fetching CSV:", err);
      }
    };

    fetchCSV();
  }, []);

  return (
    <div className="w-full px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {publications.length === 0 ? (
          <p className="text-center text-gray-300 animate-pulse">Loading publications...</p>
        ) : (
          publications.map((pub, idx) => (
            <PublicationCard key={idx} publication={pub} />
          ))
        )}
      </div>
    </div>
  );
}
