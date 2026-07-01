# AI Chat Endpoint — powers the Sroute AI Co-pilot
# Uses Groq (Llama 3) for real conversational travel AI

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import logging
import os
from src.core.config import settings

logger = logging.getLogger("sroute-chat")
router = APIRouter()


class ChatMessage(BaseModel):
    sender: str  # "user" or "ai"
    text: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    context: Optional[str] = None  # Optional trip context


class ChatResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = """You are Sroute AI Co-pilot, an expert travel assistant specializing in authentic, local-first travel experiences. 

Your personality:
- Warm, knowledgeable, and concise
- You recommend REAL places that locals love, not tourist traps
- You provide specific details: street names, neighborhoods, local tips
- You use authenticity scores (0-100%) to rate how "local" a place is
- You help modify itineraries, suggest hidden gems, and answer travel questions

Response style:
- Keep replies under 3-4 sentences unless asked for details
- Include specific place names and authenticity scores when recommending
- Be direct and helpful, not generic
- If the user mentions budget, adjust recommendations accordingly
- If asked about a specific city, provide real local knowledge

NEVER make up fake-sounding places. Always ground recommendations in real locations."""


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    api_key = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")

    if not api_key or api_key == "mock-key":
        # Fallback for development without API key
        return ChatResponse(reply=_fallback_reply(req.message))

    try:
        from groq import Groq
        client = Groq(api_key=api_key)

        # Build message list
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if req.context:
            messages.append({
                "role": "system",
                "content": f"Current trip context: {req.context}"
            })

        # Add conversation history (last 10 messages for context)
        for msg in (req.history or [])[-10:]:
            messages.append({
                "role": "user" if msg.sender == "user" else "assistant",
                "content": msg.text
            })

        # Add current message
        messages.append({"role": "user", "content": req.message})

        completion = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )

        reply = completion.choices[0].message.content.strip()
        return ChatResponse(reply=reply)

    except Exception as e:
        logger.error(f"Groq chat failed: {e}")
        return ChatResponse(reply=_fallback_reply(req.message))


def _fallback_reply(message: str) -> str:
    """Smart fallback when Groq API is unavailable."""
    lower = message.lower()
    if "budget" in lower or "cheap" in lower:
        return "I'd swap the expensive stop for a local alternative. Try neighborhood eateries away from main streets — they typically cost 40-60% less with higher authenticity scores."
    elif "coffee" in lower or "cafe" in lower:
        return "Look for single-origin specialty coffee shops in residential neighborhoods. They're usually run by passionate baristas and score 90%+ on authenticity."
    elif "ramen" in lower:
        return "The best ramen shops are basement counters with no English menu. Look for places with a line of locals at lunch — that's your authenticity signal."
    elif "hotel" in lower or "stay" in lower:
        return "Skip chain hotels. Family-run guesthouses and ryokans give you local interaction and typically score 85-95% authenticity."
    elif "hello" in lower or "hi" in lower:
        return "Hey! I'm your Sroute AI Co-pilot. Ask me about any city and I'll find you authentic spots that tourists miss."
    else:
        return "Great question! I can help with itinerary changes, local recommendations, budget adjustments, and hidden gem discoveries. What city are you exploring?"
