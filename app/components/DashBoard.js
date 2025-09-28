import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const totalEntries = 66;
  const categories = 11;
  const criticalResearch = 23;
  const recentEntries = 5;

  const researchCategoriesData = {
    labels: [
      'Microgravity Effects',
      'Space Medicine',
      'Radiation Protection',
      'Genetics',
      'Astrobiology',
      'Plant Biology',
      'Animal Biology',
      'Space Microbes',
      'Cardiovascular',
    ],
    datasets: [
      {
        label: 'Number of Entries',
        data: [12, 20, 4, 7, 5, 2, 1, 1, 2],
        backgroundColor: [
          '#4f46e5',
          '#10b981',
          '#f59e0b',
          '#3b82f6',
          '#8b5cf6',
          '#f43f5e',
          '#14b8a6',
          '#facc15',
          '#e11d48',
        ],
      },
    ],
  };

  const researchImportanceData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [35, 42, 18, 5],
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Research Dashboard</h1>
        <div className="space-x-4">
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Browse Knowledge</button>
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">+ Add Research</button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card title="Total Entries" value={totalEntries} />
        <Card title="Categories" value={categories} />
        <Card title="Critical Research" value={criticalResearch} />
        <Card title="Recent Entries (7d)" value={recentEntries} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-4 rounded shadow h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Research Categories</h2>
          <div className="h-[50vh]">
            <Bar data={researchCategoriesData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-gray-800 flex flex-col items-center justify-center rounded shadow h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Research Importance</h2>
          <Pie data={researchImportanceData} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-800 p-6 rounded shadow flex flex-col items-center">
      <span className="text-sm text-gray-400">{title}</span>
      <span className="text-2xl font-bold mt-2">{value}</span>
    </div>
  );
}