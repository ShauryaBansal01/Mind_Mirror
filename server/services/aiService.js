const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Comprehensive cognitive distortion definitions for AI context (David Burns + Modern CBT)
const COGNITIVE_DISTORTIONS = {
  // Core David Burns Cognitive Distortions
  'all-or-nothing': {
    name: 'All-or-Nothing Thinking',
    description: 'Seeing things in absolute, black-and-white categories with no middle ground'
  },
  'overgeneralization': {
    name: 'Overgeneralization',
    description: 'Drawing broad negative conclusions from a single event or piece of evidence'
  },
  'mental-filter': {
    name: 'Mental Filter',
    description: 'Dwelling on negatives and ignoring positives, filtering out good things'
  },
  'disqualifying-positive': {
    name: 'Disqualifying the Positive',
    description: 'Insisting that positive qualities, experiences, or accomplishments don\'t count'
  },
  'mind-reading': {
    name: 'Mind Reading',
    description: 'Assuming you know what others are thinking, usually negatively about you'
  },
  'fortune-telling': {
    name: 'Fortune Telling',
    description: 'Predicting that things will turn out badly without sufficient evidence'
  },
  'magnification': {
    name: 'Magnification/Catastrophizing',
    description: 'Blowing negative events out of proportion, making mountains out of molehills'
  },
  'minimization': {
    name: 'Minimization',
    description: 'Shrinking or downplaying the importance of positive events or qualities'
  },
  'emotional-reasoning': {
    name: 'Emotional Reasoning',
    description: 'Reasoning from feelings: "I feel like an idiot, so I must really be one"'
  },
  'should-statements': {
    name: 'Should Statements',
    description: 'Using shoulds, shouldn\'ts, musts, oughts, and have-tos that create pressure and guilt'
  },
  'labeling': {
    name: 'Labeling',
    description: 'Attaching negative labels to yourself or others: "I\'m a loser" instead of "I made a mistake"'
  },
  'self-blame': {
    name: 'Self-Blame',
    description: 'Blaming yourself for something you weren\'t entirely responsible for'
  },
  'other-blame': {
    name: 'Other-Blame',
    description: 'Blaming others and overlooking ways you contributed to the problem'
  },
  
  // Additional Modern CBT Cognitive Distortions
  'personalization': {
    name: 'Personalization',
    description: 'Taking responsibility for external events that are outside your control'
  },
  'control-fallacy': {
    name: 'Control Fallacy',
    description: 'Believing you have either total control over everything or no control at all'
  },
  'fallacy-of-fairness': {
    name: 'Fallacy of Fairness',
    description: 'Measuring every situation against standards of fairness and resenting when things seem unfair'
  },
  'heavens-reward-fallacy': {
    name: 'Heaven\'s Reward Fallacy',
    description: 'Expecting that sacrifices and good deeds will automatically be rewarded'
  },
  'always-being-right': {
    name: 'Always Being Right',
    description: 'Constantly striving to prove that your opinions and actions are correct'
  },
  'comparison': {
    name: 'Comparison',
    description: 'Making unfair comparisons to others that diminish self-worth'
  },
  'filtering': {
    name: 'Filtering',
    description: 'Focusing on a single negative detail and dwelling on it exclusively'
  },
  'global-labeling': {
    name: 'Global Labeling',
    description: 'Making global judgments about yourself or others based on single events'
  },
  'perfectionism': {
    name: 'Perfectionism',
    description: 'Setting unrealistically high standards and being overly critical of mistakes'
  },
  'approval-seeking': {
    name: 'Approval Seeking',
    description: 'Needing constant approval and validation from others to feel worthwhile'
  },
  'change-fallacy': {
    name: 'Change Fallacy',
    description: 'Believing that others must change for you to be happy or that you can change others'
  }
};

