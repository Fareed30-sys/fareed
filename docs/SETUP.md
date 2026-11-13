# AgroAI Local Setup & Installation Guide

This guide walks you through setting up the complete **AgroAI Agriculture Advisory Platform** locally.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Supabase Account**: Free tier at [supabase.com](https://supabase.com)
- **Google AI Studio Key**: API Key for Gemini at [aistudio.google.com](https://aistudio.google.com)

---

## 2. Supabase Setup (Database & Authentication)

1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Name your project (e.g., `agroai-production`) and set a secure database password.
3. Once the project is provisioned, navigate to the **SQL Editor** in the left sidebar.
4. Open the SQL file provided in this repository:
   ```text
   supabase/migrations/001_initial_schema.sql
   ```
5. Paste the entire content into the Supabase SQL Editor and click **Run**.
   - This creates all 10 tables (`profiles`, `farms`, `crop_recommendations`, `soil_reports`, `fertilizer_advisories`, `irrigation_advisories`, `disease_reports`, `cultivation_calendars`, `chat_conversations`, `chat_messages`).
   - Enables Row Level Security (RLS) on all tables with strict tenant isolation.
   - Configures the private storage bucket `crop-images` with RLS policies for signed image previews.
   - Attaches `updated_at` triggers and the automatic user registration hook.
6. Retrieve your Project Credentials from **Project Settings -> API**:
   - `Project URL` (`SUPABASE_URL` / `VITE_SUPABASE_URL`)
   - `anon public` key (`SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`)
   - `service_role secret` (`SUPABASE_SERVICE_ROLE_KEY` - keep server-side only!)

---

## 3. Google Gemini Setup

1. Visit [Google AI Studio](https://aistudio.google.com).
2. Generate an API Key under **Get API Key**.
3. Copy the key for your server configuration (`GEMINI_API_KEY`).
4. Recommended model: `gemini-2.5-flash` or `gemini-2.0-flash`.

---

## 4. Backend Configuration & Installation

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `server/.env` with your real keys:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

   GEMINI_API_KEY=your-actual-gemini-key
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Install backend dependencies:
   ```bash
   npm install
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:5000` with the health check available at `http://localhost:5000/api/v1/health`.

---

## 5. Frontend Configuration & Installation

1. Open a second terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `client/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
4. Install frontend dependencies:
   ```bash
   npm install
   ```
5. Start Vite development server:
   ```bash
   npm run dev
   ```
   The application UI will be available at `http://localhost:5173`.

---

## 6. Testing the Flow

1. Open `http://localhost:5173` in your browser.
2. Click **Register** and create a new farmer profile.
3. Navigate to **Farmer Profile** to record land area and your district.
4. Try generating a **Crop Recommendation** for your soil and season.
5. Inspect the generated recommendations, suitability score, and biological warnings!

