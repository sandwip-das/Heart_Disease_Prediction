from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class HeartDiseaseInput(BaseModel):
    age: float = Field(
        ...,
        ge=1,
        le=120,
        description="Age of the patient in years",
        example=52
    )
    sex: int = Field(
        ...,
        ge=0,
        le=1,
        description="Biological sex (1 = male, 0 = female)",
        example=1
    )
    cp: int = Field(
        ...,
        ge=0,
        le=3,
        description="Chest pain type (0: typical angina, 1: atypical angina, 2: non-anginal pain, 3: asymptomatic)",
        example=0
    )
    trestbps: float = Field(
        ...,
        ge=50,
        le=250,
        description="Resting blood pressure in mm Hg on admission to the hospital",
        example=125
    )
    chol: float = Field(
        ...,
        ge=80,
        le=600,
        description="Serum cholesterol in mg/dl",
        example=212
    )
    fbs: int = Field(
        ...,
        ge=0,
        le=1,
        description="Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)",
        example=0
    )
    restecg: int = Field(
        ...,
        ge=0,
        le=2,
        description="Resting electrocardiographic results (0: normal, 1: ST-T wave abnormality, 2: left ventricular hypertrophy)",
        example=1
    )
    thalach: float = Field(
        ...,
        ge=50,
        le=250,
        description="Maximum heart rate achieved during exercise",
        example=168
    )
    exang: int = Field(
        ...,
        ge=0,
        le=1,
        description="Exercise induced angina (1 = yes, 0 = no)",
        example=0
    )
    oldpeak: float = Field(
        ...,
        ge=0.0,
        le=10.0,
        description="ST depression induced by exercise relative to rest",
        example=1.0
    )
    slope: int = Field(
        ...,
        ge=0,
        le=2,
        description="The slope of the peak exercise ST segment (0: upsloping, 1: flat, 2: downsloping)",
        example=2
    )
    ca: int = Field(
        ...,
        ge=0,
        le=4,
        description="Number of major vessels (0-4) colored by fluoroscopy",
        example=2
    )
    thal: int = Field(
        ...,
        ge=0,
        le=3,
        description="Thalassemia blood disorder (0: null/normal, 1: fixed defect, 2: reversible defect, 3: normal)",
        example=3
    )

    class Config:
        json_schema_extra = {
            "example": {
                "age": 52,
                "sex": 1,
                "cp": 0,
                "trestbps": 125,
                "chol": 212,
                "fbs": 0,
                "restecg": 1,
                "thalach": 168,
                "exang": 0,
                "oldpeak": 1.0,
                "slope": 2,
                "ca": 2,
                "thal": 3
            }
        }


class PredictionResponse(BaseModel):
    heart_disease: bool = Field(
        ...,
        description="Predicted presence (true) or absence (false) of heart disease"
    )
    prediction: int = Field(
        ...,
        description="Raw prediction class (1 = present, 0 = absent)"
    )
    probability: float = Field(
        ...,
        description="Confidence probability of heart disease presence (0.0 to 1.0)"
    )
    risk_level: str = Field(
        ...,
        description="Categorized risk level (Low, Moderate, High)"
    )


class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Current health status of the service")
    model_loaded: bool = Field(..., description="Whether the ML model is loaded and ready")


class InfoResponse(BaseModel):
    model_name: str
    model_type: str
    features: List[str]
    metrics: Optional[Dict[str, float]] = None
    description: Optional[str] = None
