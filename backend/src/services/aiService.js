const axios = require("axios");

exports.analyzeReview = async (reviewData) => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/analyze", reviewData);
    return res.data; // ✅ USE FULL RESPONSE
  } catch (err) {
    console.error("AI error:", err.message);

    return {
      aiScore: 0.5,
      confidence: 50,
      model_confidence: 50,
      rule_confidence: 50,
      label: "real",
      hybrid_label: 0,
      agentic_action: "No action"
    };
  }
};