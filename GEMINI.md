Prompt Complet — SaaS Marketplace de Location de Voitures & Chauffeurs
Contexte du Projet
Créer une plateforme SaaS moderne de mobilité permettant :
aux entreprises de location de voitures de publier leurs véhicules,
aux chauffeurs indépendants de proposer leurs services,
aux clients de réserver :
une voiture,
un chauffeur,
ou une voiture avec chauffeur.
La plateforme fonctionne sous forme de marketplace centralisée.
IMPORTANT :
Il ne faut PAS créer de mini-sites individuels pour les entreprises.
Toutes les annonces doivent être regroupées dans une seule marketplace publique.

Stack Technique Obligatoire
Frontend
Next.js (App Router)
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
Backend
Supabase
Supabase Auth
Supabase Storage
Supabase RLS
Paiements
Stripe
Gestion abonnements récurrents
Facturation automatique
Déploiement
Vercel
GitHub CI/CD

Architecture Générale
Créer une architecture scalable avec :
séparation frontend/backend,
composants réutilisables,
services modulaires,
hooks personnalisés,
API routes propres,
gestion d’état centralisée,
optimisation SEO,
performances Lighthouse élevées.

Types d’Utilisateurs
1. Super Admin
Gestion complète de la plateforme.
2. Entreprises de Location
Publication et gestion des véhicules.
3. Chauffeurs Indépendants
Proposition de services de conduite.
4. Clients
Réservation voitures et chauffeurs.

Fonctionnalités Entreprises de Location
Les entreprises peuvent :
créer un compte,
souscrire à un abonnement,
publier des voitures,
gérer leurs disponibilités,
recevoir des réservations,
gérer leurs revenus,
suivre leurs statistiques.

Abonnements Entreprises
Plan Basic
Jusqu’à 10 voitures
Statistiques basiques
Plan Pro
Jusqu’à 50 voitures
Mise en avant marketplace
Dashboard avancé
Plan Premium
Voitures illimitées
Priorité marketplace
Analytics avancés
Badge premium

Gestion des Véhicules
Chaque voiture possède :
marque,
modèle,
année,
transmission,
carburant,
nombre de places,
prix par jour,
prix par semaine,
ville,
description,
kilométrage,
climatisation,
caution,
disponibilité,
galerie photos.
Statuts :
disponible,
louée,
maintenance.

Marketplace Voitures
Créer une marketplace publique affichant toutes les voitures.
Fonctionnalités
recherche instantanée,
filtres avancés,
tri par prix,
tri par popularité,
tri par note,
pagination,
responsive mobile,
SEO optimisé.
Filtres
ville,
prix,
marque,
catégorie,
carburant,
transmission,
disponibilité.

Module Chauffeurs
Les chauffeurs indépendants doivent pouvoir :
créer un compte professionnel,
souscrire à un abonnement,
recevoir des missions,
gérer leurs disponibilités,
apparaître dans la marketplace chauffeurs.

Profil Chauffeur
Chaque chauffeur possède :
photo,
nom,
téléphone,
ville,
langues parlées,
années d’expérience,
type de permis,
disponibilité,
tarif horaire,
tarif journalier,
note moyenne,
nombre de missions,
statut vérifié.

Vérification Chauffeurs (KYC)
Le système doit permettre :
upload permis,
upload CIN/passeport,
selfie vérification,
validation admin.
Un chauffeur non validé ne peut pas accepter de missions.

Marketplace Chauffeurs
Créer une marketplace dédiée chauffeurs.
Fonctionnalités
recherche,
filtres,
géolocalisation,
classement qualité,
disponibilité en temps réel.
Filtres
ville,
langue,
tarif,
note,
expérience,
disponibilité.

Types de Réservation
Option 1
Voiture seule.
Option 2
Voiture + chauffeur.
Option 3
Chauffeur uniquement.

Système de Réservation
Le client peut :
choisir dates,
choisir horaires,
sélectionner lieu,
réserver immédiatement,
payer acompte,
recevoir confirmation.
Les entreprises/chauffeurs reçoivent :
notification,
détails mission,
coordonnées client.

Système d’Avis & Notation
Après chaque réservation terminée :
Le client peut :
donner une note sur 5,
laisser un commentaire.
Critères :
qualité service,
ponctualité,
propreté,
professionnalisme.
IMPORTANT :
un seul avis par réservation,
seuls les clients ayant réellement réservé peuvent noter.

Réputation & Classement
Chaque entreprise/chauffeur possède :
note moyenne,
nombre d’avis,
taux satisfaction,
score qualité,
badges.
Badges
Top Loueur
Chauffeur Premium
Très Réactif
Meilleure Note
Super Service

