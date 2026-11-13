# 🌾 AgroAI: AI-Powered Agriculture Crop Advisory Assistant

> Production-ready, secure, and multilingual agricultural intelligence platform empowering farmers with personalized crop recommendations, soil health diagnostics, nutrient guides, irrigation schedules, and IPM disease detection.

---

## 🌟 Key Features

### 1. 🚜 Precision Crop Recommendation Engine
- Analyzes soil characteristics, soil pH, measured N-P-K nutrient levels, organic carbon, climate, seasonal window (Kharif, Rabi, Zaid), and water availability.
- Generates ranking suitability scores (0–100), duration estimations, compatibility breakdowns, biological risks, and next steps.
- **Zero Fabrication:** Clearly marks unmeasured parameters as unknown; never invents weather or soil data.

### 2. 🧪 Soil Health & Fertility Diagnostics
- Evaluates laboratory Soil Health Card parameters (pH, EC, N, P, K, Organic Carbon, Micronutrients).
- Classifies soil acidity/alkalinity and flags specific nutrient deficiencies and toxic accumulation risks.
- Recommends tailored soil amendments (green manuring, gypsum, lime, vermicomposting) and lists naturally favored crops.

### 3. 🌾 Integrated Fertilizer Advisory
- Provides stage-specific crop nutrition matching crop growth stages (Basal, Vegetative, Tillering, Flowering, Maturation).
- Implements Integrated Nutrient Management (INM) with organic soil conditioning alongside inorganic sources.
- Safe split-dosage guidelines without dangerous chemical tank mixes.

### 4. 💧 Smart Irrigation Management
- Computes crop water demand based on soil texture, critical growth windows, and water availability.
- Delivers water conservation recommendations, visual plant moisture stress indicators, and drainage advice.

### 5. 🐛 Crop Disease & Pest Differential Diagnosis
- Evaluates field symptoms across plant parts (leaves, stems, roots, fruit).
- Optional photo upload with strict magic-byte signature verification and secure Supabase Storage isolation.
- Returns differential diagnoses with confidence ratings, Integrated Pest Management (IPM), and mandatory agricultural extension (KVK) consultation advisories.

### 6. 📅 Interactive Cultivation Calendars
- Chronologically phased calendar from pre-sowing soil solarization to harvesting and safe post-harvest storage.
- Interactive checklist allowing farmers to mark agronomic milestones as completed.

### 7. 🤖 Multilingual Conversational AI Assistant
- Context-aware agricultural assistant powered by Google Gemini.
- Full fluency in English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी), with architectural support for Telugu, Tamil, Urdu, and Malayalam.
- Conversational history preserved securely with user isolation.

### 8. 📊 Real-Time Farmer Dashboard & Historical Auditing
- Live metrics directly aggregated from PostgreSQL database records.
- Historical advisory searching, filtering by advisory category, detailed report inspection, and user-controlled deletion.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, React Router DOM v6, Axios, Date-fns |
| **Backend** | Node.js, Express.js, Helmet, CORS, Express Rate Limit, Multer |
| **Database & Auth** | Supabase PostgreSQL, Supabase Authentication, Row Level Security (RLS) |
| **AI Integration** | Official Google GenAI SDK (`@google/genai`) with structured JSON schema outputs |
| **Data Validation** | Zod (Request bodies, query params, and AI structured output schemas) |
| **Storage** | Supabase Storage (Private `crop-images` bucket with signed preview URLs) |

---

## 🔒 Security & Data Isolation Architecture

- **PostgreSQL Row Level Security (RLS):** Every table (`profiles`, `farms`, `crop_recommendations`, etc.) enforces strict RLS policies:
  ```sql
  CREATE POLICY "Users can view own crop recommendations"
  ON public.crop_recommendations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
  ```
- **JWT Verification & Scoped Clients:** The backend authenticates Supabase JWTs and creates user-scoped database clients to guarantee no cross-tenant data leakage.
- **Server-Side AI Credential Isolation:** Gemini API keys and Supabase service-role keys exist exclusively on the server and are never exposed to the client bundle.
- **MIME & Magic-Byte Signature Validation:** Uploaded crop images undergo binary buffer inspection to verify authentic JPEG, PNG, or WebP headers.

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Database Migration (Supabase)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire file:
   ```text
   supabase/migrations/001_initial_schema.sql
   ```

### 3. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Locally
```bash
# In terminal 1: Start backend
cd server
npm run dev

# In terminal 2: Start frontend
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📖 Documentation
- [Setup & Configuration Guide](docs/SETUP.md)
- [REST API Reference](docs/API_DOCUMENTATION.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)

---

## 📄 License
This project is open-source under the MIT License.

