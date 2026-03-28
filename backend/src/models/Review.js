const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: false
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    cool: {
      type: Number,
      default: 0
    },
    useful: {
      type: Number,
      default: 0
    },
    funny: {
      type: Number,
      default: 0
    },

    // 🔥 AI FIELDS
    aiScore: {
      type: Number,
      default: 0
    },

    confidence: {
      type: Number, // final hybrid confidence %
      default: 0
    },

    model_confidence: {
      type: Number,
      default: 0
    },

    rule_confidence: {
      type: Number,
      default: 0
    },
    hybrid_score: {
      type: Number,
      default: 0
    },

    label: {
      type: String,
      enum: ['real', 'fake'],
      default: 'real'
    },

    hybrid_label: {
      type: Number,
      enum: [0, 1, 2],
      default: 0
    },
    

    status: {
      type: String,
      enum: [
        'visible',
        'flagged',
        'Hide review & alert moderator',
        'Flag for manual review',
        'No action',
        'Needs human review' // ✅ NEW
      ],
      default: 'visible'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Review', reviewSchema);