# PRODUCT.md — 20 Minutes Pour Moi

## Promesse

> 20 minutes par jour pour retrouver force, mobilité, équilibre et confiance dans son corps.

Ce n'est pas une bibliothèque d'exercices : c'est un coach quotidien. Le produit suit la boucle

```
Profil → état du jour → programme prévu → historique récent → récupération
       → adaptation → séance → feedback → mémorisation → adaptation des séances futures
```

à chaque ouverture de l'application.

## Persona (M0)

**Marie, 68 ans.** Reprend une activité physique après une pause, veut retrouver énergie, force,
mobilité et équilibre. Matériel : une chaise et un tapis. Aucune zone sensible déclarée par
défaut. Un profil de démonstration correspondant à Marie est chargeable en un clic depuis
l'onboarding.

L'architecture (types génériques, catalogue d'exercices séparé du moteur) permet d'étendre à
d'autres profils 60+ sans réécrire le moteur — voir `docs/ARCHITECTURE.md`.

## Ce que le produit n'est pas

Pas de nutrition, de calories, de poids, d'IMC, de classement, de comparaison sociale, de
performance agressive. Aucune séance manquée n'est présentée comme un échec. Le produit ne
diagnostique jamais une douleur et ne fait aucune promesse médicale (voir `HEALTH_DISCLAIMER`
dans `src/sport-data/content/editorial.ts`).

## Principes UX et ton éditorial

- Simple, chaleureux, adulte — jamais infantilisant, jamais culpabilisant.
- Peu de texte par écran, gros boutons (min. 44px), cartes généreuses, contraste élevé.
- Formulations positives : *"On reprend aujourd'hui"*, *"Chaque séance compte"*, plutôt que
  *"Tu as raté ta séance"*.
- Aucune information n'est transmise uniquement par la couleur (labels textuels systématiques).

Tout le texte orienté produit vit dans `src/sport-data/content/editorial.ts`, à l'écart de la
mise en page, pour que le ton reste cohérent et facile à relire d'un seul endroit.

## Le programme de 12 semaines

Quatre phases, chacune avec un volume et un plafond de difficulté croissants
(`src/sport-data/programs/phases.ts`) :

| Semaines | Phase | Objectif |
|---|---|---|
| 1–2 | Je reprends confiance | Apprendre les mouvements, installer une routine, faible volume |
| 3–4 | Je retrouve ma mobilité | Amplitude et fluidité, renforcement doux maintenu |
| 5–8 | Je deviens plus forte | Volume progressif, résistance plus régulière, équilibre renforcé |
| 9–12 | Je me sens en forme | Séances fluides, coordination, volume légèrement supérieur |

Le programme est ancré sur le calendrier : lundi à vendredi correspondent aux 5 séances
hebdomadaires (`src/sport-data/programs/weekTemplate.ts`), le week-end est repos ou marche libre,
sans culpabilisation.

| Jour | Focus |
|---|---|
| Lundi | Renforcement & équilibre |
| Mardi | Mobilité & Pilates |
| Mercredi | Cardio doux |
| Jeudi | Renforcement & posture |
| Vendredi | Pilates & mobilité |
| Samedi / Dimanche | Repos ou marche libre |

L'équilibre est travaillé de façon transversale : chaque jour, pas seulement le lundi.

## Catégories d'exercices

`strength` (renforcement), `cardio` (doux), `mobility`, `pilates` (contrôle / respiration),
`balance`. Environ 35 exercices seed (`src/sport-data/exercises/`), tous low-impact, sans saut,
sans charge lourde, sans mouvement explosif ou technique.

## Logique de progression

Les répétitions, durées, séries et temps de repos ne sont pas décidés exercice par exercice :
ils viennent de constantes par phase (`src/sport-data/programs/progression.ts`), pour rester
lisibles et conservatrices. Seules les catégories `strength` et `balance` gagnent une deuxième
série à partir de la phase 3 ; l'échauffement et le retour au calme restent volontairement
stables sur les 12 semaines.

