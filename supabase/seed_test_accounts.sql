-- ==============================================================================
-- SCRIPT DE GÉNÉRATION DE COMPTES DE TEST WIGO
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- Mot de passe pour tous les comptes : password123
-- ==============================================================================

-- 1. Activer l'extension pgcrypto si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Création des identifiants (UUID)
DO $$
DECLARE
  admin_id uuid := '00000000-0000-0000-0000-000000000001';
  company_id uuid := '00000000-0000-0000-0000-000000000002';
  driver_id uuid := '00000000-0000-0000-0000-000000000003';
  client_id uuid := '00000000-0000-0000-0000-000000000004';
  
  -- Le mot de passe crypté pour "password123"
  pass_hash text := crypt('password123', gen_salt('bf'));
BEGIN

  -- A. Insertion des utilisateurs dans auth.users
  -- (Ceci va déclencher le trigger et insérer automatiquement dans public.profiles)
  
  -- Super Admin
  INSERT INTO auth.users (id, aud, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES (admin_id, 'authenticated', '00000000-0000-0000-0000-000000000000', 'admin@wigo.test', pass_hash, now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Super Admin", "role": "super_admin"}', now(), now(), 'authenticated', '', '', '', '')
  ON CONFLICT (id) DO UPDATE SET encrypted_password = EXCLUDED.encrypted_password, aud = 'authenticated';

  -- Entreprise (Company)
  INSERT INTO auth.users (id, aud, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES (company_id, 'authenticated', '00000000-0000-0000-0000-000000000000', 'company@wigo.test', pass_hash, now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Wigo Location", "role": "company"}', now(), now(), 'authenticated', '', '', '', '')
  ON CONFLICT (id) DO UPDATE SET encrypted_password = EXCLUDED.encrypted_password, aud = 'authenticated';

  -- Chauffeur (Driver)
  INSERT INTO auth.users (id, aud, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES (driver_id, 'authenticated', '00000000-0000-0000-0000-000000000000', 'driver@wigo.test', pass_hash, now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Jean Chauffeur", "role": "driver"}', now(), now(), 'authenticated', '', '', '', '')
  ON CONFLICT (id) DO UPDATE SET encrypted_password = EXCLUDED.encrypted_password, aud = 'authenticated';

  -- Client
  INSERT INTO auth.users (id, aud, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES (client_id, 'authenticated', '00000000-0000-0000-0000-000000000000', 'client@wigo.test', pass_hash, now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Client Test", "role": "client"}', now(), now(), 'authenticated', '', '', '', '')
  ON CONFLICT (id) DO UPDATE SET encrypted_password = EXCLUDED.encrypted_password, aud = 'authenticated';

  -- B. Forcer la mise à jour des profils existants (si l'utilisateur s'était inscrit manuellement avant)
  UPDATE public.profiles SET role = 'super_admin', full_name = 'Super Admin' WHERE id = admin_id;
  UPDATE public.profiles SET role = 'company', full_name = 'Wigo Location' WHERE id = company_id;
  UPDATE public.profiles SET role = 'driver', full_name = 'Jean Chauffeur' WHERE id = driver_id;
  UPDATE public.profiles SET role = 'client', full_name = 'Client Test' WHERE id = client_id;

  -- C. Création des entités spécifiques si elles n'existent pas déjà
  
  -- Entreprise: insérer dans public.companies
  INSERT INTO public.companies (user_id, name, city, phone, description, is_verified)
  VALUES (company_id, 'Wigo Location', 'Casablanca', '+212600000000', 'Agence de location premium', true)
  ON CONFLICT DO NOTHING;

  -- Chauffeur: insérer dans public.drivers
  INSERT INTO public.drivers (user_id, city, experience_years, is_verified, is_available)
  VALUES (driver_id, 'Rabat', 5, true, true)
  ON CONFLICT DO NOTHING;

END $$;
