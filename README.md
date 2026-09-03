# CardioPulse AI — Heart Disease Risk Stratification & Prediction System

A production-ready Full-Stack Machine Learning Clinical Decision Support System that predicts coronary artery disease (CAD) risk from 13 clinical biomarkers.

Built with **FastAPI**, **Scikit-Learn**, **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Live Deployment on Render

This repository is pre-configured with a Render Blueprint (`render.yaml`) for seamless deployment.

### Option 1: Automatic Blueprint Deployment (Recommended)
1. Push this repository to your **GitHub** / **GitLab** account.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Connect this repository. Render will automatically read [`render.yaml`](render.yaml) and configure both the backend API and frontend UI services.
5. Click **Apply**.

---

### Option 2: Manual Web Service Setup on Render

#### 1. Backend Service (FastAPI)
- **Type**: Web Service
- **Runtime**: `Python 3`
- **Root Directory**: `.` *(leave empty)*
- **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`
- **Environment Variables**:
  - `PYTHON_VERSION`: `3.11.9`

#### 2. Frontend Service (Next.js)
- **Type**: Web Service
- **Runtime**: `Node`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://<your-fastapi-service-name>.onrender.com`
  - `NODE_VERSION`: `20.17.0`

---

## 🛠️ Local Development

### 1. Backend Setup
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate   # On Windows
# source venv/bin/activate  # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Testing Backend
```bash
python test_app.py
```

---

## 📁 Repository Structure
```
├── app/                  # FastAPI Application (API endpoints, schemas)
├── model/                # Serialized ML Pipeline (.joblib) & metadata
├── data/                 # Training dataset (UCI Cleveland)
├── frontend/             # Next.js 14 React Application
│   ├── src/app/          # Next.js App Router
│   ├── src/components/   # UI components
│   └── src/lib/          # API client & clinical calculation helpers
├── Dockerfile            # Production Dockerfile for Backend
├── render.yaml           # Render Infrastructure Blueprint
├── requirements.txt      # Python dependencies
└── train.py              # ML Training & evaluation pipeline
```
