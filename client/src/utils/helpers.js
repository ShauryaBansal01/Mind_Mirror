import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// Date formatting utilities
export const formatDate = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(parsedDate)) {
    return 'Today';
  } else if (isYesterday(parsedDate)) {
    return 'Yesterday';
  } else {
    return format(parsedDate, 'MMM d, yyyy');
  }
};

export const formatDateTime = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM d, yyyy \'at\' h:mm a');
};

export const formatTimeAgo = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

// Mood utilities
export const getMoodColor = (mood) => {
  const moodColors = {
    'very-happy': 'text-green-500 bg-green-50 border-green-200',
    'happy': 'text-lime-500 bg-lime-50 border-lime-200',
    'content': 'text-yellow-500 bg-yellow-50 border-yellow-200',
    'neutral': 'text-gray-500 bg-gray-50 border-gray-200',
    'slightly-sad': 'text-orange-500 bg-orange-50 border-orange-200',
    'sad': 'text-red-500 bg-red-50 border-red-200',
    'very-sad': 'text-red-600 bg-red-50 border-red-300',
    'anxious': 'text-purple-500 bg-purple-50 border-purple-200',
    'stressed': 'text-amber-500 bg-amber-50 border-amber-200',
    'angry': 'text-red-600 bg-red-50 border-red-300',
    'frustrated': 'text-orange-600 bg-orange-50 border-orange-300',
    'excited': 'text-cyan-500 bg-cyan-50 border-cyan-200',
    'grateful': 'text-emerald-500 bg-emerald-50 border-emerald-200',
    'hopeful': 'text-blue-500 bg-blue-50 border-blue-200',
    'confused': 'text-indigo-500 bg-indigo-50 border-indigo-200',
    'overwhelmed': 'text-violet-500 bg-violet-50 border-violet-200',
  };
  
  return moodColors[mood] || moodColors.neutral;
};

export const getMoodEmoji = (mood) => {
  const moodEmojis = {
    'very-happy': '😄',
    'happy': '😊',
    'content': '😌',
    'neutral': '😐',
    'slightly-sad': '😕',
    'sad': '😢',
    'very-sad': '😭',
    'anxious': '😰',
    'stressed': '😤',
    'angry': '😠',
    'frustrated': '😤',
    'excited': '🤩',
    'grateful': '🙏',
    'hopeful': '🌟',
    'confused': '😕',
    'overwhelmed': '😵',
  };
  
  return moodEmojis[mood] || '😐';
};

export const getMoodLabel = (mood) => {
  const moodLabels = {
    'very-happy': 'Very Happy',
    'happy': 'Happy',
    'content': 'Content',
    'neutral': 'Neutral',
    'slightly-sad': 'Slightly Sad',
    'sad': 'Sad',
    'very-sad': 'Very Sad',
    'anxious': 'Anxious',
    'stressed': 'Stressed',
    'angry': 'Angry',
    'frustrated': 'Frustrated',
    'excited': 'Excited',
    'grateful': 'Grateful',
    'hopeful': 'Hopeful',
    'confused': 'Confused',
    'overwhelmed': 'Overwhelmed',
  };
  
  return moodLabels[mood] || 'Unknown';
};

// Cognitive distortion utilities
export const getDistortionInfo = (type) => {
  const distortions = {
    'all-or-nothing': {
      name: 'All-or-Nothing Thinking',
      description: 'Seeing things in black and white categories',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    'overgeneralization': {
      name: 'Overgeneralization',
      description: 'Drawing broad conclusions from single events',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    'mental-filter': {
      name: 'Mental Filter',
      description: 'Focusing only on negative details',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    'disqualifying-positive': {
      name: 'Disqualifying the Positive',
      description: 'Dismissing positive experiences',
      color: 'text-lime-600 bg-lime-50 border-lime-200'
    },
    'jumping-to-conclusions': {
      name: 'Jumping to Conclusions',
      description: 'Making negative interpretations without evidence',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    'magnification': {
      name: 'Magnification/Catastrophizing',
      description: 'Exaggerating the importance of negative events',
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    'emotional-reasoning': {
      name: 'Emotional Reasoning',
      description: 'Assuming emotions reflect reality',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
    },
    'should-statements': {
      name: 'Should Statements',
      description: 'Using unrealistic expectations',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    'labeling': {
      name: 'Labeling',
      description: 'Attaching negative labels based on mistakes',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    'personalization': {
      name: 'Personalization',
      description: 'Taking responsibility for things outside control',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    'comparison': {
      name: 'Comparison',
      description: 'Making unfair comparisons to others',
      color: 'text-pink-600 bg-pink-50 border-pink-200'
    },
    'blame': {
      name: 'Blame',
      description: 'Blaming yourself or others excessively',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    }
  };
  
  return distortions[type] || {
    name: 'Unknown Distortion',
    description: 'Unknown cognitive distortion',
    color: 'text-gray-600 bg-gray-50 border-gray-200'
  };
};

// Text utilities
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

export const getWordCount = (text) => {
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

// Local storage utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
};

// CSS class utilities
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};