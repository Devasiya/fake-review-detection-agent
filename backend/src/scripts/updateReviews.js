const mongoose = require("mongoose");
const Review = require("../models/Review");
const { analyzeReview } = require("../services/aiService");

require("dotenv").config();

async function updateReviews() {
  try {
    // 🔌 Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const reviews = await Review.find();
    console.log(`🔍 Found ${reviews.length} reviews`);

    for (let r of reviews) {
      try {
        console.log(`➡️ Updating review: ${r._id}`);

        const ai = await analyzeReview({
          stars: r.rating,
          content: r.content,
          cool: r.cool,
          useful: r.useful,
          funny: r.funny
        });

        console.log("AI:", ai); // ✅ DEBUG

        // ✅ SAFE ASSIGNMENTS (VERY IMPORTANT)
        r.aiScore = ai.aiScore ?? 0;
        r.confidence = ai.confidence ?? 0;
        r.model_confidence = ai.model_confidence ?? 0;
        r.rule_confidence = ai.rule_confidence ?? 0;
        r.hybrid_score = ai.hybrid_score ?? 0; 
        r.hybrid_label = ai.hybrid_label ?? 0;
        r.status = ai.agentic_action ?? "No action";

        await r.save();

      } catch (err) {
        console.error(`❌ Failed for review ${r._id}:`, err.message);
      }
    }

    console.log("✅ All reviews updated!");
    process.exit();

  } catch (err) {
    console.error("❌ Script error:", err.message);
    process.exit(1);
  }
}

updateReviews();