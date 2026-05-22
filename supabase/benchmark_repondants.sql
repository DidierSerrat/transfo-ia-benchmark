-- ============================================================
-- Zeebra Cadrage POC IA — Table benchmark_repondants
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- ============================================================

CREATE TABLE benchmark_repondants (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                           TEXT NOT NULL UNIQUE,
  first_name                      TEXT,
  last_name                       TEXT,
  company_name                    TEXT,
  sector                          TEXT,
  company_size                    TEXT,
  role_label                      TEXT,
  ai_maturity_score               INT,
  transformation_ease_score       INT,
  change_maturity_score           INT,
  manager_engagement_score        INT,
  middle_management_readiness_score INT,
  main_ai_difficulties            TEXT,
  main_transformation_difficulties TEXT,
  what_works                      TEXT,
  open_comment                    TEXT,
  summary                         TEXT,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE benchmark_repondants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert" ON benchmark_repondants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select" ON benchmark_repondants FOR SELECT USING (true);
