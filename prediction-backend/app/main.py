from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
from typing import List
import os

app = FastAPI(title="ML Prediction API", description="A full-stack ML prediction app")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class LoanPredictionInput(BaseModel):
    age: int
    income: float
    loan_amount: float
    credit_score: int
    employment_years: float
    debt_to_income_ratio: float
    loan_term_months: int
    home_ownership: int  # 0=rent, 1=own, 2=mortgage
    loan_purpose: int  # 0=personal, 1=business, 2=education, 3=home, 4=auto
    previous_defaults: int
    credit_inquiries_6m: int
    savings_account_balance: float

class PredictionResponse(BaseModel):
    default_probability: float
    risk_level: str
    confidence_score: float

model = None
scaler = None
feature_names = None

def create_sample_data():
    """Create sample loan data for training"""
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'age': np.random.randint(18, 80, n_samples),
        'income': np.random.normal(50000, 25000, n_samples),
        'loan_amount': np.random.normal(25000, 15000, n_samples),
        'credit_score': np.random.normal(650, 100, n_samples),
        'employment_years': np.random.uniform(0, 40, n_samples),
        'debt_to_income_ratio': np.random.uniform(0.1, 0.8, n_samples),
        'loan_term_months': np.random.choice([12, 24, 36, 48, 60, 72], n_samples),
        'home_ownership': np.random.choice([0, 1, 2], n_samples, p=[0.4, 0.3, 0.3]),
        'loan_purpose': np.random.choice([0, 1, 2, 3, 4], n_samples),
        'previous_defaults': np.random.choice([0, 1, 2, 3], n_samples, p=[0.7, 0.2, 0.08, 0.02]),
        'credit_inquiries_6m': np.random.choice([0, 1, 2, 3, 4, 5], n_samples, p=[0.3, 0.3, 0.2, 0.1, 0.07, 0.03]),
        'savings_account_balance': np.random.exponential(5000, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    df['income'] = np.maximum(df['income'], 15000)
    df['loan_amount'] = np.maximum(df['loan_amount'], 1000)
    df['credit_score'] = np.clip(df['credit_score'], 300, 850)
    
    default_score = (
        -0.015 * df['credit_score'] +
        3.0 * df['debt_to_income_ratio'] +
        0.8 * df['previous_defaults'] +
        0.3 * df['credit_inquiries_6m'] +
        -0.00003 * df['income'] +
        0.00004 * df['loan_amount'] +
        -0.05 * df['employment_years'] +
        -0.0002 * df['savings_account_balance'] +
        np.random.normal(0, 1.5, n_samples) +
        2.0
    )
    
    default_prob = 1 / (1 + np.exp(-default_score))
    df['default'] = (default_prob > 0.3).astype(int)
    
    return df

def train_model():
    """Train the ML model with sample data"""
    global model, scaler, feature_names
    
    df = create_sample_data()
    
    feature_columns = ['age', 'income', 'loan_amount', 'credit_score', 'employment_years',
                      'debt_to_income_ratio', 'loan_term_months', 'home_ownership', 
                      'loan_purpose', 'previous_defaults', 'credit_inquiries_6m', 
                      'savings_account_balance']
    
    X = df[feature_columns]
    y = df['default']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    from sklearn.ensemble import RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    feature_names = feature_columns
    
    score = model.score(X_test_scaled, y_test)
    print(f"Model trained with accuracy score: {score:.3f}")
    
    return score

@app.on_event("startup")
async def startup_event():
    """Train the model when the app starts"""
    train_model()

@app.get("/")
def read_root():
    return {
        "message": "ML Prediction API",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "model_info": "/model-info"
        }
    }

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    }

@app.get("/model-info")
def model_info():
    """Get information about the trained model"""
    if model is None or feature_names is None:
        raise HTTPException(status_code=503, detail="Model not trained yet")
    
    return {
        "model_type": "Random Forest Classifier",
        "features": feature_names,
        "n_estimators": getattr(model, 'n_estimators', 100),
        "feature_count": len(feature_names)
    }

@app.post("/predict", response_model=PredictionResponse)
def predict_loan_default(input_data: LoanPredictionInput):
    """Predict loan default probability based on input features"""
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not trained yet")
    
    try:
        input_dict = input_data.dict()
        input_df = pd.DataFrame([input_dict])
        
        input_df = input_df[feature_names]
        
        input_scaled = scaler.transform(np.array(input_df.values))
        
        proba = model.predict_proba(input_scaled)[0]
        if len(proba) == 2:
            default_prob = proba[1]  # Probability of default (class 1)
        else:
            default_prob = 0.0 if model.predict(input_scaled)[0] == 0 else 1.0
        
        if default_prob < 0.3:
            risk_level = "Low"
        elif default_prob < 0.6:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        tree_probs = []
        for tree in model.estimators_:
            tree_proba = tree.predict_proba(input_scaled)[0]
            if len(tree_proba) == 2:
                tree_probs.append(tree_proba[1])
            else:
                tree_probs.append(0.0 if tree.predict(input_scaled)[0] == 0 else 1.0)
        confidence = 1.0 - (np.std(tree_probs) / (np.mean(tree_probs) + 1e-8))
        confidence = max(0.0, min(1.0, float(confidence)))
        
        return PredictionResponse(
            default_probability=round(float(default_prob), 3),
            risk_level=risk_level,
            confidence_score=round(confidence, 3)
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.post("/retrain")
def retrain_model():
    """Retrain the model with new sample data"""
    try:
        score = train_model()
        return {
            "message": "Model retrained successfully",
            "r2_score": round(score, 3)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")
