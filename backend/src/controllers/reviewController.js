// controllers/reviewController.js
const Review = require('../models/Review');
const { analyzeReview } = require('../services/aiService');

// 📝 Submit Review
exports.createReview = async (req, res) => {
  try {
    const { content, rating, cool = 0, useful = 0, funny = 0 } = req.body;

    // 1️⃣ Call AI service to get ML + agentic predictions
    const aiResult = await analyzeReview({
      stars: rating,
      content,
      cool,
      useful,
      funny
    });

    /*
      aiResult = {
        aiScore: 0.82,
        label: "fake",
        hybrid_label: 2,
        agentic_action: "Hide review & alert moderator"
      }
    */

    // 2️⃣ Create review document
    const review = await Review.create({
      user: req.user._id,
      content,
      rating,
      cool,
      useful,
      funny,
      aiScore: aiResult.aiScore,
      label: aiResult.label,
      hybrid_label: aiResult.hybrid_label,
      status: aiResult.agentic_action // fully aligned with Agentic AI
    });

    // 3️⃣ Optional: populate user details
    const populatedReview = await review.populate("user", "name email");

    res.status(201).json({
      success: true,
      review: populatedReview
    });

  } catch (error) {
    console.error("Create review error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📝 Get Reviews (with pagination & filtering)
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 5, label, status } = req.query;

    // Build filter
    let filter = {};
    if (label) filter.label = label; // "real" / "fake"
    if (status) filter.status = status; // Agentic AI status

    // Fetch reviews
    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Total count
    const total = await Review.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      reviews
    });

  } catch (error) {
    console.error("Get reviews error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// 📝 Get Review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name email");

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json(review);

  } catch (error) {
    console.error("Get review by ID error:", error.message);
    res.status(500).json({ message: error.message });
  }
};