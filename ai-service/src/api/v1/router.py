# API v1 Router Aggregator
# File: C:\Users\Dell\.gemini\antigravity\scratch\Sroute\ai-service\src\api\v1\router.py

from fastapi import APIRouter
from src.api.v1.endpoints import embeddings, images, recommend, chat, itinerary

api_router = APIRouter()

api_router.include_router(embeddings.router, prefix="/embeddings", tags=["embeddings"])
api_router.include_router(images.router, prefix="/images", tags=["images"])
api_router.include_router(recommend.router, prefix="/recommend", tags=["recommend"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(itinerary.router, prefix="/itinerary", tags=["itinerary"])
