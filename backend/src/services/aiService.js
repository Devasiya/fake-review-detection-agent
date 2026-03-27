// services/aiService.js
const axios = require("axios");

exports.analyzeReview = async (reviewData) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/analyze", reviewData);
    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    // fallback: basic rule-based
    const text = reviewData.content.toLowerCase();
    let score = 0.2;
    if (text.includes("buy now")) score += 0.3;
    if (text.includes("limited offer")) score += 0.3;
    if (text.includes("click here")) score += 0.2;
    if (text.includes("!!!")) score += 0.2;
    if (score > 1) score = 1;
    return { aiScore: score, label: score > 0.7 ? "fake" : "real", hybrid_label: score > 0.7 ? 2 : 0, agentic_action: score > 0.7 ? "Hide review & alert moderator" : "No action" };
  }
};