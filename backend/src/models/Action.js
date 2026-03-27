const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema(
  {
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true
    },
    actionType: {
      type: String,
      enum: ['flag', 'hide', 'allow'],
      required: true
    },
    reason: {
      type: String
    },
    performedBy: {
      type: String,
      enum: ['ai', 'admin'],
      default: 'ai'
    }
  },
  { timestamps: true }
);

actionSchema.index({ review: 1 });

module.exports = mongoose.model('Action', actionSchema);