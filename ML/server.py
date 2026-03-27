# ML/server.py
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import os

# -----------------------------
# 1️⃣ Load trained ML model & set thresholds
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "rf_pipeline.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

rf_pipe = joblib.load(MODEL_PATH)  # RandomForest pipeline

# Hybrid thresholds
THRESHOLD_LOW = 0.5
THRESHOLD_HIGH = 1.5

# -----------------------------
# FastAPI app
# -----------------------------
app = FastAPI(title="Fake Review ML API")

# -----------------------------
# 2️⃣ Input schema
# -----------------------------
class ReviewRequest(BaseModel):
    stars: int
    content: str
    cool: int = 0
    useful: int = 0
    funny: int = 0

# -----------------------------
# 3️⃣ Helper functions
# -----------------------------
def calculate_features(data: ReviewRequest) -> pd.DataFrame:
    """Compute numeric features for ML model from review content"""
    review_length = len(data.content)
    word_count = len(data.content.split())
    avg_word_length = review_length / (word_count + 1)
    engagement = data.cool + data.useful + data.funny
    engagement_ratio = engagement / (review_length + 1)
    extreme_rating = 1 if data.stars in [1, 5] else 0

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
        "extreme_rating": extreme_rating
    }])
    return features, review_length, word_count, engagement, extreme_rating

def hybrid_score(rule_score: float, ml_prob: float) -> float:
    """Combine rule-based score and ML probability"""
    return 0.5 * rule_score + 0.5 * ml_prob

def categorize_hybrid(score: float) -> int:
    """Convert continuous hybrid score into discrete label"""
    if score <= THRESHOLD_LOW:
        return 0  # Normal
    elif score <= THRESHOLD_HIGH:
        return 1  # Mildly suspicious
    else:
        return 2  # Highly suspicious

def agentic_decision(hybrid_label: int) -> str:
    """Map hybrid label to agentic action"""
    if hybrid_label == 0:
        return "No action"
    elif hybrid_label == 1:
        return "Flag for manual review"
    else:
        return "Hide review & alert moderator"

# -----------------------------
# 4️⃣ API endpoint
# -----------------------------
@app.post("/analyze")
def analyze_review(review: ReviewRequest):
    # Compute features
    features, review_length, word_count, engagement, extreme_rating = calculate_features(review)

    # Rule-based suspicious score
    suspicious_score_v2 = int(review_length < 50) + int(word_count < 10) + int(engagement == 0) + int(extreme_rating)

    # ML probability
    ml_prob = float(rf_pipe.predict_proba(features)[:, 1][0])

    # Hybrid scoring
    score = hybrid_score(suspicious_score_v2, ml_prob)
    hybrid_label = categorize_hybrid(score)
    action = agentic_decision(hybrid_label)

    # Final label
    label = "fake" if hybrid_label >= 1 else "real"

    return {
        "aiScore": round(ml_prob, 3),
        "rule_score": suspicious_score_v2,
        "hybrid_score": round(score, 3),
        "label": label,
        "hybrid_label": hybrid_label,
        "agentic_action": action
    }