"use client";
import { useState, useEffect } from "react";

const Explorer = () => {
  const [query, setQuery] = useState("");
  const [combinedResults, setCombinedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce state
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Update debounced query after 500ms
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch data when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) return;

    const fetchData = async () => {
      setLoading(true);
      setCombinedResults([]);
      setError("");

      try {
        const imgRes = await fetch(`/api/images?query=${encodeURIComponent(debouncedQuery)}`);
        const imgData = await imgRes.json();
        const images = imgData.collection?.items || [];

        const paperRes = await fetch(`/api/research?query=${encodeURIComponent(debouncedQuery)}`);
        const paperData = await paperRes.json();
        const papers = paperData.results || [];

        const combined = papers.map((paper, idx) => ({
          ...paper,
          image: images[idx % images.length]?.links?.[0]?.href || null,
        }));

        setCombinedResults(combined);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch NASA data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  return (
    <div className="w-full min-h-screen text-white p-8 ">
    

      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="🔍  Search NASA images & research..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xl text-2xl px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all duration-300"
        />
      </div>

      {loading && <p className="text-center text-gray-300">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {combinedResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combinedResults.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-xl h-96 shadow-lg transform hover:scale-105 transition-transform duration-300 overflow-hidden"
              >
                <div className="flex flex-col h-full overflow-auto scrollbar-hide">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title || "NASA Image"}
                      className="w-80 mx-auto mt-3 h-50 object-fill"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.title || "No title"}</h3>
                    <p className="text-sm mb-1 flex-0">
                      <strong>Authors:</strong>{" "}
                      {item.authors?.map((a) => a.name).join(", ") || "Unknown"}
                    </p>
                    <p className="text-sm mb-2 flex-0">
                      <strong>Published:</strong> {item.pub_date || "N/A"}
                    </p>
                    <p className="text-gray-300 mb-3 flex-1">{item.abstract || "No abstract available."}</p>
                    {item.pdf_url && (
                      <a
                        href={item.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline font-semibold mt-auto"
                      >
                        Read PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Explorer;
