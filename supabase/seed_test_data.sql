-- ==============================================================================
-- SCRIPT DE SEEDING DE DONNÉES DE TEST POUR LE DASHBOARD SUPER ADMIN
-- À exécuter dans l'éditeur SQL de votre projet Supabase
-- Ce script va activer des abonnements et créer des réservations de test
-- ==============================================================================

DO $$
DECLARE
  company_id uuid;
  driver_id uuid;
  client_id uuid;
  car_id uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- 1. Récupération des identifiants existants
  SELECT id INTO company_id FROM public.companies WHERE user_id = '00000000-0000-0000-0000-000000000002';
  SELECT id INTO driver_id FROM public.drivers WHERE user_id = '00000000-0000-0000-0000-000000000003';
  SELECT id INTO client_id FROM public.profiles WHERE email = 'client@wigo.test';

  -- Si les IDs de base n'existent pas (car non générés par seed_test_accounts.sql), 
  -- on les récupère dynamiquement par email
  IF company_id IS NULL THEN
    SELECT c.id INTO company_id FROM public.companies c JOIN public.profiles p ON c.user_id = p.id WHERE p.email = 'company@wigo.test';
  END IF;
  IF driver_id IS NULL THEN
    SELECT d.id INTO driver_id FROM public.drivers d JOIN public.profiles p ON d.user_id = p.id WHERE p.email = 'driver@wigo.test';
  END IF;
  IF client_id IS NULL THEN
    SELECT id INTO client_id FROM public.profiles WHERE email = 'client@wigo.test';
  END IF;

  -- 2. Activation des abonnements payants de test pour le MRR
  -- Loueur passe en plan "Pro" (49€/mois)
  UPDATE public.companies 
  SET subscription_plan = 'pro', subscription_status = 'active'
  WHERE id = company_id;

  -- Chauffeur passe en plan "Elite" (149€/mois)
  UPDATE public.drivers 
  SET subscription_plan = 'elite', subscription_status = 'active'
  WHERE id = driver_id;

  -- MRR attendu : 49€ + 149€ = 198€ / mois
  -- Abonnés Actifs attendus : 2

  -- 3. Création d'une voiture de test si besoin
  IF company_id IS NOT NULL THEN
    INSERT INTO public.cars (id, company_id, brand, model, year, fuel, transmission, seats, price_day, city, status)
    VALUES (car_id, company_id, 'Audi', 'A4', 2022, 'diesel', 'automatique', 5, 89.00, 'Casablanca', 'disponible')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- 4. Ajout de réservations de test pour le volume de ventes
  IF car_id IS NOT NULL AND client_id IS NOT NULL AND company_id IS NOT NULL THEN
    -- Réservation 1
    INSERT INTO public.bookings (car_id, customer_id, company_id, start_date, end_date, total_price, status)
    VALUES (car_id, client_id, company_id, current_date - 5, current_date - 2, 267.00, 'completed')
    ON CONFLICT DO NOTHING;

    -- Réservation 2 (active)
    INSERT INTO public.bookings (car_id, customer_id, company_id, start_date, end_date, total_price, status)
    VALUES (car_id, client_id, company_id, current_date, current_date + 3, 356.00, 'confirmed')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 5. Ajout de réservations chauffeurs (missions)
  IF driver_id IS NOT NULL AND client_id IS NOT NULL THEN
    INSERT INTO public.driver_bookings (driver_id, customer_id, start_date, duration_hours, mission_type, total_price, status)
    VALUES (driver_id, client_id, current_date - 1, 8.00, 'journalier', 150.00, 'completed')
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
