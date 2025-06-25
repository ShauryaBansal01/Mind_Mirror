const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const { authenticateToken } = require('../middleware/auth');
const { validateJournalEntry } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', authenticateToken, validateJournalEntry, async (req, res) => {
  try {
    const {
      title,
      content,
      mood,
      moodIntensity,
      tags,
      isImportant
    } = req.body;

    const journalEntry = new JournalEntry({
      userId: req.user._id,
      title,
      content,
      mood,
      moodIntensity: moodIntensity || 5,
      tags: tags || [],
      isImportant: isImportant || false
    });

    await journalEntry.save();

    res.status(201).json({
      message: 'Journal entry created successfully',
      entry: journalEntry
    });

  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({
      message: 'Server error while creating journal entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/journal
// @desc    Get user's journal entries with pagination and filters
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      mood,
      distortion,
      tag,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      important,
      resolved
    } = req.query;

    // Build filter object
    const filter = { userId: req.user._id };

    // Mood filter
    if (mood) {
      filter.mood = mood;
    }

    // Distortion filter
    if (distortion) {
      filter['aiAnalysis.distortions.type'] = distortion;
    }

    // Tag filter
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Search in title and content
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Important filter
    if (important !== undefined) {
      filter.isImportant = important === 'true';
    }

    // Resolved filter
    if (resolved !== undefined) {
      filter.isResolved = resolved === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const entries = await JournalEntry.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalEntries = await JournalEntry.countDocuments(filter);
    const totalPages = Math.ceil(totalEntries / parseInt(limit));

    res.json({
      entries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEntries,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({
      message: 'Server error while fetching journal entries',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/journal/summary
// @desc    Get journal entries summary (for dashboard)
// @access  Private
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const entries = await JournalEntry.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).lean();

    const summary = entries.map(entry => ({
      id: entry._id,
      title: entry.title,
      mood: entry.mood,
      moodIntensity: entry.moodIntensity,
      wordCount: entry.metadata.wordCount,
      hasDistortions: entry.aiAnalysis.distortions.length > 0,
      distortionCount: entry.aiAnalysis.distortions.length,
      isImportant: entry.isImportant,
      isResolved: entry.isResolved,
      createdAt: entry.createdAt
    }));

    res.json({
      summary,
      totalEntries: summary.length
    });

  } catch (error) {
    console.error('Get journal summary error:', error);
    res.status(500).json({
      message: 'Server error while fetching journal summary',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/journal/:id
// @desc    Get a specific journal entry
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    res.json({
      entry
    });

  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json({
      message: 'Server error while fetching journal entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', authenticateToken, validateJournalEntry, async (req, res) => {
  try {
    const {
      title,
      content,
      mood,
      moodIntensity,
      tags,
      isImportant,
      isResolved
    } = req.body;

    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    // Update fields
    entry.title = title;
    entry.content = content;
    entry.mood = mood;
    entry.moodIntensity = moodIntensity || entry.moodIntensity;
    entry.tags = tags || entry.tags;
    entry.isImportant = isImportant !== undefined ? isImportant : entry.isImportant;
    entry.isResolved = isResolved !== undefined ? isResolved : entry.isResolved;

    // If content changed, reset AI analysis
    if (entry.isModified('content')) {
      entry.aiAnalysis.processed = false;
      entry.aiAnalysis.distortions = [];
      entry.aiAnalysis.reframes = [];
      entry.aiAnalysis.overallSentiment = undefined;
      entry.aiAnalysis.keyThemes = [];
      entry.aiAnalysis.processedAt = undefined;
      entry.aiAnalysis.processingError = undefined;
    }

    await entry.save();

    res.json({
      message: 'Journal entry updated successfully',
      entry
    });

  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({
      message: 'Server error while updating journal entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        message: 'Journal entry not found'
      });
    }

    res.json({
      message: 'Journal entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({
      message: 'Server error while deleting journal entry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/journal/tags/all
// @desc    Get all unique tags used by the user
// @access  Private
router.get('/tags/all', authenticateToken, async (req, res) => {
  try {
    const tags = await JournalEntry.distinct('tags', { userId: req.user._id });
    
    res.json({
      tags: tags.filter(tag => tag && tag.trim() !== '')
    });

  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      message: 'Server error while fetching tags',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;