# Sroute – AI-Powered Authentic Travel Planner

Sroute is a premium, production-grade full-stack travel planner that uses Machine Learning to discover local-first establishments and design optimized itineraries, steering users away from commercial tourist traps.

---

## 🏗️ System Architecture

- **Frontend**: React (TypeScript, Vite, Tailwind CSS v4, Framer Motion, react-map-gl/mapbox-gl).
- **Backend API Gateway**: Spring Boot (Java, Spring Security, OAuth2 resource token validation).
- **AI Microservice**: Python FastAPI (Groq Llama 3 LLM, PyTorch ResNet-50, Sentence-Transformers).
- **Database**: Supabase PostgreSQL with PostGIS for radius optimization and pgvector for semantic embeddings.

---

## 📂 Repository Structure

- `frontend/` - Single-Page React Web Application.
- `backend/` - Gateway services coordinating security and resource handling.
- `ai-service/` - Microservices running computer vision and routing inference.
- `supabase/` - SQL migration scripts and database triggers.
- `docker-compose.yml` - Orchestrates database, backend, and AI service.

---

## 🚀 Running the Project

### 1. Database Migrations
Copy the contents of `supabase/migrations/20260626000000_schema.sql` into the SQL Editor of your Supabase Dashboard to instantiate all tables, indexes, triggers, and Row Level Security policies. Seed the tables by running `supabase/seed.sql`.

### 2. Run with Docker Compose
From the root directory, create a `.env` file containing your API credentials (optional):
```env
GROQ_API_KEY=your_groq_api_key
```

Execute the system:
```bash
docker-compose up --build
```
This builds and launches the database container, the FastAPI AI service (port `8000`), and the Spring Boot backend gateway (port `8080`).

### 3. Run Frontend
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to explore Sroute!

---

## 🎨 Verification Actions

1. **Build Itinerary**: Click the **Create Plan** action button in the toolbar, enter a destination (e.g. `Tokyo`), choose a budget, and select **Engine Plan**.
2. **Proximity Radius**: Use the map marker widgets to confirm that nearby places are filtered correctly by distance using PostGIS.
3. **AI Consultation**: Interact with the **AI Co-pilot** chat panel in the sidebar to modify travel constraints (e.g., typing *"make it cheaper"* or *"recommend authentic ramen"*).
