-- ====================================================================
-- AgroAI: AI-Powered Agriculture Crop Advisory Assistant
-- Supabase PostgreSQL Migration Script
-- Version: 1.0.0
-- ====================================================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. PROFILES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    country TEXT DEFAULT 'India',
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT DEFAULT 'en',
    farming_experience INTEGER DEFAULT 0 CHECK (farming_experience >= 0),
    land_area NUMERIC(12,3) CHECK (land_area >= 0),
    land_unit TEXT DEFAULT 'acre' CHECK (land_unit IN ('acre', 'hectare', 'sqm')),
    farming_type TEXT,
    irrigation_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 2. FARMS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location TEXT,
    state TEXT,
    district TEXT,
    soil_type TEXT,
    soil_ph NUMERIC(4,2) CHECK (soil_ph >= 0 AND soil_ph <= 14),
    land_area NUMERIC(12,3) NOT NULL CHECK (land_area > 0),
    land_unit TEXT DEFAULT 'acre' CHECK (land_unit IN ('acre', 'hectare', 'sqm')),
    irrigation_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. CROP RECOMMENDATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    input_data JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    advisory_language TEXT DEFAULT 'en',
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. SOIL REPORTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.soil_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    soil_data JSONB NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. FERTILIZER ADVISORIES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.fertilizer_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 6. IRRIGATION ADVISORIES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.irrigation_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. DISEASE REPORTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.disease_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    image_path TEXT,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. CULTIVATION CALENDARS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.cultivation_calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    start_date DATE,
    activities JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 9. CHAT CONVERSATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 10. CHAT MESSAGES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 11. TRIGGER FUNCTION FOR updated_at
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_update_farms_updated_at ON public.farms;
CREATE TRIGGER trigger_update_farms_updated_at
BEFORE UPDATE ON public.farms
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_update_cultivation_calendars_updated_at ON public.cultivation_calendars;
CREATE TRIGGER trigger_update_cultivation_calendars_updated_at
BEFORE UPDATE ON public.cultivation_calendars
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_update_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER trigger_update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 12. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 13. PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recs_user_id ON public.crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recs_farm_id ON public.crop_recommendations(farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_recs_created_at ON public.crop_recommendations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_soil_reports_user_id ON public.soil_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_soil_reports_farm_id ON public.soil_reports(farm_id);
CREATE INDEX IF NOT EXISTS idx_soil_reports_created_at ON public.soil_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fert_advisories_user_id ON public.fertilizer_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_fert_advisories_farm_id ON public.fertilizer_advisories(farm_id);
CREATE INDEX IF NOT EXISTS idx_fert_advisories_created_at ON public.fertilizer_advisories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_irrig_advisories_user_id ON public.irrigation_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_irrig_advisories_farm_id ON public.irrigation_advisories(farm_id);
CREATE INDEX IF NOT EXISTS idx_irrig_advisories_created_at ON public.irrigation_advisories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_disease_reports_user_id ON public.disease_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_reports_farm_id ON public.disease_reports(farm_id);
CREATE INDEX IF NOT EXISTS idx_disease_reports_created_at ON public.disease_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cult_calendars_user_id ON public.cultivation_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_cult_calendars_farm_id ON public.cultivation_calendars(farm_id);
CREATE INDEX IF NOT EXISTS idx_cult_calendars_created_at ON public.cultivation_calendars(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_convos_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_convos_updated_at ON public.chat_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_msgs_convo_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_msgs_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_msgs_created_at ON public.chat_messages(created_at ASC);

-- ====================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultivation_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 14.1 PROFILES POLICIES
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 14.2 FARMS POLICIES
CREATE POLICY "Users can view own farms"
ON public.farms FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farms"
ON public.farms FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farms"
ON public.farms FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own farms"
ON public.farms FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.3 CROP RECOMMENDATIONS POLICIES
CREATE POLICY "Users can view own crop recommendations"
ON public.crop_recommendations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop recommendations"
ON public.crop_recommendations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own crop recommendations"
ON public.crop_recommendations FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.4 SOIL REPORTS POLICIES
CREATE POLICY "Users can view own soil reports"
ON public.soil_reports FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own soil reports"
ON public.soil_reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own soil reports"
ON public.soil_reports FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.5 FERTILIZER ADVISORIES POLICIES
CREATE POLICY "Users can view own fertilizer advisories"
ON public.fertilizer_advisories FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertilizer advisories"
ON public.fertilizer_advisories FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fertilizer advisories"
ON public.fertilizer_advisories FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.6 IRRIGATION ADVISORIES POLICIES
CREATE POLICY "Users can view own irrigation advisories"
ON public.irrigation_advisories FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own irrigation advisories"
ON public.irrigation_advisories FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own irrigation advisories"
ON public.irrigation_advisories FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.7 DISEASE REPORTS POLICIES
CREATE POLICY "Users can view own disease reports"
ON public.disease_reports FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease reports"
ON public.disease_reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own disease reports"
ON public.disease_reports FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.8 CULTIVATION CALENDARS POLICIES
CREATE POLICY "Users can view own cultivation calendars"
ON public.cultivation_calendars FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cultivation calendars"
ON public.cultivation_calendars FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cultivation calendars"
ON public.cultivation_calendars FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cultivation calendars"
ON public.cultivation_calendars FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.9 CHAT CONVERSATIONS POLICIES
CREATE POLICY "Users can view own chat conversations"
ON public.chat_conversations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat conversations"
ON public.chat_conversations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat conversations"
ON public.chat_conversations FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat conversations"
ON public.chat_conversations FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- 14.10 CHAT MESSAGES POLICIES
-- Enforce ownership both on user_id and verify conversation ownership
CREATE POLICY "Users can view own chat messages"
ON public.chat_messages FOR SELECT TO authenticated
USING (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.chat_conversations c
        WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert own chat messages"
ON public.chat_messages FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.chat_conversations c
        WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
    )
);

-- ====================================================================
-- 15. STORAGE BUCKET CONFIGURATION (Crop Images)
-- ====================================================================
-- Insert private storage bucket for crop images if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'crop-images',
    'crop-images',
    false,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS policies for crop-images bucket
CREATE POLICY "Users can upload their own crop images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own crop images"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own crop images"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

