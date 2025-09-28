"use client";

export default function TrendingTopics({ searchCounts = {}, onTopicSelect }) {
  const defaultTopics = [
    "Microgravity",
    "Gene Expression",
    "Spaceflight",
    "Bone Loss",
    "Drosophila",
    "Space Biology",
    "Drosophila melanogaster",
    "Molecular Adaptation",
    "Mouse Model",
    "Telemetry",
    "Behavioral Conditioning",
    "FoxO1",
    "Brown Adipose Tissue",
    "Thermogenesis",
    "Adipocyte Differentiation",
  ];

  // Create a unified set of topic names (lowercased) to avoid duplicates
  const topicNameSet = new Set(
    defaultTopics.map((t) => t.toLowerCase())
      .concat(Object.keys(searchCounts).map((k) => k.toLowerCase()))
  );

  // Build array of { name, count } with original casing if possible
  const topics = Array.from(topicNameSet).map((lowerName) => {
    // Try to find original-cased name from defaultTopics
    const original =
      defaultTopics.find((t) => t.toLowerCase() === lowerName) || lowerName;
    const cnt = searchCounts[lowerName] || 0;
    return { name: original, count: cnt };
  });

  // Sort descending by count
  topics.sort((a, b) => b.count - a.count);
 
  const maxCount = Math.max(...topics.map((t) => t.count), 1);

  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 rounded-lg shadow-lg mb-6">
      <h3 className="text-3xl font-semibold mb-4 text-center">Trending Topics</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {topics.map((topic, idx) => {
          const scale = topic.count / maxCount; // 0 to 1
          const size = 2 + scale * 2; // between 2 and 4
          const fontLevel = Math.min(Math.round(size), 4);
          

          return (
            <span
              key={idx}
              className={`inline-block px-4 py-2 rounded-full bg-indigo-800 text-white font-semibold cursor-pointer transition-transform transform hover:scale-110 text-xl`}
              onClick={() => onTopicSelect(topic.name)}
            >
              {topic.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
