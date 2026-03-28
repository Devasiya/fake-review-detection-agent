# ML/train_rf_pipeline.py

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib

# -----------------------------
# 1️⃣ Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'yelp.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'model')
os.makedirs(MODEL_DIR, exist_ok=True)
MODEL_PATH = os.path.join(MODEL_DIR, 'rf_pipeline.pkl')

# -----------------------------
# 2️⃣ Load dataset
# -----------------------------
df = pd.read_csv(DATA_PATH)

# -----------------------------
# 3️⃣ Feature Engineering (NUMERIC)
# -----------------------------
df['review_length'] = df['text'].apply(len)
df['word_count'] = df['text'].apply(lambda x: len(x.split()))
df['avg_word_length'] = df['review_length'] / (df['word_count'] + 1)

df['engagement'] = df['cool'] + df['useful'] + df['funny']
df['engagement_ratio'] = df['engagement'] / (df['review_length'] + 1)

df['extreme_rating'] = df['stars'].apply(lambda x: 1 if x in [1, 5] else 0)

# -----------------------------
# 🔥 4️⃣ TEXT FEATURES (CRITICAL FIX)
# -----------------------------
def add_text_features(df):
    spam_words = ["buy now", "limited offer", "click here", "free", "discount"]

    df['has_spam_words'] = df['text'].str.lower().apply(
        lambda x: int(any(word in x for word in spam_words))
    )

    df['exclamation_count'] = df['text'].apply(lambda x: x.count("!"))

    df['uppercase_ratio'] = df['text'].apply(
        lambda x: sum(1 for c in x if c.isupper()) / (len(x) + 1)
    )

    return df

df = add_text_features(df)

# -----------------------------
# 🔥 5️⃣ LABEL CREATION (IMPROVED)
# -----------------------------
def create_label(row):
    text = row['text'].lower()

    # strong spam signals
    if any(word in text for word in ["buy now", "limited offer", "click here"]):
        return 1

    if text.count("!") >= 3:
        return 1

    # weak suspicious patterns
    if row['has_spam_words'] == 1 and row['engagement'] == 0:
        return 1

    return 0

df['target'] = df.apply(create_label, axis=1)

# -----------------------------
# 6️⃣ Features & Target
# -----------------------------
numeric_features = [
    'stars', 'cool', 'useful', 'funny',
    'review_length', 'engagement', 'word_count',
    'avg_word_length', 'engagement_ratio', 'extreme_rating',

    # 🔥 NEW TEXT FEATURES
    'has_spam_words',
    'exclamation_count',
    'uppercase_ratio'
]

X = df[numeric_features]
y = df['target']

# -----------------------------
# 7️⃣ Train/Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

## -----------------------------
# 8️⃣ Train Model (WITH CALIBRATION)
# -----------------------------
from sklearn.calibration import CalibratedClassifierCV

rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

calibrated_model = CalibratedClassifierCV(
    rf_model,
    method='sigmoid',   # better for small/medium data
    cv=5                # important for proper calibration
)

rf_pipe = Pipeline([
    ('classifier', calibrated_model)
])

rf_pipe.fit(X_train, y_train)

# -----------------------------
# 9️⃣ Save Model
# -----------------------------
joblib.dump(rf_pipe, MODEL_PATH)

print(f"✅ Model saved at {MODEL_PATH}")