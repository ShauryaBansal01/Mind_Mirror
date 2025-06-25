import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  BarChart3, 
  Brain, 
  Calendar,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const res = await api.get('/journal');
        setEntries(res.data.entries || res.data || []);
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  // Helper: assign a numeric value to each mood
  const moodValues = {
    'very-happy': 10,
    'happy': 8,
    'content': 7,
    'neutral': 5,
    'slightly-sad': 4,
    'sad': 2,
    'very-sad': 1,
    'anxious': 3,
    'stressed': 3,
    'angry': 2,
    'frustrated': 3,
    'excited': 9,
    'grateful': 8,
    'hopeful': 7,
    'confused': 4,
    'overwhelmed': 3
  };

  // Helper: calculate streak (consecutive days with entries)
  function calculateStreak(entries) {
    if (!entries.length) return 0;
    const days = new Set(entries.map(e => new Date(e.createdAt).toDateString()));
    let streak = 0;
    let current = new Date();
    while (days.has(current.toDateString())) {
      streak++;
      current.setDate(current.getDate() - 1);
    }
    return streak;
  }

  // Helper: calculate average mood score
  function calculateMoodScore(entries) {
    const scores = entries.map(e => moodValues[e.mood] || 5);
    if (!scores.length) return 0;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  }

  // Helper: count insights generated (entries with aiAnalysis.processed)
  function countInsights(entries) {
    return entries.filter(e => e.aiAnalysis && e.aiAnalysis.processed).length;
  }
  // Helper: count insights generated in a given week
  function countInsightsInWeek(entries, weekStart, weekEnd) {
    return entries.filter(e => {
      if (!e.aiAnalysis || !e.aiAnalysis.processed) return false;
      const created = new Date(e.createdAt);
      return created >= weekStart && created < weekEnd;
    }).length;
  }
  // Calculate insights for this week and last week
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfThisWeek.setHours(0,0,0,0);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
  const endOfLastWeek = new Date(startOfThisWeek);
  const insightsTotal = countInsights(entries);
  const insightsThisWeek = countInsightsInWeek(entries, startOfThisWeek, now);
  const insightsLastWeek = countInsightsInWeek(entries, startOfLastWeek, endOfLastWeek);
  const insightsChange = insightsThisWeek - insightsLastWeek;

  const moodScore = calculateMoodScore(entries);
  const streak = calculateStreak(entries);

  const quickStats = [
    {
      title: 'Total Entries',
      value: entries.length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Mood Score',
      value: moodScore,
      icon: Heart,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Insights Generated',
      value: insightsTotal,
      change: (insightsChange >= 0 ? '+' : '') + insightsChange + ' this week',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Streak',
      value: streak + (streak === 1 ? ' day' : ' days'),
      icon: Zap,
      color: 'text-yellow-600 bg-yellow-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.profile?.firstName || user?.username}! 👋
            </h1>
            <p className="text-gray-600">
              Here's your mental wellness overview for today.
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              as={Link}
              to="/journal/new"
              size="lg"
              className="flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Journal Entry</span>
            </Button>
            <Button
              as={Link}
              to="/journal"
              variant="outline"
              size="lg"
              className="flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-5 w-5" />
              <span>View All Entries</span>
            </Button>
            <Button
              as={Link}
              to="/analytics"
              variant="outline"
              size="lg"
              className="flex items-center justify-center space-x-2"
            >
              <BarChart3 className="h-5 w-5" />
              <span>View Analytics</span>
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} hover>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
                <Link
                  to="/journal"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : entries.length === 0 ? null : (
                  entries.slice(0, 5).map((entry) => (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {entry.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium mood-${entry.mood}`}>
                            {entry.mood}
                          </span>
                          {entry.aiAnalysis && entry.aiAnalysis.processed && (
                            <span className="flex items-center space-x-1 text-primary-600">
                              <Brain className="h-4 w-4" />
                              <span>Analyzed</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/journal/${entry._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Insights & Tips (optional, can be removed if you want only entries) */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;