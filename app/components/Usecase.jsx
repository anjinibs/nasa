// pages/usecases.js
"use client";

import { useState } from "react";
import { FaRocket, FaBrain, FaUsers, FaChalkboardTeacher } from "react-icons/fa";

export default function UseCasesPage() {
  const [activeCategory, setActiveCategory] = useState("missionPlanning");

  const useCases = {
    missionPlanning: {
      title: "Mission Planning for Moon/Mars",
      description:
        "Utilize the knowledge engine to design and simulate biological experiments for long-duration space missions, ensuring astronaut health and mission success.",
      icon: <FaRocket size={40} className="text-blue-500" />,
    },
    researchGaps: {
      title: "Identifying Research Gaps",
      description:
        "Analyze existing space biology literature to pinpoint areas lacking comprehensive studies, guiding future research priorities.",
      icon: <FaBrain size={40} className="text-green-500" />,
    },
    hypothesisGeneration: {
      title: "Supporting Hypothesis Generation",
      description:
        "Leverage AI-driven insights to formulate new hypotheses in space biology, accelerating discovery and innovation.",
      icon: <FaUsers size={40} className="text-yellow-500" />,
    },
    educationOutreach: {
      title: "Education and Outreach",
      description:
        "Provide educational resources and interactive tools to engage the public and students in space biology, fostering interest and understanding.",
      icon: <FaChalkboardTeacher size={40} className="text-red-500" />,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-cyan-400 mb-4">Use Cases</h1>
        <p className="text-xl text-gray-300 mb-2">Leveraging Space Biology Knowledge Engine</p>
        <p className="text-lg text-gray-400 mb-6">Explore how our platform supports various applications in space biology.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          {Object.keys(useCases).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                activeCategory === key
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-cyan-600"
              } transition-colors duration-300`}
            >
              {useCases[key].title}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div>{useCases[activeCategory].icon}</div>
          <h2 className="text-3xl font-semibold text-cyan-300">{useCases[activeCategory].title}</h2>
        </div>
        <p className="text-lg text-gray-100">{useCases[activeCategory].description}</p>
      </div>
    </div>
  );
}
