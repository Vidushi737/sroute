# FastAPI Entrypoint
# File: C:\Users\Dell\.gemini\antigravity\scratch\Sroute\ai-service\src\main.py

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.v1.router import api_router

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sroute-ai-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML models
    logger.info("Initializing ML Models...")
    
    # 1. Load Sentence Transformer
    try:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading Sentence-Transformer (all-MiniLM-L6-v2)...")
        app.state.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Sentence-Transformer loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load Sentence-Transformer: {e}. Using mock embedding fallback.")
        app.state.embedding_model = None

    # 2. Load ResNet-50
    try:
        import torch
        from torchvision import models, transforms
        logger.info("Loading ResNet-50 model...")
        resnet = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        resnet.eval()
        app.state.cv_model = resnet
        app.state.cv_transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        logger.info("ResNet-50 loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load ResNet-50: {e}. Using mock image analysis fallback.")
        app.state.cv_model = None
        app.state.cv_transform = None

    yield
    # Shutdown: Cleanup
    logger.info("Cleaning up resources...")
    del app.state.embedding_model
    if hasattr(app.state, 'cv_model'):
        del app.state.cv_model

app = FastAPI(
    title="Sroute AI Service",
    description="AI Microservice powering Authenticity scoring and Intinerary calculations for Sroute.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the Gateway service url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "sentence_transformer": app.state.embedding_model is not None,
            "resnet50": getattr(app, 'state', None) is not None and getattr(app.state, 'cv_model', None) is not None
        }
    }
