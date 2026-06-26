# Embeddings Generation Router
# File: C:\Users\Dell\.gemini\antigravity\scratch\Sroute\ai-service\src\api\v1\endpoints\embeddings.py

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import random
import numpy as np

router = APIRouter()

class EmbeddingRequest(BaseModel):
    texts: list[str]

class EmbeddingResponse(BaseModel):
    embeddings: list[list[float]]

@router.post("/", response_model=EmbeddingResponse)
def get_embeddings(req: EmbeddingRequest, request: Request):
    embedding_model = getattr(request.app.state, "embedding_model", None)
    
    output = []
    if embedding_model is not None:
        try:
            embeddings = embedding_model.encode(req.texts)
            output = embeddings.tolist()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
    else:
        # Fallback Mock: generate random 384-dimension vectors
        for text in req.texts:
            # Seed based on string length to return consistent vectors for mocks
            random.seed(len(text))
            mock_vec = [random.uniform(-0.1, 0.1) for _ in range(384)]
            output.append(mock_vec)
            
    return {"embeddings": output}
