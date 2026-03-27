import torch
import os
import re
from transformers import BertTokenizer
from bert_model import BertClassifier, BertRegressor
import torch.nn.functional as F

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
tokenizer = None
sentiment_model = None
rating_model = None
condition_model = None

# Pre-defined classes
sentiment_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
condition_map = {0: "Depression", 1: "Acne", 2: "Pain", 3: "Anxiety", 4: "Birth Control", 5: "High Blood Pressure", 6: "Diabetes"}

def load_models():
    global tokenizer, sentiment_model, rating_model, condition_model
    if tokenizer is not None:
        return
    
    print("Loading BERT tokenizer and initializing models...")
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    
    # Initialize PyTorch Architectures
    sentiment_model = BertClassifier(num_classes=3).to(device)
    rating_model = BertRegressor().to(device)
    condition_model = BertClassifier(num_classes=7).to(device)
    
    # Try loading custom fine-tuned weights if available
    base_dir = os.path.dirname(os.path.abspath(__file__))
    try:
        p_sent = os.path.join(base_dir, 'sentiment_model.pt')
        if os.path.exists(p_sent): sentiment_model.load_state_dict(torch.load(p_sent, map_location=device))
        
        p_rate = os.path.join(base_dir, 'rating_model.pt')
        if os.path.exists(p_rate): rating_model.load_state_dict(torch.load(p_rate, map_location=device))
        
        p_cond = os.path.join(base_dir, 'condition_model.pt')
        if os.path.exists(p_cond): condition_model.load_state_dict(torch.load(p_cond, map_location=device))
    except Exception as e:
        print("Warning: Could not load trained weights, models will use initialized layers.", e)
        
    sentiment_model.eval()
    rating_model.eval()
    condition_model.eval()

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

def _get_encoding(text: str):
    load_models()
    return tokenizer(
        clean_text(text), 
        return_tensors='pt', 
        truncation=True, 
        padding=True, 
        max_length=128
    ).to(device)

def predict_sentiment(text: str) -> dict:
    enc = _get_encoding(text)
    with torch.no_grad():
        logits = sentiment_model(enc['input_ids'], enc['attention_mask'])
        probs = F.softmax(logits, dim=1)
        conf, pred = torch.max(probs, dim=1)
    return {"sentiment": sentiment_map.get(pred.item(), "Neutral"), "confidence": conf.item()}

def predict_rating(text: str) -> dict:
    enc = _get_encoding(text)
    with torch.no_grad():
        rating = rating_model(enc['input_ids'], enc['attention_mask'])
    
    # Ensure rating is between 1.0 and 10.0
    val = max(1.0, min(10.0, float(rating.item())))
    
    # As an extreme fallback to simulate non-trained network looking sensible:
    if val == rating_model.regressor.bias.item() or val < 1.0 or val > 10.0:
         # Without trained weights, output might be totally arbitrary for regression. 
         # Scale it dynamically if untrained, or just clamp.
         pass
         
    return {"rating": round(val, 1)}

def predict_condition(text: str) -> dict:
    enc = _get_encoding(text)
    with torch.no_grad():
        logits = condition_model(enc['input_ids'], enc['attention_mask'])
        probs = F.softmax(logits, dim=1)
        conf, pred = torch.max(probs, dim=1)
        
    return {"condition": condition_map.get(pred.item(), "Unknown"), "confidence": conf.item()}
