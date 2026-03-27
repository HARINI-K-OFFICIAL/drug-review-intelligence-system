from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import models

app = FastAPI(title="Drug Review Intelligence API")

class ReviewRequest(BaseModel):
    review_text: str

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float

class RatingResponse(BaseModel):
    rating: float

class ConditionResponse(BaseModel):
    condition: str
    confidence: float

class TopicResponse(BaseModel):
    topics: List[str]

@app.get("/")
def read_root():
    return {"message": "ML Microservice is running (BERT Backend)"}

import functools

@functools.lru_cache(maxsize=200)
def infer_cached(task: str, text: str):
    if task == 'sentiment':
        return models.predict_sentiment(text)
    elif task == 'rating':
        return models.predict_rating(text)
    elif task == 'condition':
        return models.predict_condition(text)
    return {}

@app.post("/sentiment", response_model=SentimentResponse)
def predict_sentiment(req: ReviewRequest):
    try:
        res = infer_cached('sentiment', req.review_text)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Error: {str(e)}")

@app.post("/rating", response_model=RatingResponse)
def predict_rating(req: ReviewRequest):
    try:
        res = infer_cached('rating', req.review_text)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Error: {str(e)}")

@app.post("/condition", response_model=ConditionResponse)
def predict_condition(req: ReviewRequest):
    try:
        res = infer_cached('condition', req.review_text)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Error: {str(e)}")

@app.get("/topics", response_model=TopicResponse)
def get_topics(drug_name: Optional[str] = None):
    # Mocking topic response
    topics = ["side effects", "effectiveness", "ease of use", "cost", "dosage"]
    return {"topics": topics}

@app.post("/summary")
def get_summary(req: ReviewRequest):
    # Mock summarization
    summary = "This is a mock summary of the review: " + req.review_text[:50] + "..."
    return {"summary": summary}