// System prompt for cognitive distortion detection
const ANALYSIS_PROMPT = `You are a caring, supportive friend. When someone shares their journal entry, you listen with empathy and warmth. Respond in a friendly, conversational way—never clinical or robotic. Use gentle, encouraging language, and address the person as a friend (not as a "user").

COGNITIVE DISTORTIONS TO DETECT:
${Object.entries(COGNITIVE_DISTORTIONS).map(([key, value]) => 
  `- ${key}: ${value.description}`
).join('\n')}

INSTRUCTIONS:
1. Read the journal entry as if your friend is sharing their feelings with you.
2. If you notice any cognitive distortions, gently point them out, using friendly and supportive words.
3. For each distortion found:
   - Identify the specific text snippet
   - Explain why it's a distortion, in a way that feels like a friend giving advice
   - Provide a confidence score (0.0-1.0)
4. Suggest 1-3 helpful, positive reframes using everyday language and CBT techniques, as if you’re giving a pep talk to a friend.
5. Determine overall sentiment
6. Identify key themes

RESPONSE FORMAT (JSON only, no extra text):
{
  "distortions": [
    {
      "type": "distortion-key",
      "explanation": "...",
      "confidence": 0.9,
      "textSnippet": "..."
    }
  ],
  "reframes": [
    {
      "originalThought": "...",
      "reframedThought": "...",
      "technique": "..."
    }
  ],
  "overallSentiment": "...",
  "themes": ["..."]
}
`;

class AIService {
  /**
   * Analyze journal entry for cognitive distortions
   * @param {string} content - Journal entry content
   * @param {string} title - Journal entry title
   * @param {string} mood - User's reported mood
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeJournalEntry(content, title = '', mood = '') {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      // Get the generative model
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      const userPrompt = `
${ANALYSIS_PROMPT}

JOURNAL ENTRY ANALYSIS REQUEST

Title: ${title}
Reported Mood: ${mood}
Content: ${content}

Please analyze this journal entry for cognitive distortions and provide helpful reframes following the specified JSON format. Return only valid JSON.`;

      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response to extract JSON
      let jsonText = text.trim();
      
      // Remove any markdown formatting
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const analysis = JSON.parse(jsonText);

      // Validate and clean the response
      return this.validateAndCleanAnalysis(analysis);

    } catch (error) {
      console.error('AI analysis error:', error);
      
      // Return error information for debugging
      return {
        error: true,
        message: error.message,
        distortions: [],
        reframes: [],
        overallSentiment: 'neutral',
        keyThemes: []
      };
    }
  }

  /**
   * Validate and clean AI analysis response
   * @param {Object} analysis - Raw AI analysis
   * @returns {Object} Cleaned analysis
   */
  validateAndCleanAnalysis(analysis) {
    const cleaned = {
      distortions: [],
      reframes: [],
      overallSentiment: 'neutral',
      keyThemes: []
    };

    // Validate distortions
    if (Array.isArray(analysis.distortions)) {
      cleaned.distortions = analysis.distortions
        .filter(d => d.type && COGNITIVE_DISTORTIONS[d.type])
        .map(d => ({
          type: d.type,
          confidence: Math.max(0, Math.min(1, d.confidence || 0)),
          explanation: (d.explanation || '').substring(0, 500),
          textSnippet: (d.textSnippet || '').substring(0, 200)
        }));
    }

    // Validate reframes
    if (Array.isArray(analysis.reframes)) {
      cleaned.reframes = analysis.reframes
        .filter(r => r.originalThought && r.reframedThought)
        .map(r => ({
          originalThought: (r.originalThought || '').substring(0, 500),
          reframedThought: (r.reframedThought || '').substring(0, 500),
          technique: (r.technique || '').substring(0, 100)
        }));
    }

    // Validate sentiment
    const validSentiments = ['very-negative', 'negative', 'neutral', 'positive', 'very-positive'];
    if (validSentiments.includes(analysis.overallSentiment)) {
      cleaned.overallSentiment = analysis.overallSentiment;
    }

    // Validate themes
    if (Array.isArray(analysis.keyThemes)) {
      cleaned.keyThemes = analysis.keyThemes
        .filter(theme => typeof theme === 'string' && theme.trim())
        .map(theme => theme.substring(0, 50))
        .slice(0, 5); // Limit to 5 themes
    }

    return cleaned;
  }

  /**
   * Generate a supportive message based on analysis
   * @param {Object} analysis - AI analysis results
   * @returns {string} Supportive message
   */
  generateSupportiveMessage(analysis) {
    const { distortions, reframes, overallSentiment } = analysis;

    if (distortions.length === 0) {
      return "Your thoughts show good emotional balance. Keep up the positive self-reflection!";
    }

    const distortionCount = distortions.length;
    const hasReframes = reframes.length > 0;

    let message = `I noticed ${distortionCount} potential cognitive pattern${distortionCount > 1 ? 's' : ''} in your entry. `;

    if (hasReframes) {
      message += "I've suggested some alternative perspectives that might help you see the situation more clearly. ";
    }

    message += "Remember, recognizing these patterns is the first step toward more balanced thinking.";

    return message;
  }

