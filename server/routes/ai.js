const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const { authenticateToken } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// @route   POST /api/ai/analyze/:entryId
// @desc    Analyze a journal entry for cognitive distortions
// @access  Private
router.post('/analyze/:entryId', authenticateToken, async (req, res) => {
  try {
    const { entryId } = req.params;

    // Find the journal entry
    const entry = await JournalEntry.findOne({
      _id: entryId,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    // Check if already processed recently (within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (entry.aiAnalysis.processed && entry.aiAnalysis.processedAt > oneHourAgo) {
      return res.json({
        message: 'Entry already analyzed recently',
        analysis: entry.aiAnalysis,
        supportiveMessage: aiService.generateSupportiveMessage(entry.aiAnalysis)
      });
    }

    // Perform AI analysis
    const analysis = await aiService.analyzeJournalEntry(
      entry.content,
      entry.title,
      entry.mood
    );

    // Check for analysis errors
    if (analysis.error) {
      entry.aiAnalysis.processingError = analysis.message;
      await entry.save();

      return res.status(500).json({
        message: 'AI analysis failed',
        error: analysis.message
      });
    }

    // Update entry with analysis results
    entry.aiAnalysis = {
      processed: true,
      distortions: analysis.distortions,
      reframes: analysis.reframes,
      overallSentiment: analysis.overallSentiment,
      keyThemes: analysis.keyThemes,
      processedAt: new Date(),
      processingError: null
    };

    await entry.save();

    // Generate supportive message
    const supportiveMessage = aiService.generateSupportiveMessage(analysis);

    res.json({
      message: 'Analysis completed successfully',
      analysis: entry.aiAnalysis,
      supportiveMessage
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({
      message: 'Server error during AI analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/ai/batch-analyze
// @desc    Analyze multiple unprocessed journal entries
// @access  Private
router.post('/batch-analyze', authenticateToken, async (req, res) => {
  try {
    const { limit = 5 } = req.body;

    // Find unprocessed entries
    const entries = await JournalEntry.find({
      userId: req.user._id,
      'aiAnalysis.processed': false
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    if (entries.length === 0) {
      return res.json({
        message: 'No unprocessed entries found',
        processedCount: 0
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each entry
    for (const entry of entries) {
      try {
        const analysis = await aiService.analyzeJournalEntry(
          entry.content,
          entry.title,
          entry.mood
        );

        if (analysis.error) {
          entry.aiAnalysis.processingError = analysis.message;
          errorCount++;
        } else {
          entry.aiAnalysis = {
            processed: true,
            distortions: analysis.distortions,
            reframes: analysis.reframes,
            overallSentiment: analysis.overallSentiment,
            keyThemes: analysis.keyThemes,
            processedAt: new Date(),
            processingError: null
          };
          successCount++;
        }

        await entry.save();

        results.push({
          entryId: entry._id,
          title: entry.title,
          success: !analysis.error,
          distortionCount: analysis.distortions ? analysis.distortions.length : 0,
          error: analysis.error ? analysis.message : null
        });

        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing entry ${entry._id}:`, error);
        errorCount++;
        results.push({
          entryId: entry._id,
          title: entry.title,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      message: `Batch analysis completed. ${successCount} successful, ${errorCount} errors.`,
      processedCount: entries.length,
      successCount,
      errorCount,
      results
    });

  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({
      message: 'Server error during batch analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/ai/distortions
// @desc    Get information about cognitive distortions
// @access  Private
router.get('/distortions', authenticateToken, (req, res) => {
  try {
    const distortions = Object.entries(aiService.getDistortionInfo()).map(([key, info]) => ({
      type: key,
      name: info.name,
      description: info.description
    }));

    res.json({
      distortions
    });

  } catch (error) {
    console.error('Get distortions error:', error);
    res.status(500).json({
      message: 'Server error while fetching distortion information'
    });
  }
});

// @route   GET /api/ai/status
// @desc    Check AI service status
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const isConnected = await aiService.testConnection();
    
    res.json({
      status: isConnected ? 'connected' : 'disconnected',
      service: 'Google Gemini 2.0 Flash',
      features: [
        'Cognitive distortion detection',
        'Thought reframing',
        'Sentiment analysis',
        'Theme identification'
      ]
    });

  } catch (error) {
    console.error('AI status check error:', error);
    res.status(500).json({
      message: 'Server error while checking AI status',
      status: 'error'
    });
  }
});

// @route   POST /api/ai/reanalyze/:entryId
// @desc    Force re-analysis of a journal entry
// @access  Private
router.post('/reanalyze/:entryId', authenticateToken, async (req, res) => {
  try {
    const { entryId } = req.params;

    // Find the journal entry
    const entry = await JournalEntry.findOne({
      _id: entryId,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    // Reset analysis data
    entry.aiAnalysis = {
      processed: false,
      distortions: [],
      reframes: [],
      overallSentiment: undefined,
      keyThemes: [],
      processedAt: undefined,
      processingError: null
    };

    // Perform fresh AI analysis
    const analysis = await aiService.analyzeJournalEntry(
      entry.content,
      entry.title,
      entry.mood
    );

    // Check for analysis errors
    if (analysis.error) {
      entry.aiAnalysis.processingError = analysis.message;
      await entry.save();

      return res.status(500).json({
        message: 'AI re-analysis failed',
        error: analysis.message
      });
    }

    // Update entry with new analysis results
    entry.aiAnalysis = {
      processed: true,
      distortions: analysis.distortions,
      reframes: analysis.reframes,
      overallSentiment: analysis.overallSentiment,
      keyThemes: analysis.keyThemes,
      processedAt: new Date(),
      processingError: null
    };

    await entry.save();

    // Generate supportive message
    const supportiveMessage = aiService.generateSupportiveMessage(analysis);

    res.json({
      message: 'Re-analysis completed successfully',
      analysis: entry.aiAnalysis,
      supportiveMessage
    });

  } catch (error) {
    console.error('AI re-analysis error:', error);
    res.status(500).json({
      message: 'Server error during AI re-analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/ai/detect-mood
// @desc    Detect mood from journal content using AI
// @access  Private
router.post('/detect-mood', authenticateToken, async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: 'Content is required for mood detection'
      });
    }

    // Minimum content length for reliable mood detection
    if (content.trim().length < 10) {
      return res.status(400).json({
        message: 'Content too short for reliable mood detection. Please write at least a few words.'
      });
    }

    // Detect mood using AI
    const moodResult = await aiService.detectMood(content, title || '');

    res.json({
      message: 'Mood detected successfully',
      mood: moodResult.mood,
      confidence: moodResult.confidence,
      explanation: moodResult.explanation,
      error: moodResult.error || null
    });

  } catch (error) {
    console.error('Mood detection error:', error);
    res.status(500).json({
      message: 'Server error during mood detection',
      mood: 'neutral',
      confidence: 0.5,
      explanation: 'Error occurred during mood detection, defaulting to neutral',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/ai/chat
// @desc    Friendly AI chat for journal entry
// @access  Private
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, entryId } = req.body;
    if (!message) return res.status(400).json({ reply: 'Please send a message.' });

    // Optionally fetch the entry for context
    let entry = null;
    if (entryId) {
      entry = await JournalEntry.findOne({ _id: entryId, userId: req.user._id });
    }

    // Compose a friendly prompt for the AI
    let prompt = `You are a supportive, friendly companion. Your friend just wrote this journal entry: "${entry ? entry.content : ''}". Now they say: "${message}". Respond warmly, like a friend, with encouragement and empathy.`;

    // Call your AI service (replace with your actual AI call)
    const aiResponse = await aiService.simpleChat(prompt);

    res.json({ reply: aiResponse });
  } catch (err) {
    res.status(500).json({ reply: 'Sorry, I could not respond right now.' });
  }
});

module.exports = router;