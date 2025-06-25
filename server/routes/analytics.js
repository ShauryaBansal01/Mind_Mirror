const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/mood-trends
// @desc    Get user's mood trends over time
// @access  Private
router.get('/mood-trends', authenticateToken, async (req, res) => {
  try {
    const { days = 30, groupBy = 'day' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let groupFormat;
    switch (groupBy) {
      case 'week':
        groupFormat = "%Y-W%U";
        break;
      case 'month':
        groupFormat = "%Y-%m";
        break;
      default:
        groupFormat = "%Y-%m-%d";
    }

    const moodTrends = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: groupFormat, date: "$createdAt" } },
            mood: "$mood"
          },
          count: { $sum: 1 },
          avgIntensity: { $avg: "$moodIntensity" },
          entries: { $push: { title: "$title", createdAt: "$createdAt" } }
        }
      },
      {
        $group: {
          _id: "$_id.period",
          moods: {
            $push: {
              mood: "$_id.mood",
              count: "$count",
              avgIntensity: "$avgIntensity",
              entries: "$entries"
            }
          },
          totalEntries: { $sum: "$count" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json({
      moodTrends,
      period: `${days} days`,
      groupBy
    });

  } catch (error) {
    console.error('Mood trends error:', error);
    res.status(500).json({
      message: 'Server error while fetching mood trends',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/analytics/distortion-patterns
// @desc    Get user's cognitive distortion patterns
// @access  Private
router.get('/distortion-patterns', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const distortionPatterns = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate },
          'aiAnalysis.processed': true
        }
      },
      {
        $unwind: "$aiAnalysis.distortions"
      },
      {
        $group: {
          _id: "$aiAnalysis.distortions.type",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$aiAnalysis.distortions.confidence" },
          examples: {
            $push: {
              snippet: "$aiAnalysis.distortions.textSnippet",
              explanation: "$aiAnalysis.distortions.explanation",
              entryTitle: "$title",
              date: "$createdAt"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          avgConfidence: 1,
          examples: { $slice: ["$examples", 3] } // Limit to 3 examples
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get distortion trends over time
    const distortionTrends = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate },
          'aiAnalysis.processed': true
        }
      },
      {
        $unwind: "$aiAnalysis.distortions"
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            distortion: "$aiAnalysis.distortions.type"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          distortions: {
            $push: {
              type: "$_id.distortion",
              count: "$count"
            }
          },
          totalDistortions: { $sum: "$count" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json({
      distortionPatterns,
      distortionTrends,
      period: `${days} days`
    });

  } catch (error) {
    console.error('Distortion patterns error:', error);
    res.status(500).json({
      message: 'Server error while fetching distortion patterns',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/analytics/writing-insights
// @desc    Get user's writing and journaling insights
// @access  Private
router.get('/writing-insights', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const insights = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalWords: { $sum: "$metadata.wordCount" },
          avgWordsPerEntry: { $avg: "$metadata.wordCount" },
          totalReadingTime: { $sum: "$metadata.readingTime" },
          avgReadingTime: { $avg: "$metadata.readingTime" },
          mostCommonMood: { $first: "$mood" }, // This will be refined below
          entriesWithDistortions: {
            $sum: {
              $cond: [{ $gt: [{ $size: "$aiAnalysis.distortions" }, 0] }, 1, 0]
            }
          },
          importantEntries: { $sum: { $cond: ["$isImportant", 1, 0] } },
          resolvedEntries: { $sum: { $cond: ["$isResolved", 1, 0] } }
        }
      }
    ]);

    // Get most common mood separately
    const moodStats = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      }
    ]);

    // Get writing frequency by day of week
    const writingFrequency = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Get most used tags
    const topTags = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: "$tags"
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get sentiment distribution
    const sentimentDistribution = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate },
          'aiAnalysis.processed': true
        }
      },
      {
        $group: {
          _id: "$aiAnalysis.overallSentiment",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const result = {
      summary: insights[0] || {
        totalEntries: 0,
        totalWords: 0,
        avgWordsPerEntry: 0,
        totalReadingTime: 0,
        avgReadingTime: 0,
        entriesWithDistortions: 0,
        importantEntries: 0,
        resolvedEntries: 0
      },
      mostCommonMood: moodStats[0] ? moodStats[0]._id : null,
      writingFrequency: writingFrequency.map(item => ({
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][item._id - 1],
        count: item.count
      })),
      topTags,
      sentimentDistribution,
      period: `${days} days`
    };

    res.json(result);

  } catch (error) {
    console.error('Writing insights error:', error);
    res.status(500).json({
      message: 'Server error while fetching writing insights',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/analytics/progress-tracking
// @desc    Get user's mental health progress indicators
// @access  Private
router.get('/progress-tracking', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Compare current period with previous period
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(days));

    // Current period stats
    const currentStats = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgMoodIntensity: { $avg: "$moodIntensity" },
          distortionRate: {
            $avg: {
              $cond: [
                { $gt: [{ $size: "$aiAnalysis.distortions" }, 0] },
                { $size: "$aiAnalysis.distortions" },
                0
              ]
            }
          },
          resolutionRate: {
            $avg: { $cond: ["$isResolved", 1, 0] }
          },
          positiveEntries: {
            $sum: {
              $cond: [
                { $in: ["$mood", ["very-happy", "happy", "content", "grateful", "hopeful", "excited"]] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Previous period stats
    const previousStats = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: previousStartDate, $lt: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgMoodIntensity: { $avg: "$moodIntensity" },
          distortionRate: {
            $avg: {
              $cond: [
                { $gt: [{ $size: "$aiAnalysis.distortions" }, 0] },
                { $size: "$aiAnalysis.distortions" },
                0
              ]
            }
          },
          resolutionRate: {
            $avg: { $cond: ["$isResolved", 1, 0] }
          },
          positiveEntries: {
            $sum: {
              $cond: [
                { $in: ["$mood", ["very-happy", "happy", "content", "grateful", "hopeful", "excited"]] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Calculate progress indicators
    const current = currentStats[0] || {};
    const previous = previousStats[0] || {};

    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const progressIndicators = {
      journalingConsistency: {
        current: current.totalEntries || 0,
        previous: previous.totalEntries || 0,
        change: calculateChange(current.totalEntries, previous.totalEntries),
        trend: current.totalEntries > previous.totalEntries ? 'improving' : 'declining'
      },
      moodStability: {
        current: current.avgMoodIntensity || 0,
        previous: previous.avgMoodIntensity || 0,
        change: calculateChange(current.avgMoodIntensity, previous.avgMoodIntensity),
        trend: current.avgMoodIntensity > previous.avgMoodIntensity ? 'improving' : 'stable'
      },
      cognitiveHealth: {
        current: current.distortionRate || 0,
        previous: previous.distortionRate || 0,
        change: calculateChange(current.distortionRate, previous.distortionRate),
        trend: current.distortionRate < previous.distortionRate ? 'improving' : 'needs-attention'
      },
      problemResolution: {
        current: current.resolutionRate || 0,
        previous: previous.resolutionRate || 0,
        change: calculateChange(current.resolutionRate, previous.resolutionRate),
        trend: current.resolutionRate > previous.resolutionRate ? 'improving' : 'stable'
      },
      positivityRatio: {
        current: current.totalEntries > 0 ? (current.positiveEntries / current.totalEntries) : 0,
        previous: previous.totalEntries > 0 ? (previous.positiveEntries / previous.totalEntries) : 0,
        change: calculateChange(
          current.totalEntries > 0 ? (current.positiveEntries / current.totalEntries) : 0,
          previous.totalEntries > 0 ? (previous.positiveEntries / previous.totalEntries) : 0
        ),
        trend: (current.positiveEntries / current.totalEntries) > (previous.positiveEntries / previous.totalEntries) ? 'improving' : 'stable'
      }
    };

    res.json({
      progressIndicators,
      period: `${days} days`,
      comparisonPeriod: `Previous ${days} days`
    });

  } catch (error) {
    console.error('Progress tracking error:', error);
    res.status(500).json({
      message: 'Server error while fetching progress tracking data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get comprehensive dashboard data
// @access  Private
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { days = 7 } = req.query; // Default to 7 days for dashboard

    // Get recent entries summary
    const recentEntries = await JournalEntry.find({
      userId: req.user._id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title mood moodIntensity aiAnalysis.distortions createdAt isImportant')
    .lean();

    // Get quick stats
    const quickStats = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgMoodIntensity: { $avg: "$moodIntensity" },
          totalDistortions: {
            $sum: { $size: "$aiAnalysis.distortions" }
          },
          processedEntries: {
            $sum: { $cond: ["$aiAnalysis.processed", 1, 0] }
          }
        }
      }
    ]);

    // Get mood distribution for the period
    const moodDistribution = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const stats = quickStats[0] || {
      totalEntries: 0,
      avgMoodIntensity: 0,
      totalDistortions: 0,
      processedEntries: 0
    };

    res.json({
      recentEntries,
      quickStats: stats,
      moodDistribution,
      period: `${days} days`
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      message: 'Server error while fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/analytics/cognitive-distortions
// @desc    Get user's cognitive distortions summary (for frontend compatibility)
// @access  Private
router.get('/cognitive-distortions', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const distortions = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate },
          'aiAnalysis.processed': true
        }
      },
      { $unwind: "$aiAnalysis.distortions" },
      {
        $group: {
          _id: "$aiAnalysis.distortions.type",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$aiAnalysis.distortions.confidence" }
        }
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          count: 1,
          avgConfidence: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ distortions });
  } catch (error) {
    console.error('Cognitive distortions error:', error);
    res.status(500).json({
      message: 'Server error while fetching cognitive distortions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/analytics/journal-stats
// @desc    Get user's journal stats summary (for frontend compatibility)
// @access  Private
router.get('/journal-stats', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Total entries, avg mood score, streak, improvement rate
    const stats = await JournalEntry.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgMoodScore: { $avg: "$moodIntensity" },
          firstEntry: { $min: "$createdAt" },
          lastEntry: { $max: "$createdAt" }
        }
      }
    ]);

    // Calculate streak (consecutive days with entries)
    let streakDays = 0;
    if (stats[0]) {
      const entries = await JournalEntry.find({
        userId: req.user._id,
        createdAt: { $gte: startDate }
      }).sort({ createdAt: -1 }).select('createdAt');
      let lastDate = null;
      for (const entry of entries) {
        const entryDate = entry.createdAt;
        if (!lastDate) {
          lastDate = entryDate;
          streakDays = 1;
        } else {
          const diff = Math.floor((lastDate - entryDate) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streakDays++;
            lastDate = entryDate;
          } else if (diff > 1) {
            break;
          }
        }
      }
    }

    // Improvement rate: compare avg mood score to previous period
    let improvementRate = 0;
    if (stats[0]) {
      const prevStart = new Date(startDate);
      prevStart.setDate(prevStart.getDate() - parseInt(days));
      const prevStats = await JournalEntry.aggregate([
        {
          $match: {
            userId: req.user._id,
            createdAt: { $gte: prevStart, $lt: startDate }
          }
        },
        {
          $group: {
            _id: null,
            avgMoodScore: { $avg: "$moodIntensity" }
          }
        }
      ]);
      if (prevStats[0] && prevStats[0].avgMoodScore) {
        improvementRate = ((stats[0].avgMoodScore - prevStats[0].avgMoodScore) / prevStats[0].avgMoodScore) * 100;
      }
    }

    res.json({
      totalEntries: stats[0]?.totalEntries || 0,
      avgMoodScore: stats[0]?.avgMoodScore || 0,
      streakDays,
      improvementRate: Number(improvementRate.toFixed(1))
    });
  } catch (error) {
    console.error('Journal stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching journal stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;