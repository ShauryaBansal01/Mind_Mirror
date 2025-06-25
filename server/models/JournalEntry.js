const mongoose = require('mongoose');

// Define cognitive distortion types based on CBT principles
const COGNITIVE_DISTORTIONS = [
  'all-or-nothing',      // Black and white thinking
  'overgeneralization',  // Drawing broad conclusions from single events
  'mental-filter',       // Focusing only on negatives
  'disqualifying-positive', // Dismissing positive experiences
  'jumping-to-conclusions', // Mind reading or fortune telling
  'magnification',       // Catastrophizing or minimizing
  'emotional-reasoning', // Assuming feelings reflect reality
  'should-statements',   // Unrealistic expectations
  'labeling',           // Negative self-labeling
  'personalization',    // Taking responsibility for things outside control
  'comparison',         // Unfair comparisons to others
  'blame'               // Blaming self or others excessively
];

const MOOD_TYPES = [
  'very-happy',
  'happy',
  'content',
  'neutral',
  'slightly-sad',
  'sad',
  'very-sad',
  'anxious',
  'stressed',
  'angry',
  'frustrated',
  'excited',
  'grateful',
  'hopeful',
  'confused',
  'overwhelmed'
];

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Entry title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Entry content is required'],
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10,000 characters']
  },
  mood: {
    type: String,
    enum: MOOD_TYPES,
    required: [true, 'Mood selection is required']
  },
  moodIntensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isImportant: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  aiAnalysis: {
    processed: {
      type: Boolean,
      default: false
    },
    distortions: [{
      type: {
        type: String,
        enum: COGNITIVE_DISTORTIONS
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      explanation: {
        type: String,
        maxlength: [500, 'Explanation cannot exceed 500 characters']
      },
      textSnippet: {
        type: String,
        maxlength: [200, 'Text snippet cannot exceed 200 characters']
      }
    }],
    reframes: [{
      originalThought: {
        type: String,
        maxlength: [500, 'Original thought cannot exceed 500 characters']
      },
      reframedThought: {
        type: String,
        maxlength: [500, 'Reframed thought cannot exceed 500 characters']
      },
      technique: {
        type: String,
        maxlength: [100, 'Technique name cannot exceed 100 characters']
      }
    }],
    overallSentiment: {
      type: String,
      enum: ['very-negative', 'negative', 'neutral', 'positive', 'very-positive']
    },
    keyThemes: [{
      type: String,
      maxlength: [50, 'Theme cannot exceed 50 characters']
    }],
    processedAt: {
      type: Date
    },
    processingError: {
      type: String
    }
  },
  privacy: {
    isPrivate: {
      type: Boolean,
      default: true
    },
    shareWithTherapist: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    wordCount: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number, // in minutes
      default: 0
    },
    editCount: {
      type: Number,
      default: 0
    },
    lastEditedAt: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
journalEntrySchema.index({ userId: 1, createdAt: -1 });
journalEntrySchema.index({ userId: 1, mood: 1 });
journalEntrySchema.index({ userId: 1, 'aiAnalysis.distortions.type': 1 });
journalEntrySchema.index({ userId: 1, tags: 1 });

// Pre-save middleware to update metadata
journalEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate word count
  if (this.isModified('content')) {
    this.metadata.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
    this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200); // Average reading speed
    
    if (this.metadata.editCount === undefined) {
      this.metadata.editCount = 0;
    } else {
      this.metadata.editCount += 1;
    }
    this.metadata.lastEditedAt = Date.now();
  }
  
  next();
});

// Instance method to get entry summary
journalEntrySchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    mood: this.mood,
    moodIntensity: this.moodIntensity,
    wordCount: this.metadata.wordCount,
    hasDistortions: this.aiAnalysis.distortions.length > 0,
    distortionCount: this.aiAnalysis.distortions.length,
    isImportant: this.isImportant,
    isResolved: this.isResolved,
    createdAt: this.createdAt
  };
};

// Static method to get user's mood trends
journalEntrySchema.statics.getMoodTrends = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          mood: "$mood"
        },
        count: { $sum: 1 },
        avgIntensity: { $avg: "$moodIntensity" }
      }
    },
    {
      $sort: { "_id.date": 1 }
    }
  ]);
};

// Static method to get distortion analytics
journalEntrySchema.statics.getDistortionAnalytics = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
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
        avgConfidence: { $avg: "$aiAnalysis.distortions.confidence" }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('JournalEntry', journalEntrySchema);