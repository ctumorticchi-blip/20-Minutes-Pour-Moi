# 20 Minutes Pour Moi

20 minutes par jour pour retrouver force, mobilité, équilibre et confiance dans son corps.

Une application web mobile-first qui fonctionne comme un coach sportif quotidien, simple et
rassurant, pour une reprise progressive de l'activité physique — pensée en premier lieu pour
Marie, 68 ans, mais conçue pour s'étendre à d'autres profils 60+.

Voir [`docs/PRODUCT.md`](docs/PRODUCT.md) pour la vision produit, [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
pour l'architecture technique, et [`docs/ILLUSTRATIONS.md`](docs/ILLUSTRATIONS.md) pour la
direction artistique et le système d'illustrations.

## Stack

Vite · React 19 · TypeScript strict · Tailwind CSS 4 · React Router · Vitest · ESLint.

Tout tourne côté client : aucun backend, aucune authentification, aucune API externe. Les
données (profil, check-ins, séances terminées, progression) sont stockées dans `localStorage`
via une abstraction dédiée (`src/shared/storage`).

## Démarrer

```bash
npm install
npm run dev       # serveur de développement
npm run build     # build de production (tsc -b && vite build)
npm test          # suite de tests Vitest
npm run lint      # ESLint
npm run typecheck # vérification TypeScript seule
```

## Essayer rapidement

Au premier écran de l'onboarding, un lien "Essayer avec le profil de démonstration" charge le
profil de Marie (68 ans, reprise, chaise + tapis) et va directement à la page Aujourd'hui — utile
pour tester le parcours complet sans remplir le formulaire.

## Déploiement

Le projet est un site statique standard (`vite build` produit `dist/`) et se déploie tel quel sur
Vercel, Netlify ou tout hébergeur statique — aucune configuration serveur n'est nécessaire.
