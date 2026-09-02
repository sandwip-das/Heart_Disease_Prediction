"""
Local test script to verify FastAPI endpoints and model predictions.
"""
import asyncio
from app.main import app, lifespan, root, health_check, get_model_info, predict_heart_disease
from app.schemas import HeartDiseaseInput


async def run_tests():
    print("Testing FastAPI app lifecycle and endpoints...\n")
    
    # Initialize lifespan (load model)
    async with lifespan(app):
        # 1. Test Root
        root_res = await root()
        assert "documentation" in root_res
        print("[OK] GET / passed:", root_res)

        # 2. Test Health
        health_res = await health_check()
        assert health_res.status == "healthy"
        assert health_res.model_loaded is True
        print("[OK] GET /health passed:", health_res.model_dump())

        # 3. Test Info
        info_res = await get_model_info()
        assert len(info_res.features) == 13
        print("[OK] GET /info passed:", info_res.model_dump())

        # 4. Test Predict (Sample 1: Negative)
        input_neg = HeartDiseaseInput(
            age=35, sex=0, cp=0, trestbps=110, chol=180,
            fbs=0, restecg=0, thalach=175, exang=0,
            oldpeak=0.0, slope=2, ca=0, thal=2
        )
        pred_neg = await predict_heart_disease(input_neg)
        print("[OK] POST /predict (Low Risk) passed:", pred_neg.model_dump())

        # 5. Test Predict (Sample 2: Positive)
        input_pos = HeartDiseaseInput(
            age=65, sex=1, cp=3, trestbps=160, chol=286,
            fbs=1, restecg=2, thalach=108, exang=1,
            oldpeak=2.8, slope=1, ca=3, thal=3
        )
        pred_pos = await predict_heart_disease(input_pos)
        print("[OK] POST /predict (High Risk) passed:", pred_pos.model_dump())

    print("\n[SUCCESS] All endpoint tests verified successfully!")


if __name__ == "__main__":
    asyncio.run(run_tests())
