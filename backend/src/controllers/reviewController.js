// const Review = require('../models/Review');
// const { analyzeReview } = require('../services/aiService');


// // 📝 Submit Review
// exports.createReview = async (req, res) => {
//   try {
//     const { content, rating, cool = 0, useful = 0, funny = 0 } = req.body;

//     // 🔥 Call ML service
//     const aiResult = await analyzeReview({
//       stars: rating,
//       content,
//       cool,
//       useful,
//       funny
//     });

//     /*
//       aiResult =
//       {
//         aiScore,
//         confidence,
//         model_confidence,
//         rule_confidence,
//         label,
//         hybrid_label,
//         agentic_action
//       }
//     */

//     // 🧠 Fallbacks (for safety if ML misses fields)
//     const confidence = aiResult.confidence ?? 0;
//     const model_confidence = aiResult.model_confidence ?? 0;
//     const rule_confidence = aiResult.rule_confidence ?? 0;

//     // 📝 Create Review
//     const review = await Review.create({
//       user: req.user._id,
//       content,
//       rating,
//       cool,
//       useful,
//       funny,

//       // 🔥 AI DATA
//       aiScore: aiResult.aiScore,
//       confidence,
//       model_confidence,
//       rule_confidence,

//       label: aiResult.label,
//       hybrid_label: aiResult.hybrid_label,
//       status: aiResult.agentic_action
//     });

//     const populatedReview = await review.populate("user", "name email");

//     res.status(201).json({
//       success: true,
//       review: populatedReview
//     });

//   } catch (error) {
//     console.error("Create review error:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };


// // 📝 Get ALL Reviews (with optional filters)
// exports.getReviews = async (req, res) => {
//   try {
//     const { label, status, minConfidence, maxConfidence } = req.query;

//     let filter = {};

//     // 🔍 Filters
//     if (label) filter.label = label;
//     if (status) filter.status = status;

//     if (minConfidence || maxConfidence) {
//       filter.confidence = {};
//       if (minConfidence) filter.confidence.$gte = Number(minConfidence);
//       if (maxConfidence) filter.confidence.$lte = Number(maxConfidence);
//     }

//     const reviews = await Review.find(filter)
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });

//     res.json({
//       total: reviews.length,
//       reviews,
//     });

//   } catch (error) {
//     console.error("Get reviews error:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };


// // 📝 Get Review by ID
// exports.getReviewById = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id)
//       .populate("user", "name email");

//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     res.json(review);

//   } catch (error) {
//     console.error("Get review by ID error:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };



const Review = require('../models/Review');
const { analyzeReview } = require('../services/aiService');


// 📝 Submit Review
exports.createReview = async (req, res) => {
  try {
    const { content, rating, cool = 0, useful = 0, funny = 0 } = req.body;

    // 🔥 Call ML service
    const aiResult = await analyzeReview({
      stars: rating,
      content,
      cool,
      useful,
      funny
    });

    console.log("AI RESULT:", aiResult); // ✅ DEBUG (VERY IMPORTANT)

    /*
      Expected:
      {
        aiScore,
        confidence,
        model_confidence,
        rule_confidence,
        label,
        hybrid_label,
        agentic_action
      }
    */

    // 🧠 SAFE FALLBACKS
    const aiScore = aiResult.aiScore ?? 0;

    const confidence = aiResult.confidence ?? 0;
    const model_confidence = aiResult.model_confidence ?? 0;
    const rule_confidence = aiResult.rule_confidence ?? 0;

    const label = aiResult.label ?? "real";
    const hybrid_label = aiResult.hybrid_label ?? 0;
    const status = aiResult.agentic_action ?? "No action";

    // 📝 Create Review
    const review = await Review.create({
      user: req.user._id,
      content,
      rating,
      cool,
      useful,
      funny,

      // 🔥 AI DATA
      aiScore,
      confidence,
      model_confidence,
      rule_confidence,

      label,
      hybrid_label,
      status
    });

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


// 📝 Get ALL Reviews (with filters)
exports.getReviews = async (req, res) => {
  try {
    const { label, status, minConfidence, maxConfidence } = req.query;

    let filter = {};

    // 🔍 Label filter
    if (label && label !== "All") {
      filter.label = label;
    }

    // 🔍 Status filter
    if (status && status !== "All") {
      filter.status = status;
    }

    // 🔍 Confidence filter
    if (minConfidence || maxConfidence) {
      filter.confidence = {};

      if (minConfidence)
        filter.confidence.$gte = Number(minConfidence);

      if (maxConfidence)
        filter.confidence.$lte = Number(maxConfidence);
    }

    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      total: reviews.length,
      reviews,
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

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);

  } catch (error) {
    console.error("Get review by ID error:", error.message);
    res.status(500).json({ message: error.message });
  }
};