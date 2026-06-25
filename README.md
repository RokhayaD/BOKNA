# Bokna — Plateforme citoyenne du Sénégal

Bokna permet aux citoyens sénégalais de découvrir leur commune, proposer des
idées, signaler des problèmes, participer à la vie municipale (ou se
présenter comme maire sous la coalition Bokna) et suivre l'actualité locale
("Lu xew tay"), avec un back-office national de modération et de statistiques.

## Stack technique

- **Next.js 16** (App Router, TypeScript, Server Actions) — frontend + backend unifiés
- **Tailwind CSS 4** pour l'interface
- **PostgreSQL + Prisma 6** pour la persistance
- **NextAuth.js (Auth.js v5)** pour l'authentification (rôles `CITIZEN` / `ADMIN`)
- **react-leaflet / OpenStreetMap** pour la carte de localisation des communes (pas de clé API requise)
- **Zod** pour la validation des formulaires et actions serveur

## Démarrer en local

### 1. Base de données

Un `docker-compose.yml` est fourni pour lancer PostgreSQL localement (exposé
sur le port **5544** pour éviter les conflits avec un Postgres déjà installé
sur la machine) :

```bash
docker compose up -d
```

### 2. Variables d'environnement

Le fichier `.env` est déjà configuré pour pointer vers la base Docker locale.
Adaptez `DATABASE_URL`, `AUTH_SECRET` et les variables `SMTP_*` (optionnelles,
sans elles les emails sont simplement ignorés) si besoin.

### 3. Installation, migration et données de démonstration

```bash
npm install
npx prisma migrate dev
npm run db:seed
```

Le seed crée :
- les 14 régions, 46 départements et le référentiel **officiel complet des
  551 communes du Sénégal**, couvrant désormais les 14 régions :
  - **Dakar** (52 communes : Dakar, Pikine, Guédiawaye, Rufisque, Keur Massar)
  - **Ziguinchor** (29 communes : Bignona, Oussouye, Ziguinchor)
  - **Fatick** (40 communes : Fatick, Foundiougne, Gossas)
  - **Kaolack** (41 communes : Guinguinéo, Kaolack, Nioro du Rip)
  - **Thiès** (49 communes : Mbour, Thiès, Tivaouane)
  - **Kédougou** (19 communes : Kédougou, Salémata, Saraya)
  - **Louga** (55 communes : Kébémer, Linguère, Louga)
  - **Matam** (26 communes : Kanel, Matam, Ranérou Ferlo)
  - **Kaffrine** (33 communes : Birkelane, Kaffrine, Koungheul, Malem Hodar)
  - **Tambacounda** (46 communes : Bakel, Goudiry, Koumpentoum, Tambacounda)
  - **Kolda** (40 communes : Kolda, Médina Yoro Foulah, Vélingara)
  - **Sédhiou** (43 communes : Bounkiling, Goudomp, Sédhiou)
  - **Saint-Louis** (38 communes : Dagana, Podor, Saint-Louis)
  - **Diourbel** (40 communes : Bambey, Diourbel, Mbacké)
- un compte administrateur : `admin@bokna.sn` / `admin123` ;
- un compte citoyen de démonstration : `citoyen@bokna.sn` / `citoyen123` ;
- quelques projets, une idée et une actualité d'exemple.

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Limitations connues du MVP (à traiter avant une mise en production)

- **Coordonnées approximatives** : les coordonnées (latitude/longitude) de
  chaque commune restent des estimations à usage de démonstration — à
  affiner avec des données géographiques officielles (cadastre, IGN) avant
  une mise en production.
- **Population partiellement officielle** : les populations sont issues du
  recensement 2023 pour les régions de Saint-Louis et Diourbel ; ailleurs,
  ce sont des ordres de grandeur approximatifs pour les chefs-lieux, et le
  champ est laissé vide pour le reste des communes plutôt que d'afficher un
  chiffre inventé. À compléter avec les données ANSD officielles.
- **Emails transactionnels** : non implémentés (notifications in-app
  uniquement pour l'instant).
- **Upload de pièces jointes** : les idées/actualités ne supportent pas
  encore l'ajout de photos.

## Structure du projet

- `src/app` — pages et routes (App Router), y compris `/admin` (protégé par rôle)
- `src/actions` — Server Actions (mutations : idées, votes, commentaires, participation, actualités, géo)
- `src/components` — composants UI partagés (formulaires, sélecteur région/département/commune, carte, etc.)
- `src/lib` — Prisma client, configuration NextAuth, validation Zod, helpers géo
- `prisma/schema.prisma` — modèle de données
- `prisma/seed-data` — données géographiques du Sénégal (régions/départements/communes)
- `prisma/seed.ts` — script de seed
