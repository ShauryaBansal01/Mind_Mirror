import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenTool, Mic, Loader2, Brain, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import { getMoodEmoji, getMoodLabel } from '../../utils/helpers';



const NewEntryPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [detectedMood, setDetectedMood] = useState(null);
  const [moodDetectionLoading, setMoodDetectionLoading] = useState(false);
  const [moodDetectionError, setMoodDetectionError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState('');
  const recognitionRef = React.useRef(null);
  const navigate = useNavigate();
  const moodDetectionTimeoutRef = React.useRef(null);

  // Detect mood from content with debouncing
  const detectMood = async (contentText, titleText) => {
    if (!contentText || contentText.trim().length < 10) {
      setDetectedMood(null);
      return;
    }

    setMoodDetectionLoading(true);
    setMoodDetectionError(null);

    try {
      const response = await api.post('/ai/detect-mood', {
        content: contentText,
        title: titleText
      });

      setDetectedMood({
        mood: response.data.mood,
        confidence: response.data.confidence,
        explanation: response.data.explanation
      });
    } catch (err) {
      console.error('Mood detection error:', err);
      setMoodDetectionError('Could not detect mood automatically');
      setDetectedMood(null);
    } finally {
      setMoodDetectionLoading(false);
    }
  };

  // Debounced mood detection when content changes
  useEffect(() => {
    if (moodDetectionTimeoutRef.current) {
      clearTimeout(moodDetectionTimeoutRef.current);
    }

    moodDetectionTimeoutRef.current = setTimeout(() => {
      if (content.trim().length >= 10) {
        detectMood(content, title);
      } else {
        setDetectedMood(null);
      }
    }, 1000); // 1 second delay

    return () => {
      if (moodDetectionTimeoutRef.current) {
        clearTimeout(moodDetectionTimeoutRef.current);
      }
    };
  }, [content, title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Submit with AI mood detection enabled
      const response = await api.post('/journal', { 
        title, 
        content, 
        aiDetectedMood: true 
      });
      
      console.log('Entry created with AI mood detection:', response.data.moodDetection);
      navigate('/journal');
    } catch (err) {
      console.error('Submit error:', err);
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
            <p className="text-gray-600 flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              Express your thoughts and let AI detect your mood automatically
            </p>
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
              {/* AI Mood Detection Display */}
              <div>
                <label className="block font-medium mb-1 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  AI Detected Mood
                </label>
                <div className="w-full border rounded px-3 py-3 bg-gray-50 min-h-[42px] flex items-center">
                  {moodDetectionLoading ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analyzing your emotions...</span>
                    </div>
                  ) : detectedMood ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-lg">{getMoodEmoji(detectedMood.mood)}</span>
                      <span className="font-medium">{getMoodLabel(detectedMood.mood)}</span>
                      <span className="text-sm text-gray-500">
                        ({Math.round(detectedMood.confidence * 100)}% confidence)
                      </span>
                    </div>
                  ) : content.trim().length < 10 ? (
                    <span className="text-gray-500 text-sm">
                      Write at least 10 characters for mood detection
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No mood detected yet
                    </span>
                  )}
                </div>
                {detectedMood && detectedMood.explanation && (
                  <p className="text-xs text-gray-600 mt-1">
                    {detectedMood.explanation}
                  </p>
                )}
                {moodDetectionError && (
                  <p className="text-xs text-red-600 mt-1">
                    {moodDetectionError}
                  </p>
                )}
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