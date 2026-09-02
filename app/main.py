import os
import json
from contextlib import asynccontextmanager
from typing import Dict, Any

import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.schemas import (
    HeartDiseaseInput,
    PredictionResponse,
    HealthResponse,
    InfoResponse
)

# Base directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "heart_model.joblib")
MODEL_INFO_PATH = os.path.join(BASE_DIR, "model", "model_info.json")

# In-memory model and metadata storage
ml_resources: Dict[str, Any] = {
    "model": None,
    "model_info": {
        "model_name": "Heart Disease Risk Classifier",
        "model_type": "Random Forest with Standard Scaling",
        "features": [
            "age", "sex", "cp", "trestbps", "chol", "fbs",
            "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ],
        "metrics": {"accuracy": 0.85},
        "description": "Binary classifier predicting the presence of heart disease based on clinical features."
    }
}


def load_model_and_info():
    if os.path.exists(MODEL_PATH):
        try:
            ml_resources["model"] = joblib.load(MODEL_PATH)
            print(f"[INFO] Model loaded successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"[ERROR] Failed to load model: {e}")
    else:
        print(f"[WARN] Model file not found at {MODEL_PATH}. Make sure to train the model first.")

    if os.path.exists(MODEL_INFO_PATH):
        try:
            with open(MODEL_INFO_PATH, "r") as f:
                ml_resources["model_info"] = json.load(f)
            print(f"[INFO] Model info loaded from {MODEL_INFO_PATH}")
        except Exception as e:
            print(f"[WARN] Failed to load model info JSON: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model_and_info()
    yield
    ml_resources.clear()


app = FastAPI(
    title="Heart Disease Prediction API",
    description="FastAPI service for predicting the presence of heart disease using machine learning.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for cross-origin frontend or test calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
async def root():
    return {
        "message": "Welcome to the Heart Disease Prediction API",
        "documentation": "/docs",
        "health_check": "/health",
        "model_info": "/info",
        "predict_endpoint": "/predict"
    }


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Monitoring"],
    summary="Health Check"
)
async def health_check():
    model_loaded = ml_resources["model"] is not None
    return HealthResponse(
        status="healthy" if model_loaded else "degraded",
        model_loaded=model_loaded
    )


@app.get(
    "/info",
    response_model=InfoResponse,
    tags=["Model Info"],
    summary="Get Model Information and Features"
)
async def get_model_info():
    info = ml_resources["model_info"]
    return InfoResponse(
        model_name=info.get("model_name", "Heart Disease Classifier"),
        model_type=info.get("model_type", "Machine Learning Pipeline"),
        features=info.get("features", [
            "age", "sex", "cp", "trestbps", "chol", "fbs",
            "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ]),
        metrics=info.get("metrics"),
        description=info.get("description")
    )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Inference"],
    summary="Predict Heart Disease"
)
async def predict_heart_disease(input_data: HeartDiseaseInput):
    model = ml_resources.get("model")
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not loaded. Please ensure the model file exists and is trained."
        )

    try:
        # Convert Pydantic model to DataFrame matching feature order
        feature_dict = input_data.model_dump() if hasattr(input_data, "model_dump") else input_data.dict()
        input_df = pd.DataFrame([feature_dict])

        # Prediction and probability
        prediction = int(model.predict(input_df)[0])
        has_disease = bool(prediction == 1)

        probability = 0.0
        if hasattr(model, "predict_proba"):
            proba_array = model.predict_proba(input_df)[0]
            probability = float(proba_array[1])
        else:
            probability = 1.0 if has_disease else 0.0

        # Risk categorization
        if probability >= 0.7:
            risk_level = "High"
        elif probability >= 0.4:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        return PredictionResponse(
            heart_disease=has_disease,
            prediction=prediction,
            probability=round(probability, 4),
            risk_level=risk_level
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
