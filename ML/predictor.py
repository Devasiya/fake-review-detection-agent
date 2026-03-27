# predictor.py
import joblib
import pandas as pd
import numpy as np

# ----------------------------
# Load trained Random Forest pipeline
# ----------------------------
MODEL_PATH = "model/rf_pipeline.pkl"
model = joblib.load(MODEL_PATH)  # trained pipeline (preprocessing + RF)

# ----------------------------
# Agentic layer functions
# ----------------------------
def categorize_hybrid(score):
    """
    Convert hybrid_score to discrete label
    0 = Normal, 1 = Mildly suspicious, 2 = Highly suspicious
    """
    if score <= 1:
        return 0
    elif score == 2:
        return 1
    else:
        return 2

def agentic_decision(hybrid_label):
    """
    Map hybrid_label to review action
    """
    if hybrid_label == 0:
        return "No action"
    elif hybrid_label == 1:
        return "Flag for manual review"
    else:
        return "Hide review & alert moderator"

# ----------------------------
# Main prediction function
# ----------------------------
def predict_review(review_features: dict):
    """
    review_features: dict containing numeric/categorical features
    Example:
    {
        'stars': 5,
        'cool': 0,
        'useful': 1,
        'funny': 0,
        'review_length': 120,
        'engagement': 1,
        'word_count': 20,
        'avg_word_length': 6.0,
        'engagement_ratio': 0.008,
        'extreme_rating': 1,
        'type': 'review'
    }
    Returns: dict with aiScore, label, hybrid_label, agentic_action
    """
    # Convert dict to DataFrame (model expects 2D)
    df = pd.DataFrame([review_features])

    # ML probability (suspicious)
    try:
        ml_prob = model.predict_proba(df)[:, 1][0]
    except AttributeError:
        # fallback for models without predict_proba
        pred = model.predict(df)[0]
        ml_prob = 1.0 if pred == 1 else 0.0

    # Rule-based score
    suspicious_score_v2 = (
        int(df['review_length'][0] < 50) +
        int(df['word_count'][0] < 10) +
        int(df['engagement'][0] == 0) +
        int(df['extreme_rating'][0])
    )

    # Hybrid score (50% ML + 50% rule)
    hybrid_score = 0.5 * suspicious_score_v2 + 0.5 * ml_prob

    # Hybrid label
    hybrid_label = categorize_hybrid(round(hybrid_score))

    # Agentic action
    action = agentic_decision(hybrid_label)

    # Final label
    label = "fake" if ml_prob > 0.5 else "real"

    return {
        "aiScore": float(ml_prob),
        "label": label,
        "hybrid_label": hybrid_label,
        "agentic_action": action
    }