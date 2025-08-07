import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../../services/api';

export default function AnalyticsDashboard({ scanTime }) {
  const [analytics, setAnalytics] = useState(null);
  const [timeSpent, setTimeSpent] = useState('0s');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update time spent counter
  useEffect(() => {
    if (!scanTime) return;

    const interval = setInterval(() => {
      const seconds = Math.floor((new Date() - scanTime) / 1000);
      setTimeSpent(`${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [scanTime]);

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!analytics) return null;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Campaign Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-indigo-800">Total Scans</h3>
          <p className="text-3xl font-bold">{analytics.totalScans}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-indigo-800">Unique Users</h3>
          <p className="text-3xl font-bold">{analytics.uniqueUsers}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-indigo-800">Your Time Spent</h3>
          <p className="text-3xl font-bold">{timeSpent}</p>
        </div>
      </div>
    </div>
  );
}