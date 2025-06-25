import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenTool, Mic, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../utils/api';

const moods = [
  { value: 'very-happy', label: '😊 Very Happy' },
  { value: 'happy', label: '🙂 Happy' },
  { value: 'content', label: '😌 Content' },
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'slightly-sad', label: '😕 Slightly Sad' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'very-sad', label: '😭 Very Sad' },
  { value: 'anxious', label: '😰 Anxious' },
  { value: 'stressed', label: '😫 Stressed' },
  { value: 'angry', label: '😡 Angry' },
  { value: 'excited', label: '🤩 Excited' },
];

const NewEntryPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState('');
  const recognitionRef = React.useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/journal', { title, content, mood });
      navigate('/journal');
    } catch (err) {
      setError('Failed to add entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    setMicError('');
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMicError('Sorry, your browser does not support speech recognition.');
      return;
    }
    if (micActive) {
      recognitionRef.current && recognitionRef.current.stop();
      setMicActive(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent(prev => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onerror = (event) => {
      setMicActive(false);
      setMicError('Speech recognition error: ' + event.error);
    };
    recognition.onend = () => {
      setMicActive(false);
    };
    recognitionRef.current = recognition;
    setMicActive(true);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Journal Entry</h1>
            <p className="text-gray-600">Express your thoughts and feelings</p>
          </div>
          <Card className="py-8 px-6 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Content</label>
                <div className="relative flex items-center">
                  <textarea
                    className="w-full border rounded px-3 py-2 min-h-[100px] pr-12"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`absolute right-2 top-2 p-2 rounded-full border ${micActive ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'} shadow hover:bg-blue-50 transition`}
                    title="Speak your feelings"
                    aria-label="Record content with mic"
                  >
                    {micActive ? <Loader2 className="animate-spin h-5 w-5 text-blue-600" /> : <Mic className="h-5 w-5 text-blue-600" />}
                  </button>
                </div>
                {micError && <div className="text-red-500 text-xs mt-1">{micError}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Mood</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                  required
                >
                  <option value="">Select mood</option>
                  {moods.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" loading={loading} className="w-full">Add Entry</Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NewEntryPage;