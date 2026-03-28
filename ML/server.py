from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import os

# -----------------------------
# 1️⃣ Load trained ML model
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "rf_pipeline.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

rf_pipe = joblib.load(MODEL_PATH)

# -----------------------------
# 2️⃣ FastAPI app
# -----------------------------
app = FastAPI(title="Fake Review ML API")

# -----------------------------
# 3️⃣ Input Schema
# -----------------------------
class ReviewRequest(BaseModel):
    stars: int
    content: str
    cool: int = 0
    useful: int = 0
    funny: int = 0

# -----------------------------
# 4️⃣ Output Schema
# -----------------------------
class ReviewResponse(BaseModel):
    aiScore: float
    confidence: float
    model_confidence: float
    rule_confidence: float
    rule_score: int
    hybrid_score: float
    label: str
    hybrid_label: int
    agentic_action: str

# -----------------------------
# 5️⃣ Feature Engineering
# -----------------------------
def calculate_features(data: ReviewRequest):

    review_length = len(data.content)
    word_count = len(data.content.split())
    avg_word_length = review_length / (word_count + 1)

    engagement = data.cool + data.useful + data.funny
    engagement_ratio = engagement / (review_length + 1)

    extreme_rating = 1 if data.stars in [1, 5] else 0

    text_lower = data.content.lower()

    has_spam_words = int(any(word in text_lower for word in [
        "buy now", "limited offer", "click here", "free", "discount"
    ]))

    exclamation_count = data.content.count("!")
    uppercase_ratio = sum(1 for c in data.content if c.isupper()) / (len(data.content) + 1)

    features = pd.DataFrame([{
        "stars": data.stars,
        "cool": data.cool,
        "useful": data.useful,
        "funny": data.funny,
        "review_length": review_length,
        "engagement": engagement,
        "word_count": word_count,
        "avg_word_length": avg_word_length,
        "engagement_ratio": engagement_ratio,
        "extreme_rating": extreme_rating,
        "has_spam_words": has_spam_words,
        "exclamation_count": exclamation_count,
        "uppercase_ratio": uppercase_ratio
    }])

    return features, review_length, word_count, engagement, extreme_rating

# -----------------------------
# 6️⃣ Rule Logic
# -----------------------------
def calculate_rule_score(review_length, word_count, engagement, extreme_rating):
    return (
        int(review_length < 20) +
        int(word_count < 5) +
        int(engagement == 0) +
        int(extreme_rating and word_count < 10)
    )

# -----------------------------
# 7️⃣ Hybrid Logic (FINAL FIX)
# -----------------------------
def hybrid_score(rule_score: float, ml_prob: float) -> float:
    normalized_rule = rule_score / 4
    return 0.4 * normalized_rule + 0.6 * ml_prob


def categorize_hybrid(score: float, ml_prob: float) -> int:
    # 🔥 FORCE mild zone based on ML uncertainty
    if 0.3 < ml_prob < 0.7:
        return 1   # Mild

    if score < 0.35:
        return 0   # Normal
    elif score < 0.75:
        return 1   # Mild
    else:
        return 2   # High


def agentic_decision(hybrid_label: int) -> str:
    if hybrid_label == 0:
        return "No action"
    elif hybrid_label == 1:
        return "Flag for manual review"
    else:
        return "Hide review & alert moderator"

# -----------------------------
# 8️⃣ API Endpoint
# -----------------------------
@app.post("/analyze", response_model=ReviewResponse)
def analyze_review(review: ReviewRequest):

    # 🔹 Feature extraction
    features, review_length, word_count, engagement, extreme_rating = calculate_features(review)

    # 🔹 Rule score
    rule_score = calculate_rule_score(review_length, word_count, engagement, extreme_rating)

    # 🔹 ML prediction
    ml_prob = float(rf_pipe.predict_proba(features)[:, 1][0])

    # -----------------------------
    # Confidence
    # -----------------------------
    model_confidence = max(ml_prob, 1 - ml_prob)
    rule_confidence = abs((rule_score / 4) - 0.5) * 2
    final_confidence = 0.7 * model_confidence + 0.3 * rule_confidence

    # -----------------------------
    # Hybrid scoring
    # -----------------------------
    score = hybrid_score(rule_score, ml_prob)
    hybrid_label = categorize_hybrid(score, ml_prob)

    # 🔹 Action
    action = agentic_decision(hybrid_label)

    if final_confidence < 0.6:
        action = "Needs human review"

    label = "fake" if hybrid_label == 2 else "real"

    # -----------------------------
    # Response
    # -----------------------------
    return {
        "aiScore": round(ml_prob, 3),
        "confidence": round(final_confidence * 100, 2),
        "model_confidence": round(model_confidence * 100, 2),
        "rule_confidence": round(rule_confidence * 100, 2),
        "rule_score": rule_score,
        "hybrid_score": round(score, 3),
        "label": label,
        "hybrid_label": hybrid_label,
        "agentic_action": action
    }