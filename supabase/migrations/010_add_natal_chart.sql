-- Store computed natal chart data for each user (computed once at onboarding)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS natal_chart_data JSONB;
