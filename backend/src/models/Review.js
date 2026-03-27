// models/Review.js
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
      required: false // optional, if you have businesses
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

    // ⚡ AI / Agentic AI fields
    aiScore: {
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
      enum: [0, 1, 2], // 0 = Normal, 1 = Mildly suspicious, 2 = Highly suspicious
      default: 0
    },
    status: {
      type: String,
      enum: ['visible', 'flagged', 'Hide review & alert moderator', 'Flag for manual review', 'No action'],
      default: 'visible'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Review', reviewSchema);