Algorithme de Ranking Marketplace
Le classement doit prendre en compte :
note moyenne,
nombre d’avis,
nombre de réservations,
réactivité,
taux d’annulation,
abonnement,
activité récente,
taux satisfaction.
Les meilleurs profils doivent être affichés en priorité.

SaaS Chauffeurs — Abonnements
Plan Starter
Maximum 10 missions accomplies
Visibilité standard
Plan Pro
Missions illimitées
Boost marketplace
Badge vérifié
Plan Elite
Priorité maximale
Missions VIP
Badge premium
Support prioritaire

Limitation de Missions
Le système doit :
compter les missions terminées,
bloquer les nouvelles réservations après la limite,
demander automatiquement un upgrade.
IMPORTANT :
Ne compter QUE les missions terminées avec succès.
Ne pas compter :
annulations,
refus,
réservations expirées.

Blocage Automatique Plan Starter
Après 10 missions accomplies :
Le système doit :
désactiver le profil,
masquer le chauffeur dans les résultats,
bloquer nouvelles missions,
afficher popup upgrade,
envoyer notification email.
Message :
“Vous avez atteint la limite de missions de votre abonnement Starter. Passez à une offre supérieure pour continuer à utiliser la plateforme.”

Réactivation Après Upgrade
Lorsqu’un chauffeur :
renouvelle abonnement,
change de plan,
passe à Pro ou Elite,
Le système doit :
réactiver automatiquement le profil,
réactiver les réservations,
mettre à jour les quotas.

Dashboard Entreprise
Fonctionnalités :
gestion véhicules,
réservations,
revenus,
statistiques,
gestion abonnement,
avis clients.
KPIs
revenus mensuels,
taux occupation,
nombre réservations,
voitures populaires.

Dashboard Chauffeur
Fonctionnalités :
calendrier,
missions,
revenus,
statistiques,
gestion disponibilité,
historique missions,
gestion avis,
gestion abonnement.
KPIs
revenus mensuels,
note moyenne,
missions restantes,
taux satisfaction,
temps réponse.

Dashboard Admin
Le Super Admin peut :
gérer utilisateurs,
gérer entreprises,
gérer chauffeurs,
gérer abonnements,
modérer avis,
gérer paiements,
voir statistiques globales,
suspendre comptes,
gérer contenu marketplace.

Paiements Stripe
Créer :
abonnements mensuels,
abonnements annuels,
renouvellement automatique,
gestion factures,
gestion échecs paiement,
suspension automatique comptes impayés.

Base de Données Supabase
users
id
role
email
created_at
companies
id
name
city
phone
subscription_plan
stripe_customer_id
cars
id
company_id
brand
model
year
fuel
transmission
city
price_day
status
car_images
id
car_id
image_url
bookings
id
car_id
customer_id
start_date
end_date
total_price
status
reviews
id
booking_id
company_id
car_id
rating
comment
drivers
id
user_id
city
experience_years
hourly_rate
daily_rate
verified
rating_average
driver_documents
id
driver_id
license_url
identity_url
validation_status
driver_bookings
id
driver_id
customer_id
start_date
duration_hours
mission_type
status
driver_reviews
id
driver_booking_id
rating
comment
driver_subscriptions
id
driver_id
stripe_subscription_id
status
current_period_end
driver_usage_stats
id
driver_id
completed_missions
current_plan
quota_reached

Sécurité
Mettre en place :
Supabase RLS,
validation inputs,
protection API,
anti-spam,
limitation requêtes,
protection uploads,
sécurisation Stripe webhooks.

SEO & Performance
Optimiser :
métadonnées dynamiques,
schema.org,
sitemap,
Open Graph,
images optimisées,
SSR/ISR,
performance Lighthouse.

UI / UX
Créer une interface :
premium,
moderne,
rapide,
minimaliste,
mobile-first.
Utiliser :
animations Framer Motion,
composants réutilisables,
design professionnel SaaS moderne.

Fonctionnalités Avancées Recommandées
favoris clients,
notifications temps réel,
WhatsApp API,
géolocalisation,
carte interactive,
coupons promotionnels,
système d’affiliation,
multi-langues (FR / EN / AR),
PWA mobile,
analytics avancés,
recommandations intelligentes.

Objectif Final
Construire une plateforme hybride combinant :
SaaS B2B,
marketplace automobile,
plateforme chauffeurs,
réservation mobilité,
gestion d’abonnements,
système réputation qualité.
La plateforme doit être scalable et capable de gérer :
plusieurs milliers de véhicules,
des centaines d’entreprises,
des milliers de chauffeurs,
un trafic important.
Le code doit être :
propre,
maintenable,
scalable,
optimisé pour Vercel + Supabase.