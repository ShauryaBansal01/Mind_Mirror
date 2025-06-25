import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../utils/api';
import { formatDate, getMoodColor, getMoodEmoji } from '../../utils/helpers';

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/journal');
      setEntries(res.data.entries || res.data || []);
    } catch (err) {
      setError('Failed to load journal entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [location.key]); // re-fetch on every navigation to this page

  useEffect(() => {
    // Debug: log entries to console
    console.log('Fetched journal entries:', entries);
  }, [entries]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal Entries</h1>
              <p className="text-gray-600">Your thoughts and reflections</p>
            </div>
            <Button as={Link} to="/journal/new" className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>New Entry</span>
            </Button>
          </div>

          {loading ? (
            <Card className="text-center py-12">Loading...</Card>
          ) : error ? null : entries.length === 0 ? null : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <Card key={entry._id} hover className="relative group">
                  <Link to={`/journal/${entry._id}`} className="absolute inset-0 z-10" aria-label="View entry" />
                  <div className="flex items-center mb-2">
                    <span className={`mr-2 text-2xl ${getMoodColor(entry.mood)}`}>{getMoodEmoji(entry.mood)}</span>
                    <h2 className="text-lg font-semibold text-gray-900 flex-1 truncate">{entry.title || 'Untitled'}</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{entry.content}</p>
                  <div className="text-xs text-gray-400 flex justify-between mb-2">
                    <span>{formatDate(entry.createdAt)}</span>
                    {entry.tags && entry.tags.length > 0 && (
                      <span>{entry.tags.map((tag) => `#${tag}`).join(' ')}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JournalPage;