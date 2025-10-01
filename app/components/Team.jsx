// pages/team.js
export default function Team() {
  return (
    <div className=" text-white min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 ">
                    <div className="text-4x">Powered by ANUSH SHETTY </div>

        <h1 className="text-5xl font-extrabold text-cyan-400 mb-4 Z-20">Byte Techy</h1>
        <p className="text-xl text-gray-300 mb-2 Z-20">2025 NASA Space Apps Challenge</p>
        <p className="text-lg text-gray-400 mb-6 Z-20">Challenge: Build a Space Biology Knowledge Engine</p>
        <p className="text-md text-gray-400 mb-8 Z-20">Location: JNNCE,Shimoga-577204 <br /> India</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: "Anjini B.S",
            username: "@a____bs001",
            role: "Team Owner",
            description: "Anjini is a passionate software developer with a keen interest in space technology. She leads the team with a vision to revolutionize space biology knowledge sharing.",
            image: "anjini.jpeg",
            skills: ["Leadership", "Project Management", "AI Integration",]
          },
          {
            name: "Vaishnavi K.",
            username: "@vaishnavi1208",
            role: "Web Developer",
            description: "Vaishnavi is an Electronics and Communication Engineering student at JNNCE, Shivamogga. She is an IEEE student member and intern at NITK Surathkal.",
            image: "image.png",
            skills: ["HTML", "CSS", "JavaScript", "Responsive Design"]
          },
          {
            name: "Ranjitha S",
            username: "@ranj1tha",
            role: "Front-End Developer",
            description: "Ranjitha is a Computer Science and Engineering student at JNNCE, Shivamogga, with a focus on cryptography and cybersecurity.",
            image: "image.png",
            skills: ["React", "Next.j",]
          },
          {
            name: "Ganavi C.",
            username: "@ganavic16",
            role: "Back-End Developer",
            description: "Ganavi is a student at JNNCE, Shivamogga, currently working on projects like Random Password Generator and YouTube Video Downloader.",
            image: "image.png",
            skills: ["Node.js", "Express", "MongoDB", "API Development"]
          },
          {
            name: "Eshwara D",
            username: "@eshwar001",
            role: "AI/ML Specialist",
            description: "Eshwara is an aspiring software engineer with a passion for space exploration and data analysis.",
            image: "image.png",
            skills: ["Python", "TensorFlow", "Machine Learning", "Data Analysis"]
          },
          {
            name: "AMULYA",
            username: "@amulya06025",
            role: "IoT Developer",
            description: "AMULYA is a student at JNNCE, Shivamogga, working on IoT-based projects like Drip Irrigation Systems.",
            image: "image.png",
            skills: ["Arduino", "Raspberry Pi", "IoT Protocols", "Sensor Integration"]
          }
        ].map((member, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg shadow-lg p-6 hover:scale-105 transform transition-all duration-300"
          >
            <img
              src={`./${member.image}`}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-2xl font-semibold text-cyan-300">{member.name}</h3>
            <p className="text-lg text-gray-100">{member.username}</p>
            <p className="text-sm text-gray-200 mt-2">{member.role}</p>
            <p className="text-sm text-gray-400 mt-2">{member.description}</p>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-300">Skills:</h4>
              <ul className="list-disc list-inside text-sm text-gray-400">
                {member.skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