## Adaptation quotidienne

Avant chaque séance, l'utilisatrice indique son énergie du jour (fatiguée / bien / en forme) et
une éventuelle zone douloureuse. Le moteur (`src/engine/adaptation/adaptWorkout.ts`) ajuste alors
le volume de la séance et retire ou remplace les exercices incompatibles avec la douleur signalée
— jamais un diagnostic, juste une adaptation prudente. Voir `docs/ARCHITECTURE.md` pour le détail
du fonctionnement.

## Feedback et mémoire

À la fin de chaque séance, un feedback simple (difficile / parfaite / facile) est enregistré. Il
influence, avec l'historique des 7 derniers jours, les séances suivantes : une séance jugée
difficile réduit modestement le volume d'une séance similaire ; des séances jugées faciles à
plusieurs reprises permettent une progression modérée, toujours plafonnée par la phase en cours.

## Scope M0

Construit : onboarding, profil, check-in du jour, moteur d'adaptation et de récupération, lecteur
de séance avec minuteur, feedback, pages Programme / Progrès / Profil, navigation mobile, ~35
exercices, programme 12 semaines, tests métier, stockage local versionné.

Non construit (volontairement) : nutrition, authentification, backend, paiement, IA générative,
notifications push, objets connectés, réseau social.

## M0.1 — corrections

Le minuteur d'exercice a été revu en profondeur : il ne démarre plus jamais tout seul (états
`idle` / `running` / `paused` explicites, bouton "Démarrer"), se remet correctement à zéro à
chaque exercice, et propose un bouton "Recommencer". Les 35 exercices ont reçu une position de
départ, une respiration et des points d'attention réellement utilisables — voir "Comment faire cet
exercice ?" ci-dessous.

## M1 — direction artistique et Workout Player

M1 transforme le prototype fonctionnel en une expérience plus aboutie visuellement, sans toucher au
moteur d'entraînement :

- **Palette** dérivée de la direction artistique validée (vert profond, crème, beige chaud,
  terracotta doux, texte `#333333`) — voir `docs/ILLUSTRATIONS.md` pour le détail et les valeurs
  exactes.
- **Système d'illustrations** consolidé : `illustrationKey` → asset résolu au même endroit partout
  (`ExerciseIllustration`), prêt à recevoir de vraies images (image unique ou courte séquence
  d'étapes) sans toucher au contenu métier ni aux écrans quand elles arriveront.
- **Workout Player** repensé autour d'une hiérarchie unique par exercice : catégorie, nom,
  illustration (grande, jamais minuscule), consigne essentielle, puis une seule action principale
  — "Démarrer/Pause/Reprendre/Recommencer" pour un exercice chronométré, "J'ai terminé" pour un
  exercice à répétitions — suivie de la respiration, d'un conseil essentiel, et du détail complet
  dans l'accordéon "Comment faire cet exercice ?" (position de départ, étapes, respiration, points
  d'attention, variations). La progression ("Exercice X sur Y") reste visible en permanence, et un
  très bref accusé de passage ("Très bien 🌿") marque le passage à l'exercice suivant sans jamais
  ralentir le rythme.
- **Fin de séance** réordonnée : durée de la séance affichée avant la question de ressenti, puis un
  message positif simple après le feedback — jamais de score.

## Roadmap (post-M1)

- Illustrations réelles des exercices (l'architecture est prête à les recevoir dès qu'elles sont
  fournies — voir `docs/ILLUSTRATIONS.md`).
- Mini-tests fonctionnels (5 assis-debout chronométrés, équilibre, mobilité d'épaule) : les types
  existent déjà (`src/shared/types/functionalCheck.ts`), l'UI reste à construire.
- Extension du moteur à d'autres profils 60+ puis, plus loin, à d'autres sports (voir la section
  "Réutilisation future" de `docs/ARCHITECTURE.md`).
