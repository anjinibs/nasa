"use client";
export default function Navbar({ active, setActive }) {
  const navItems = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Publications", key: "publications" },
    { name: "Use Cases", key: "usecases" },
    { name: "Team", key: "team" },
    { name: "Admin", key: "admin" },
  ];

  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-cyan-500/20 sticky top-0 z-50 w-screen left-0 right-0">
      <div className="w-full px-0">
        <div className="flex justify-between items-center h-16 w-full">
          <div className="flex items-center space-x-3 pl-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-2xl text-cyan-400">🚀</span>
            </div>
            <span
              className="text-xl font-bold text-white"
              style={{ fontfamily: "Pacifico, serif "}}
            >
              Space Biology Engine
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 pr-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`whitespace-nowrap cursor-pointer px-3 py-2 text-md font-medium transition-colors duration-200 ${
                  active === item.key
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-300 hover:text-cyan-400"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button className="md:hidden w-6 h-6 flex items-center justify-center text-gray-300 hover:text-cyan-400 pr-4">
            <span className="text-xl">☰</span>
          </button>
        </div>
      </div>
    </nav>
  );
}