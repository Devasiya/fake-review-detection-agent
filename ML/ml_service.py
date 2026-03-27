# ml_service.py
from fastapi import FastAPI
from pydantic import BaseModel
from predictor import predict_review

app = FastAPI(title="Fake Review Detection ML Service")

class ReviewRequest(BaseModel):
    """
    Accepts review features from Node.js
    """
    stars: int
    cool: int
    useful: int
    funny: int
    review_length: int
    engagement: int
    word_count: int
    avg_word_length: float
    engagement_ratio: float
    extreme_rating: int
    type: str = "review"

class ReviewResponse(BaseModel):
    aiScore: float
    label: str
    hybrid_label: int
    agentic_action: str

@app.post("/predict", response_model=ReviewResponse)
def predict(review: ReviewRequest):
    features = review.dict()
    result = predict_review(features)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)