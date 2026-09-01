# ILLUSTRATIONS.md — 20 Minutes Pour Moi

## Direction artistique

Style : chaleureux, lumineux, calme, premium accessible, naturel, adulte, rassurant, légèrement
méditerranéen. Jamais médical, jamais "senior caricatural", jamais bodybuilding.

**Palette** (définie dans `src/index.css`, section `@theme`) :

- vert profond `#2E7D6B` (`--color-sage-600`) — couleur d'action principale
- crème `#F7F5F2` (`--color-cream`) — fond de page
- beige chaud `#EDE7DD` (`--color-cream-dark` / `--color-warmgray-100`)
- terracotta / jaune doux `#F4C97A` (`--color-terracotta-300`) — accent décoratif
- texte `#333333` (`--color-warmgray-900`)

Chaque famille (`sage`, `terracotta`, `warmgray`) décline une rampe complète 50→900 dérivée de ces
ancrages, dont les teintes 400 à 900 sont choisies pour rester lisibles (contraste ≥ 4.5:1 sur fond
clair) — voir le commentaire en tête de `src/index.css` pour le détail. **Ne pas ajouter de
nouvelle couleur** sans dériver depuis cette même palette.

**Personnage** (pour les illustrations définitives, fournies séparément — voir plus bas) : femme
d'environ 45-60 ans, morphologie réaliste, cheveux bruns attachés, attitude naturelle, haut vert
sauge, legging noir, baskets claires. Style semi-réaliste / éditorial premium — jamais cartoon
enfantin, jamais photo de salle de sport agressive. Décor : intérieur lumineux, mur crème, sol bois
clair, plante verte discrète, chaise bois et tapis vert sauge quand l'exercice les utilise.

## Convention `illustrationKey`

Chaque `MoveExercise` porte un `illustrationKey` stable (aujourd'hui identique à son `id`, par
exemple `"sit-to-stand"`). C'est la seule chose que le contenu métier (`sport-data/exercises/`)
connaît des illustrations — jamais un chemin de fichier, jamais un import d'image.

## Résolution centralisée

```
src/assets/exercises/
  types.ts   IllustrationStep, ExerciseIllustrationAsset
  index.ts   getIllustrationAsset(illustrationKey) → asset | undefined
```

`ExerciseIllustrationAsset` a deux formes possibles :

```ts
{ kind: "single"; src: string }
{ kind: "steps"; steps: { src: string; label: string }[] }
```

`kind: "single"` couvre la grande majorité des exercices (une position ou un mouvement simple).
`kind: "steps"` sert aux mouvements où montrer la progression aide vraiment à comprendre (l'exemple
donné par la direction artistique est l'assis-debout : position assise → inclinaison → montée →
debout) — 2 à 4 images, jamais plus.

`getIllustrationAsset` est **le seul point de résolution** `illustrationKey → asset` de toute
l'application. Aujourd'hui la table qu'il consulte est vide : toutes les fonctions renvoient
`undefined`, et c'est normal — aucune illustration définitive n'existe encore dans ce dépôt (elles
seront fournies séparément, voir plus bas).

`ExerciseIllustration` (`src/shared/components/ExerciseIllustration.tsx`) est le **seul composant**
qui appelle `getIllustrationAsset` et le seul qui doit jamais importer un fichier image
d'exercice — aucun autre écran ne doit disperser des imports d'illustrations. Il gère les trois cas
possibles :

1. **Aucun asset** → silhouette générique colorée par catégorie + label texte (jamais l'information
   uniquement par la couleur). C'est le seul cas actif aujourd'hui.
2. **`single`** → une image plein cadre (`aspect-[4/3]`, `object-cover`), `alt` = nom de l'exercice.
3. **`steps`** → une mini séquence horizontale (pas de carousel, rien à glisser) : chaque étape dans
   son propre cadre `aspect-[3/4]`, avec un `alt` du type `"Assis-debout — étape 2 : Poussée dans
   les jambes"`.

## Comment ajouter ou remplacer une illustration

1. Déposer le fichier (SVG, WebP ou PNG) dans `src/assets/exercises/` — un sous-dossier par
   exercice est recommandé pour une séquence, par exemple :
   ```
   src/assets/exercises/sit-to-stand/
     start.webp
     rise.webp
     standing.webp
   ```
2. L'importer et l'ajouter à la table `ILLUSTRATION_ASSETS` dans
   `src/assets/exercises/index.ts` (l'exemple commenté dans ce fichier montre la syntaxe exacte
   pour les deux cas `single` et `steps`).
3. Rien d'autre à modifier : `ExerciseIllustration` bascule automatiquement de la silhouette de
   repli vers la vraie image dès que `getIllustrationAsset` la renvoie, sur tous les écrans qui
   l'affichent (lecteur de séance aujourd'hui, pages futures ensuite).

Le Workout Player n'affiche que les illustrations elles-mêmes : le texte explicatif (position de
départ, étapes, respiration, points d'attention) reste toujours du HTML dans
`MoveExercise`/`HowToAccordion`, jamais incrusté dans l'image. Cela garde le contenu responsive,
accessible, traduisible et corrigeable indépendamment de l'art.

## Formats et dimensions recommandées

- **Format** : WebP en priorité (poids réduit à qualité égale) ; SVG pour un style trait/plat ;
  PNG en dernier recours.
- **Ratio** : 4:3 pour une image seule (`aspect-[4/3]`, plein cadre), 3:4 pour chaque étape d'une
  séquence (`aspect-[3/4]`, cadres plus étroits côte à côte).
- **Résolution source** : suffisamment grande pour un affichage plein écran sur un smartphone
  large (≈ 1200px de large pour une image seule), exportée ensuite en WebP compressé.
- **Poids** : viser < 80 Ko par image. Les `<img>` sont chargées avec `loading="lazy"` — seule
  l'illustration de l'exercice affiché à l'écran (et les suivantes une fois visibles) pèse sur le
  chargement initial.

## `alt` text

- Image unique : le nom de l'exercice (`exercise.name`), qui donne déjà tout le contexte utile.
- Étape d'une séquence : `"{nom} — étape {n} : {label de l'étape}"`, pour qu'une lectrice
  d'écran comprenne à la fois quel exercice et quelle phase du mouvement elle atteint.
- Silhouette de repli : décorative (`aria-hidden`), puisque le nom de l'exercice est déjà le titre
  visible juste au-dessus et que le label de catégorie reste affiché en texte à côté d'elle.

## Repli (fallback)

Tant qu'aucun asset réel n'existe pour une clé, `ExerciseIllustration` affiche toujours la même
silhouette calme, teintée selon la catégorie (`strength`, `cardio`, `mobility`, `pilates`,
`balance` ont chacune leur teinte de la palette). Ce repli n'est jamais une erreur visible ni un
cadre vide — c'est un état normal et déjà "fini" visuellement, pas un espace réservé cassé.