  /**
   * Get distortion explanation
   * @param {string} distortionType - Type of cognitive distortion
   * @returns {Object} Distortion information
   */
  getDistortionInfo(distortionType) {
    return COGNITIVE_DISTORTIONS[distortionType] || {
      name: 'Unknown Distortion',
      description: 'No description available'
    };
  }

  /**
   * Test Gemini AI connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      
      return response && response.text();
    } catch (error) {
      console.error('Gemini AI connection test failed:', error);
      return false;
    }
  }

  /**
   * Detect mood/emotion from journal content using AI
   * @param {string} content - Journal entry content
   * @param {string} title - Journal entry title (optional)
   * @returns {Promise<Object>} Detected mood and confidence
   */
  async detectMood(content, title = '') {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.2,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 256,
        }
      });

      const moodPrompt = `You are an expert emotion detection AI. Analyze the following journal entry and determine the primary emotional tone/mood.

AVAILABLE MOODS (choose the most accurate one):
- very-happy: Extremely joyful, ecstatic, euphoric
- happy: Joyful, pleased, cheerful, positive
- content: Satisfied, peaceful, calm, stable
- neutral: Balanced, neither positive nor negative
- slightly-sad: Mildly down, disappointed, subdued
- sad: Unhappy, sorrowful, melancholic
- very-sad: Deeply depressed, devastated, despairing
- anxious: Worried, nervous, apprehensive, fearful
- stressed: Overwhelmed, pressured, tense
- angry: Frustrated, irritated, furious, hostile
- frustrated: Annoyed, blocked, hindered
- excited: Enthusiastic, energetic, thrilled
- grateful: Thankful, appreciative, blessed
- hopeful: Optimistic, expectant, confident about future
- confused: Uncertain, perplexed, unclear
- overwhelmed: Too much to handle, swamped

INSTRUCTIONS:
1. Read the journal entry carefully
2. Identify the dominant emotional tone
3. Consider both explicit emotional words and implicit emotional context
4. Choose the single most accurate mood from the list above
5. Provide a confidence score (0.0-1.0)
6. Give a brief explanation for your choice

JOURNAL ENTRY:
Title: ${title}
Content: ${content}

Respond with ONLY valid JSON in this format:
{
  "mood": "detected-mood-key",
  "confidence": 0.85,
  "explanation": "Brief explanation of why this mood was detected"
}`;

      const result = await model.generateContent(moodPrompt);
      const response = await result.response;
      let text = response.text().trim();

      // Clean the response to extract JSON
      if (text.startsWith('```json')) {
        text = text.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const moodResult = JSON.parse(text);

      // Validate the detected mood
      const validMoods = [
        'very-happy', 'happy', 'content', 'neutral', 'slightly-sad', 'sad', 'very-sad',
        'anxious', 'stressed', 'angry', 'frustrated', 'excited', 'grateful', 
        'hopeful', 'confused', 'overwhelmed'
      ];

      if (!validMoods.includes(moodResult.mood)) {
        // Fallback to neutral if invalid mood detected
        return {
          mood: 'neutral',
          confidence: 0.5,
          explanation: 'Could not determine specific mood, defaulting to neutral'
        };
      }

      return {
        mood: moodResult.mood,
        confidence: Math.max(0, Math.min(1, moodResult.confidence || 0.5)),
        explanation: moodResult.explanation || 'Mood detected from content analysis'
      };

    } catch (error) {
      console.error('Mood detection error:', error);
      
      // Fallback to neutral mood
      return {
        mood: 'neutral',
        confidence: 0.5,
        explanation: 'Error in mood detection, defaulting to neutral',
        error: error.message
      };
    }
  }

  /**
   * Simple friendly chat with the AI (for chat UI)
   * @param {string} prompt - The prompt to send to the AI
   * @returns {Promise<string>} AI's friendly reply
   */
  async simpleChat(prompt) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('AI chat error:', error);
      return 'Sorry, I could not respond right now.';
    }
  }
}

module.exports = new AIService();