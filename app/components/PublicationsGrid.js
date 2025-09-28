"use client";

import { useState } from "react";
import PublicationCard from "./PublicationCard";
import PublicationDetailModal from "./PublicationDetailModal";

const publications = [
  {
    title: 'High-precision method for cyclic loading of small-animal vertebrae to assess bone quality.',
    summary:
      'This method enables accurate cyclic loading of vertebrae in small animals, allowing researchers to assess bone quality and mechanical properties under controlled conditions.',
    link: 'https://www.example.com/publication/bone-quality',
    topics: ['Bone Quality', 'Cyclic Loading', 'Small Animal'],
    aiSummary: 'AI summary for cyclic loading study ...',
    keyPoints: ['Point A', 'Point B'],
  },
  {
    title: 'TNO1 is involved in salt tolerance and vacuolar trafficking in Arabidopsis.',
    summary:
      'This research uncovers the role of TNO1 in regulating salt tolerance and vacuolar trafficking, providing new insights into plant stress responses.',
    link: 'https://www.example.com/publication/tno1-arabidopsis',
    topics: ['Salt Tolerance', 'Vacuolar Trafficking', 'Arabidopsis'],
    aiSummary: 'AI summary for TNO1 …',
    keyPoints: ['Key A', 'Key B'],
  },
  {
    title: 'Effects of Microgravity on Bone Density in Astronauts',
    summary:
      'This study explores how extended exposure to microgravity impacts bone density in astronauts, highlighting key findings and recommendations for future missions.',
    link: 'https://www.example.com/publication/space-bone-density',
    topics: ['Microgravity', 'Bone Density', 'Space Health'],
    aiSummary: 'AI Summary: Microgravity significantly reduces bone density in astronauts …',
    keyPoints: ['Microgravity causes bone loss', 'Risk of osteoporosis', 'Countermeasures important'],
  },
];

export default function PublicationsGrid() {
  const [selectedIdx, setSelectedIdx] = useState(null);

  return (
    <div className="w-full px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {publications.map((pub, idx) => (
          <PublicationCard
            key={idx}
            publication={pub}
            onClick={() => setSelectedIdx(idx)}
          />
        ))}
      </div>

      {selectedIdx !== null && (
        <PublicationDetailModal
          publication={publications[selectedIdx]}
          onClose={() => setSelectedIdx(null)}
        />
      )}
    </div>
  );
}
