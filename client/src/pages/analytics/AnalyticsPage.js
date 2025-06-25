import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const AnalyticsPage = () => {
  const [moodTrends, setMoodTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoodTrends = async () => {
      try {
        const res = await api.get('/analytics/mood-trends');
        setMoodTrends(res.data.moodTrends || res.data || []);
      } catch (err) {
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchMoodTrends();
  }, []);

  const chartData = useMemo(() => {
    // Each trend: { _id: date, moods: [{ mood, count, avgIntensity }] }
    return moodTrends.map(trend => {
      const date = trend._id || trend.period;
      let totalCount = 0;
      let weightedSum = 0;
      let avgIntensity = 0;
      let moodLabels = [];
      if (trend.moods && trend.moods.length > 0) {
        trend.moods.forEach(m => {
          totalCount += m.count || 0;
          weightedSum += (m.avgIntensity || 0) * (m.count || 0);
          moodLabels.push(m.mood);
        });
        avgIntensity = totalCount > 0 ? weightedSum / totalCount : 0;
      }
      return {
        date,
        entryCount: totalCount,
        avgIntensity: avgIntensity ? Number(avgIntensity.toFixed(2)) : 0,
        moods: moodLabels.join(', '),
      };
    });
  }, [moodTrends]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Insights into your mental wellness journey</p>
          </div>

          {loading ? (
            <Card className="text-center py-12">Loading...</Card>
          ) : error ? (
            <Card className="text-center py-12 text-red-500">{error}</Card>
          ) : chartData.length === 0 ? (
            <Card className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No analytics data yet!
              </h3>
              <p className="text-gray-600">
                Add some journal entries to see your mood trends.
              </p>
            </Card>
          ) : (
            <>
              <Card className="py-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Mood Intensity Trend (last 30 days)</h3>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 10]} tickCount={6} label={{ value: 'Avg. Intensity', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgIntensity" name="Avg. Mood Intensity" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="py-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Entry Frequency (last 30 days)</h3>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} label={{ value: 'Entries', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="entryCount" name="Entries" fill="#34d399" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="py-6">
                <h3 className="text-lg font-semibold mb-4">Raw Data (last 30 days)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Mood(s)</th>
                        <th className="px-2 py-1 text-left">Entries</th>
                        <th className="px-2 py-1 text-left">Avg. Intensity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="px-2 py-1">{row.date}</td>
                          <td className="px-2 py-1">{row.moods}</td>
                          <td className="px-2 py-1">{row.entryCount}</td>
                          <td className="px-2 py-1">{row.avgIntensity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;