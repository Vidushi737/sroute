# Config Management using Pydantic Settings
# File: C:\Users\Dell\.gemini\antigravity\scratch\Sroute\ai-service\src\core\config.py

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Resolve .env from project root (parent of ai-service/)
_env_file = Path(__file__).resolve().parent.parent.parent.parent / ".env"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(_env_file), env_file_encoding="utf-8", extra="ignore")

    # API Keys
    GROQ_API_KEY: Optional[str] = None
    
    # Supabase credentials (optional for microservice, database interactions typically channeled via gateway)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    # Model parameters
    LLM_MODEL: str = "llama-3.3-70b-versatile"
    EMBEDDING_DIMENSION: int = 384

settings = Settings()
