# ARCHITECTURE.md — 20 Minutes Pour Moi

## Structure des dossiers

```
src/
  app/            Shell applicatif : App.tsx, router.tsx, providers/ (état persisté)
  engine/         Logique métier pure — profile, program, workout, adaptation, history, recovery, progress
  sport-data/     Contenu spécifique au produit : catalogue d'exercices, programme, textes éditoriaux
  features/       Écrans et composants d'UI métier (onboarding, today, workout, feedback, program, progress, profile)
  shared/         Briques communes : components UI, hooks, storage, types, utils
  assets/         Emplacement des futures illustrations d'exercices
  test/           Fixtures partagées par les tests, setup Vitest
```

Règle suivie partout : **`engine/` ne dépend jamais de `features/`**, et les composants React ne
contiennent pas de logique métier significative — ils appellent le moteur et affichent son
résultat.

## Séparation engine / sport-data / features

- **`engine/`** est composé de fonctions pures (mêmes entrées → même sortie, sans effet de bord).
  Il ne connaît que des types (`shared/types`) et reçoit ses données (profil, catalogue
  d'exercices, historique) en paramètres — jamais en important `sport-data` directement dans le
  cœur du calcul (`selectExercisesForWorkout`, `adaptWorkout`, `analyzeTrainingHistory` prennent
  tous le catalogue d'exercices en argument). Cela les rend triviaux à tester avec des fixtures
  minimalistes (`src/test/fixtures.ts`), indépendamment du contenu réel.
- **`sport-data/`** contient tout ce qui est spécifique au produit "Move" (fitness) : le catalogue
  d'exercices, le gabarit de semaine, les phases du programme 12 semaines, les constantes de
  progression, les textes éditoriaux. C'est la seule couche qui changerait si on créait un
  deuxième produit (course à pied, natation…) sur le même moteur.
- **`features/`** assemble `engine/` + `sport-data/` + `shared/components` pour produire un écran.
  Un hook (`shared/hooks/useTrainingContext.ts`) fait le pont : il lit l'état persisté
  (`AppDataProvider`) et appelle les fonctions pures du moteur pour produire les données dont un
  écran a besoin — la page elle-même ne fait qu'afficher.

## Modèles principaux

- `UserProfile`, `DailyEnergy` / `DailyPainArea` (`shared/types/profile.ts`, `daily.ts`)
- `MoveExercise` : catégorie, position, équipement requis, `avoidWith` (zones sensibles à éviter),
  `bodyAreas` (zones sollicitées), `repeatability` (`daily` / `frequent` / `normal` /
  `recovery_sensitive`), `illustrationKey`.
- `MoveWorkout` / `WorkoutExercise` : une séance = échauffement + corps de séance + retour au
  calme, toujours ≤ 20 minutes (`estimatedDurationMinutes` est recalculé, jamais scénarisé).
- `ProgramPhase` : 4 phases sur 12 semaines, avec `volumeMultiplier` et `difficultyCap`.
- `TrainingHistorySummary` / `BodyAreaLoad` : la mémoire d'entraînement (voir plus bas).
- `WorkoutCompletion` : ce qui est réellement enregistré après une séance (feedback, énergie,
  douleur, exercices effectués).

## Le pipeline d'une séance

`src/engine/workout/generateWorkout.ts` orchestre tout, dans cet ordre :

1. **`analyzeTrainingHistory`** (`engine/history/`) lit les séances terminées et les check-ins des
   7 derniers jours et produit un résumé : séances complétées, exercices récents, dernière date
   de réalisation par exercice, fréquence par catégorie, ce qui a été fait la veille, feedback et
   douleurs récents. Une séance manquée n'apparaît jamais comme réalisée — elle n'existe
   simplement pas dans les données, donc elle ne compte pas.
2. **`computeBodyAreaLoads`** (`engine/recovery/`) estime, de façon simple et déterministe, la
   charge récente par zone corporelle : poids `3` pour hier, `2` pour il y a 2–3 jours, `1` pour
   4–7 jours, `0` au-delà. Ce score sert uniquement à organiser le programme — il n'est jamais
   présenté comme une mesure physiologique.
3. **`selectExercisesForWorkout`** (`engine/workout/`) choisit les exercices de chaque section
   (échauffement / corps / retour au calme) parmi le catalogue compatible avec le profil,
   l'équipement, la douleur du jour et le plafond de difficulté de la phase. Le classement est un
   score déterministe (plus petit = meilleur) qui pénalise : la répétition d'un exercice
   `recovery_sensitive` fait la veille (+20), d'un exercice `normal` fait la veille (+8), la
   réutilisation récente d'un exercice (jusqu'à +5, dégressif), et le fait de solliciter une zone
   corporelle encore chargée (+4 par zone). Les égalités sont tranchées par ordre alphabétique
   d'identifiant : à catalogue et historique identiques, le résultat est toujours identique.
4. **`buildWorkout`** assemble la séance avec les nombres de répétitions/durée/séries de la phase
   en cours, puis **`enforceMaxDuration`** réduit d'abord les séries multiples puis, si besoin
   encore, retire les derniers exercices du corps de séance jusqu'à repasser sous 20 minutes — un
   filet de sécurité garanti par construction, pas par un réglage manuel des nombres.
5. **`adaptWorkout`** (`engine/adaptation/`) ajuste ensuite cette séance planifiée à l'état du
   jour : un second filtre de sécurité retire ou remplace tout exercice devenu incompatible avec
   la douleur signalée, puis un facteur de volume (voir ci-dessous) réduit ou augmente légèrement
   répétitions et durées du corps de séance — jamais l'échauffement ni le retour au calme, qui
   restent une constante rassurante.

Le facteur de volume combine : `tired` ×0.8, `energetic` ×1.05, un dernier feedback `too_hard`
×0.9, deux derniers feedbacks `too_easy` ×1.1, et une réduction renforcée quand fatigue et séance
jugée difficile la veille se combinent. Le résultat est toujours borné à `[0.6, 1.15]` et n'ajoute
jamais de série.

Comme tout le pipeline est pur et déterministe, **la séance n'est jamais stockée telle quelle** :
la page Aujourd'hui et le lecteur de séance la recalculent tous les deux à partir des mêmes
données persistées (profil, check-in du jour, historique), et obtiennent donc toujours le même
résultat — y compris après un rafraîchissement de la page.

## Stockage

`src/shared/storage/` expose une seule abstraction (`storage.*`) au-dessus de `localStorage` ;
aucun autre fichier n'appelle `localStorage` directement. Tout l'état est conservé sous une seule
clé racine (`keys.ts`), avec un `schemaVersion` (`schema.ts`) et une fonction `migrateSchema` qui
complète défensivement les champs manquants — le point d'entrée pour de futures migrations. Sont
persistés : profil, date de début de programme, check-ins quotidiens, séances terminées,
résultats de mini-tests futurs, préférences.

`AppDataProvider` (`app/providers/`) est le seul endroit qui lit/écrit cette abstraction côté
React : c'est un miroir vivant du stockage, exposé via `useAppData()`.

## Choix techniques

- **Tailwind CSS 4** avec une palette de tokens (`--color-sage-*`, `--color-terracotta-*`,
  `--color-warmgray-*`, `--color-cream*`) définie dans `src/index.css`, dérivée de la direction
  artistique validée en M1 (vert profond `#2E7D6B`, crème `#F7F5F2`, beige `#EDE7DD`, terracotta
  doux `#F4C97A`, texte `#333333` — voir `docs/ILLUSTRATIONS.md`). Chaque rampe va de 50 à 900 et
  ses teintes 400+ sont choisies pour rester lisibles en texte (≥ 4.5:1 sur fond clair) : ne
  jamais utiliser une teinte non définie dans `@theme`, Tailwind ne génère alors aucune classe et
  l'élément perd silencieusement son style.
- Pas de shadcn/ui : les besoins d'UI du M0 (cartes, boutons, sélecteurs) sont suffisamment
  simples pour rester en composants maison légers dans `shared/components/`, ce qui évite une
  dépendance supplémentaire pour un gain marginal à ce stade.
- **React Router 7** en mode déclaratif (`<Routes>`), avec un garde `RequireProfile` qui renvoie
  vers l'onboarding tant qu'aucun profil n'existe.
- **Illustrations** : chaque exercice porte un `illustrationKey` stable. `getIllustrationAsset`
  (`assets/exercises/index.ts`) est l'unique point de résolution `illustrationKey → asset` (une
  image seule ou une séquence de quelques étapes) ; `ExerciseIllustration`
  (`shared/components/`) est le seul composant qui l'appelle et qui doit importer une image
  d'exercice, avec repli systématique vers un placeholder par catégorie tant qu'aucun asset réel
  n'est enregistré. Détail complet — direction artistique, formats, `alt`, comment brancher un
  vrai asset — dans `docs/ILLUSTRATIONS.md`.

## Comment le moteur pourrait être réutilisé plus tard

`engine/` ne reçoit que des types et des fonctions en paramètres (catalogue d'exercices,
historique, profil) — il n'importe jamais `sport-data/`. C'est délibéré : un futur produit
(course à pied, natation…) pourrait réutiliser telles quelles les fonctions de
`engine/history/`, `engine/recovery/` et la forme générale du pipeline d'adaptation, en leur
fournissant son propre catalogue et ses propres règles de sélection, sans toucher au moteur.

Le M0 ne construit pas cette extraction (pas de package séparé, pas de types
`TrainingSession`/`RecoveryState` génériques en plus des types `Move*` déjà spécifiques) : avec un
seul produit à date, cela ajouterait de la complexité sans bénéfice immédiat. Le point de coupe
resterait le même qu'aujourd'hui — remplacer les paramètres `MoveExercise[]` / `MoveWorkout` par
des types génériques équivalents — le jour où un deuxième produit sportif est réellement engagé.
