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

// Comprehensive cognitive distortion utilities (David Burns + Modern CBT)
export const getDistortionInfo = (type) => {
  const distortions = {
    // Core David Burns Cognitive Distortions
    'all-or-nothing': {
      name: 'All-or-Nothing Thinking',
      description: 'Seeing things in absolute, black-and-white categories',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    'overgeneralization': {
      name: 'Overgeneralization',
      description: 'Drawing broad negative conclusions from single events',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    'mental-filter': {
      name: 'Mental Filter',
      description: 'Dwelling on negatives and ignoring positives',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    'disqualifying-positive': {
      name: 'Disqualifying the Positive',
      description: 'Insisting that positive qualities don\'t count',
      color: 'text-lime-600 bg-lime-50 border-lime-200'
    },
    'mind-reading': {
      name: 'Mind Reading',
      description: 'Assuming you know what others are thinking',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    'fortune-telling': {
      name: 'Fortune Telling',
      description: 'Predicting that things will turn out badly',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    'magnification': {
      name: 'Magnification/Catastrophizing',
      description: 'Blowing negative events out of proportion',
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    'minimization': {
      name: 'Minimization',
      description: 'Downplaying the importance of positive events',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
    },
    'emotional-reasoning': {
      name: 'Emotional Reasoning',
      description: 'Reasoning from feelings: "I feel it, so it must be true"',
      color: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    'should-statements': {
      name: 'Should Statements',
      description: 'Using shoulds, musts, and have-tos that create pressure',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    'labeling': {
      name: 'Labeling',
      description: 'Attaching negative labels: "I\'m a loser" vs "I made a mistake"',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    'self-blame': {
      name: 'Self-Blame',
      description: 'Blaming yourself for things outside your control',
      color: 'text-violet-600 bg-violet-50 border-violet-200'
    },
    'other-blame': {
      name: 'Other-Blame',
      description: 'Blaming others while overlooking your contribution',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    
    // Additional Modern CBT Cognitive Distortions
    'personalization': {
      name: 'Personalization',
      description: 'Taking responsibility for external events',
      color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200'
    },
    'control-fallacy': {
      name: 'Control Fallacy',
      description: 'Believing you have total control or no control at all',
      color: 'text-pink-600 bg-pink-50 border-pink-200'
    },
    'fallacy-of-fairness': {
      name: 'Fallacy of Fairness',
      description: 'Measuring everything against fairness standards',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    'heavens-reward-fallacy': {
      name: 'Heaven\'s Reward Fallacy',
      description: 'Expecting automatic rewards for good deeds',
      color: 'text-red-500 bg-red-50 border-red-200'
    },
    'always-being-right': {
      name: 'Always Being Right',
      description: 'Constantly striving to prove you\'re correct',
      color: 'text-orange-500 bg-orange-50 border-orange-200'
    },
    'comparison': {
      name: 'Comparison',
      description: 'Making unfair comparisons that diminish self-worth',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    'filtering': {
      name: 'Filtering',
      description: 'Focusing on single negative detail exclusively',
      color: 'text-yellow-500 bg-yellow-50 border-yellow-200'
    },
    'global-labeling': {
      name: 'Global Labeling',
      description: 'Making global judgments from single events',
      color: 'text-lime-500 bg-lime-50 border-lime-200'
    },
    'perfectionism': {
      name: 'Perfectionism',
      description: 'Setting unrealistically high standards',
      color: 'text-green-500 bg-green-50 border-green-200'
    },
    'approval-seeking': {
      name: 'Approval Seeking',
      description: 'Needing constant validation from others',
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
    },
    'change-fallacy': {
      name: 'Change Fallacy',
      description: 'Believing others must change for you to be happy',
      color: 'text-teal-500 bg-teal-50 border-teal-200'
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