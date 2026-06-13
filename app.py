from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from urllib.parse import urlparse
import re

app = FastAPI()

# This security setting allows your Chrome Extension to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. WAKE UP THE AI
print("Loading AI Model...")
model = joblib.load('phishguard_model.pkl')
print("AI Model Loaded Successfully!")

class URLRequest(BaseModel):
    url: str

# 2. CREATE THE SCANNER ENDPOINT
@app.post("/scan")
def scan_url(request: URLRequest):
    url = request.url
    domain = urlparse(url).netloc
    
    # Extract the exact same features we used during training
    url_length = len(url)
    qty_dots = url.count('.')
    qty_hyphens = url.count('-')
    qty_slash = url.count('/')
    qty_at = url.count('@')
    has_sensitive_word = int(any(w in url.lower() for w in ['login', 'secure', 'bank', 'verify', 'update']))
    is_ip = int(bool(re.match(r"^(?:\d{1,3}\.){3}\d{1,3}$", domain)))
    
    # Format precisely as a DataFrame so XGBoost recognizes it
    features_df = pd.DataFrame([{
        'url_length': url_length,
        'qty_dots': qty_dots,
        'qty_hyphens': qty_hyphens,
        'qty_slash': qty_slash,
        'qty_at': qty_at,
        'has_sensitive_word': has_sensitive_word,
        'is_ip': is_ip
    }])
    
    # 3. GET THE AI'S PREDICTION
    prediction = int(model.predict(features_df)[0])
    risk_score = float(model.predict_proba(features_df)[0][1]) * 100
    
    # 4. SEND RESULT BACK TO CHROME EXTENSION
    return {
        "url": url,
        "is_malicious": bool(prediction == 1),
        "risk_score": round(risk_score, 2)
    }