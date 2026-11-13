# AgroAI Production Deployment Guide

This guide describes deploying AgroAI to production environments.

---

## Architecture Overview

- **Frontend:** React + Vite deployed to **Vercel** or **Netlify**.
- **Backend:** Node.js + Express deployed to **Render**, **Railway**, or **AWS ECS/App Runner**.
- **Database & Auth:** Hosted **Supabase PostgreSQL** with automated RLS policies.
- **AI Processing:** Google Gemini via official `@google/genai` SDK executed strictly server-side.

---

## 1. Database Deployment (Supabase)

1. Provision a production Supabase project at [supabase.com](https://supabase.com).
2. Execute `supabase/migrations/001_initial_schema.sql` inside the Supabase SQL Editor.
3. Verify that all 10 tables have Row Level Security enabled.
4. Verify that the private `crop-images` storage bucket is created.
5. In **Auth Settings**:
   - Set Site URL to your frontend production domain (e.g., `https://agroai.vercel.app`).
   - Configure Redirect URLs (e.g., `https://agroai.vercel.app/**`).

---

## 2. Backend Deployment (Render or Railway)

### On Render:
1. Create a **New Web Service** pointing to your GitHub repository.
2. Set **Root Directory** to `server`.
3. Set **Build Command**: `npm install`.
4. Set **Start Command**: `npm start`.
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default, Render injects `PORT`)
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `<your_anon_key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your_service_role_key>`
   - `GEMINI_API_KEY`: `<your_google_gemini_api_key>`
   - `GEMINI_MODEL`: `gemini-2.5-flash`
6. Click **Deploy**. Note your backend production URL (e.g. `https://agroai-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Import your repository into **Vercel**.
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Configure Build and Output:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_BASE_URL`: `https://agroai-api.onrender.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your_anon_key>`
6. Deploy.

---

## 4. Security & Post-Deployment Checklist

- [ ] Ensure `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are never present in the frontend bundle.
- [ ] Test user sign-up and sign-in.
- [ ] Test crop image upload and confirm signed URL generation works.
- [ ] Verify that farmer data isolation works (User A cannot see User B's reports).
- [ ] Test rate limiting by sending repeated requests.

