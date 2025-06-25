import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Brain, Mic, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../utils/api';

const EntryDetailPage = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [chat, setChat] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const fetchEntry = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/journal/${id}`);
      setEntry(res.data.entry || res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      await api.post(`/ai/analyze/${id}`);
      await fetchEntry();
    } finally {
      setAnalyzing(false);
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
      sendMessage(transcript, true);
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

  // Stop AI voice
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (msg, fromMic = false) => {
    const message = fromMic ? msg : userMessage;
    if (!message.trim()) return;
    setChatLoading(true);
    setChat((prev) => [...prev, { from: 'user', text: message }]);
    if (!fromMic) setUserMessage('');
    try {
      // Add instruction for concise, bullet-pointed output
      const prompt = `${message}\n\nReply in 2-4 short bullet points, each as a separate line, and keep it concise and actionable.`;
      const res = await api.post('/ai/chat', { message: prompt, entryId: id });
      setChat((prev) => [...prev, { from: 'ai', text: res.data.reply }]);
      // Speak the AI's reply
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance(res.data.reply.replace(/\n/g, '. '));
        utter.lang = 'en-US';
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
      }
    } catch {
      setChat((prev) => [...prev, { from: 'ai', text: 'Sorry, I could not respond right now.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!entry) return <div className="min-h-screen flex items-center justify-center">Entry not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[70vh]">
            {/* Analysis Section (Left) */}
            <div className="flex flex-col h-full">
              <Card className="flex-1 flex flex-col py-8 px-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">{entry.title}</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{entry.content}</p>
                <div className="text-xs text-gray-400 mb-2">{new Date(entry.createdAt).toLocaleString()}</div>
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">Mood: {entry.mood}</span>
                  {entry.tags && entry.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">#{tag}</span>
                  ))}
                </div>
                {entry.aiAnalysis && entry.aiAnalysis.processed ? (
                  <div className="bg-gray-50 border-t pt-2 mt-2 text-xs text-left flex-1">
                    <div className="font-semibold mb-1">AI Detected:</div>
                    {entry.aiAnalysis.distortions && entry.aiAnalysis.distortions.length > 0 ? (
                      entry.aiAnalysis.distortions.map((d, i) => (
                        <div key={i} className="mb-2 p-2 rounded bg-yellow-50 border border-yellow-200">
                          <span className="font-bold">🧠 Distortion:</span> <span className="text-yellow-800">{d.type}</span><br />
                          <span className="font-bold">💬 Explanation:</span> <span className="text-gray-700">{d.explanation}</span><br />
                          {d.textSnippet && <span className="font-bold">Snippet:</span>} <span className="italic text-gray-500">{d.textSnippet}</span>
                        </div>
                      ))
                    ) : (
                      <div>No distortions detected.</div>
                    )}
                    {entry.aiAnalysis.reframes && entry.aiAnalysis.reframes.length > 0 && (
                      <div className="mt-2 p-2 rounded bg-green-50 border border-green-200">
                        <span className="font-bold">🌱 Reframe:</span> <span className="text-green-800">{entry.aiAnalysis.reframes.map((r, i) => r.reframedThought).join('; ')}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={runAIAnalysis}
                    loading={analyzing}
                  >
                    <Brain className="h-4 w-4 mr-2" /> Run AI Analysis
                  </Button>
                )}
              </Card>
            </div>

            {/* AI Chat Section (Right) */}
            <div className="flex flex-col h-full">
              <Card className="flex-1 flex flex-col py-6 px-4">
                <h3 className="text-lg font-semibold mb-2">Chat with your AI friend</h3>
                <div className="flex-1 space-y-2 mb-4 max-h-[60vh] overflow-y-auto bg-gray-50 p-2 rounded">
                  {chat.length === 0 && (
                    <div className="text-gray-400 text-center">Start a conversation with your AI friend!</div>
                  )}
                  {chat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className={
                        msg.from === 'user'
                          ? 'inline-block bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-none shadow'
                          : 'inline-block bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow'
                      }>
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2 items-center">
                  <input
                    className="flex-1 border rounded px-3 py-2"
                    value={userMessage}
                    onChange={e => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={chatLoading}
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  />
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-3 rounded-full border ${micActive ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'} shadow hover:bg-blue-50 transition`}
                    title="Talk to AI with mic"
                    aria-label="Talk to AI with mic"
                  >
                    {micActive ? <Loader2 className="animate-spin h-6 w-6 text-blue-600" /> : <Mic className="h-6 w-6 text-blue-600" />}
                  </button>
                  <Button onClick={() => sendMessage()} loading={chatLoading} disabled={chatLoading || !userMessage.trim()}>
                    Send
                  </Button>
                  {isSpeaking && (
                    <Button type="button" variant="outline" size="sm" className="ml-2" onClick={stopSpeaking}>
                      Stop Voice
                    </Button>
                  )}
                </div>
                {micError && <div className="text-red-500 text-xs mt-1">{micError}</div>}
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EntryDetailPage;