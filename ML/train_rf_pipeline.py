# ML/train_rf_pipeline.py

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib

# -----------------------------
# 1️⃣ Set paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'yelp.csv')   # fixed path
MODEL_DIR = os.path.join(BASE_DIR, 'model')
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, 'rf_pipeline.pkl')

# -----------------------------
# 2️⃣ Load dataset
# -----------------------------
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")
df = pd.read_csv(DATA_PATH)

# -----------------------------
# 3️⃣ Feature engineering
# -----------------------------
df['review_length'] = df['text'].apply(len)
df['word_count'] = df['text'].apply(lambda x: len(x.split()))
df['avg_word_length'] = df['review_length'] / (df['word_count'] + 1)
df['engagement'] = df['cool'] + df['useful'] + df['funny']
df['engagement_ratio'] = df['engagement'] / (df['review_length'] + 1)
df['extreme_rating'] = df['stars'].apply(lambda x: 1 if x in [1, 5] else 0)

# Rule-based suspicious score
df['suspicious_score_v2'] = (
    (df['review_length'] < 50).astype(int) +
    (df['word_count'] < 10).astype(int) +
    (df['engagement'] == 0).astype(int) +
    df['extreme_rating'].astype(int)
)

# -----------------------------
# 4️⃣ Prepare features & target
# -----------------------------
numeric_features = [
    'stars', 'cool', 'useful', 'funny',
    'review_length', 'engagement', 'word_count',
    'avg_word_length', 'engagement_ratio', 'extreme_rating'
]

df['suspicious_binary'] = df['suspicious_score_v2'].apply(lambda x: 0 if x <= 1 else 1)
y = df['suspicious_binary']
X = df[numeric_features]

# -----------------------------
# 5️⃣ Train/test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# 6️⃣ Train Random Forest pipeline
# -----------------------------
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_pipe = Pipeline([
    ('classifier', rf_model)
])
rf_pipe.fit(X_train, y_train)

# -----------------------------
# 7️⃣ Save pipeline
# -----------------------------
joblib.dump(rf_pipe, MODEL_PATH)
print(f"Saved trained pipeline to {MODEL_PATH}")