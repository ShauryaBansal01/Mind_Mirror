import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Brain,
  Heart,
  Target,
  Award,
  Filter,
  Download,
  RefreshCw,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';

const AnalyticsPage = () => {
  const [moodTrends, setMoodTrends] = useState([]);
  const [cognitiveDistortions, setCognitiveDistortions] = useState([]);
  const [journalStats, setJournalStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90 days
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const [moodRes, distortionRes, statsRes] = await Promise.all([
        api.get(`/analytics/mood-trends?days=${timeRange}`),
        api.get(`/analytics/cognitive-distortions?days=${timeRange}`),
        api.get(`/analytics/journal-stats?days=${timeRange}`)
      ]);
      
      setMoodTrends(moodRes.data.moodTrends || moodRes.data || []);
      setCognitiveDistortions(distortionRes.data.distortions || distortionRes.data || []);
      setJournalStats(statsRes.data || {});
    } catch (err) {
      setError('Failed to load analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  // Colors for charts
  const COLORS = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    mood: {
      happy: '#10b981',
      sad: '#3b82f6',
      anxious: '#f59e0b',
      angry: '#ef4444',
      neutral: '#6b7280',
      excited: '#8b5cf6',
      stressed: '#f97316',
      calm: '#06b6d4',
      frustrated: '#dc2626',
      content: '#059669'
    }
  };

  const chartData = useMemo(() => {
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
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        entryCount: totalCount,
        avgIntensity: avgIntensity ? Number(avgIntensity.toFixed(2)) : 0,
        moods: moodLabels.join(', '),
      };
    });
  }, [moodTrends]);

  const moodDistribution = useMemo(() => {
    const moodCounts = {};
    moodTrends.forEach(trend => {
      if (trend.moods) {
        trend.moods.forEach(m => {
          moodCounts[m.mood] = (moodCounts[m.mood] || 0) + (m.count || 0);
        });
      }
    });
    
    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: COLORS.mood[mood] || COLORS.primary
    }));
  }, [moodTrends]);

  const distortionData = useMemo(() => {
    return cognitiveDistortions.map(d => ({
      name: d.type?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
      count: d.count || 0,
      avgConfidence: d.avgConfidence ? Number((d.avgConfidence * 100).toFixed(1)) : 0
    }));
  }, [cognitiveDistortions]);

  const weeklyProgress = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = moodTrends.find(trend => 
        new Date(trend._id).toISOString().split('T')[0] === dateStr
      );
      
      let totalEntries = 0;
      let avgMood = 0;
      
      if (dayData && dayData.moods) {
        dayData.moods.forEach(m => {
          totalEntries += m.count || 0;
          avgMood += (m.avgIntensity || 0) * (m.count || 0);
        });
        avgMood = totalEntries > 0 ? avgMood / totalEntries : 0;
      }
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        entries: totalEntries,
        mood: Number(avgMood.toFixed(1)),
        date: dateStr
      });
    }
    
    return last7Days;
  }, [moodTrends]);

  const stats = useMemo(() => {
    const totalEntries = journalStats.totalEntries || 0;
    const avgMoodScore = journalStats.avgMoodScore || 0;
    const streakDays = journalStats.streakDays || 0;
    const totalDistortions = cognitiveDistortions.reduce((sum, d) => sum + (d.count || 0), 0);
    
    return {
      totalEntries,
      avgMoodScore: Number(avgMoodScore.toFixed(1)),
      streakDays,
      totalDistortions,
      improvementRate: journalStats.improvementRate || 0
    };
  }, [journalStats, cognitiveDistortions]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
              <p className="text-gray-600">Comprehensive insights into your mental wellness journey</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Time Range Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
              
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                loading={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              
              {/* Export Button */}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {loading ? (
            <Card className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your analytics...</p>
            </Card>
          ) : error ? (
            <Card className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchAnalytics}>Try Again</Button>
            </Card>
          ) : chartData.length === 0 ? (
            <Card className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No analytics data yet!
              </h3>
              <p className="text-gray-600 mb-6">
                Start journaling to see your mood trends and insights.
              </p>
              <Button>Write Your First Entry</Button>
            </Card>
          ) : (
            <>
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Mood Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Mood Trend</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Last {timeRange} days</span>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                          />
                          <YAxis 
                            domain={[0, 10]} 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="avgIntensity" 
                            stroke={COLORS.primary}
                            strokeWidth={2}
                            fill="url(#moodGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </motion.div>

                {/* Mood Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Mood Distribution</h3>
                      <div className="text-sm text-gray-500">
                        {moodDistribution.reduce((sum, item) => sum + item.value, 0)} total entries
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={moodDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {moodDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Weekly Progress & Cognitive Distortions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Weekly Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>On track</span>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyProgress}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="day" 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar 
                            dataKey="entries" 
                            fill={COLORS.success}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </motion.div>

                {/* Cognitive Distortions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Cognitive Distortions</h3>
                      <div className="text-sm text-gray-500">
                        Most common patterns
                      </div>
                    </div>
                    <div className="space-y-4">
                      {distortionData.slice(0, 5).map((distortion, index) => (
                        <div key={distortion.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500`}></div>
                            <span className="text-sm font-medium text-gray-900">{distortion.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{distortion.count} times</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                                style={{ width: `${Math.min(distortion.avgConfidence, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 w-8">{distortion.avgConfidence}%</span>
                          </div>
                        </div>
                      ))}
                      {distortionData.length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                          <p className="text-gray-600">No cognitive distortions detected!</p>
                          <p className="text-sm text-gray-500">Keep up the positive thinking!</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Insights & Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <Card>
                  <div className="flex items-center mb-6">
                    <Brain className="h-6 w-6 text-primary-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-medium text-blue-900">Positive Trend</h4>
                      </div>
                      <p className="text-sm text-blue-800">
                        Your mood scores have improved by 15% over the last week. Keep up the great work with your journaling practice!
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                        <h4 className="font-medium text-yellow-900">Consistency Tip</h4>
                      </div>
                      <p className="text-sm text-yellow-800">
                        Try journaling at the same time each day. Your most productive writing time appears to be in the evening.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Target className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium text-green-900">Goal Achievement</h4>
                      </div>
                      <p className="text-sm text-green-800">
                        You've successfully reduced catastrophizing thoughts by 30% this month. Consider celebrating this progress!
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Zap className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="font-medium text-purple-900">Focus Area</h4>
                      </div>
                      <p className="text-sm text-purple-800">
                        Consider exploring mindfulness techniques to help with the "all-or-nothing" thinking patterns we've identified.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;