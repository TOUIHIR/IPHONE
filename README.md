markdown
# iPhone — Scrollytelling Landing Page

Landing page premium type Apple.com avec animation de démontage 3D pilotée 
par le scroll, utilisant une séquence de 120 images.

## 🎯 Concept

L'iPhone s'affiche en arrière-plan du header (full-bleed), positionné en 
haut à droite dans la composition. Au fur et à mesure que l'utilisateur 
scrolle, l'iPhone se démonte progressivement (frame 1 → frame 120), 
synchronisé avec des sections de texte qui apparaissent en fondu.

## 📁 Structure du projet

3D/
├── index.html # Structure HTML principale
├── style.css # Styles (fond noir uniforme, typographie, layout)
├── script.js # Logique scroll-scrubbing + preload des images
├── IPHONE_FRAMES/ 
└── README.md


## 🖼️ Séquence d'images

- **Nombre de frames** : 120
- **Format** : `ezgif-frame-XXX.jpg` (numérotation sur 3 chiffres, zéro-paddée)
- **Contenu** : démontage progressif de l'iPhone, de l'état assemblé (frame 1) 
  à l'état totalement explosé/démonté (frame 120)
- **Fond des images** : noir pur (#000000), identique au fond de la page 
  pour un rendu sans bord visible

## 🎨 Design

- **Fond** : noir pur (#000000) uniforme sur toute la page, aucune variation 
  entre les sections
- **Typographie** : system-ui / SF Pro Display / SF Pro Text (Inter en fallback)
- **Couleurs texte** : titres en blanc 90%, corps de texte en blanc 60%
- **Accents** : dégradé argent/titane + bleu Apple (#0071E3) pour les CTA

## ⚙️ Fonctionnement technique

### Scroll-scrubbing
- Section `sticky` en pleine hauteur de viewport (100vh)
- Hauteur totale du conteneur de scroll : ~400vh (ajustable)
- La position de scroll (0 à 1) est mappée sur l'index de frame :
```js
  frame = Math.floor(scrollProgress * 119) + 1
```
- Rendu du frame courant sur un `<canvas>` via `requestAnimationFrame` 
  pour une animation fluide sans saccades

### Préchargement des images
- Les 120 images sont préchargées au chargement de la page
- Un loader avec barre de progression (%) s'affiche pendant le préchargement
- La page ne devient visible qu'une fois toutes les images chargées

## 🧩 Sections de la page

1. **Header / Hero** — iPhone en background full-bleed, titre + accroche 
   à gauche
2. **Design Reveal** — démontage du panneau arrière
3. **Camera & Sensors** — module caméra détaché
4. **Performance & Engineering** — batterie, carte logique, bobine de charge
5. **Reassembly & CTA** — réassemblage final + appel à l'action
6. **Specs** — grille de caractéristiques techniques
7. **Gallery** — coloris disponibles
8. **Footer**

## 🚀 Lancer le projet localement

Ouvre simplement `index.html` dans un navigateur, ou utilise une extension 
type **Live Server** dans VS Code pour un rechargement automatique pendant 
le développement.

```bash
# Avec Live Server (extension VS Code)
Clic droit sur index.html > "Open with Live Server"
```

## 📌 Notes importantes

- Le dossier `IPHONE_FRAMES` doit rester au même niveau que `index.html`
- Ne pas renommer les fichiers image (le script JS génère les noms 
  dynamiquement via `padStart(3, '0')`)
- Le fond noir doit rester strictement identique entre les images et le CSS 
  de la page pour éviter tout effet de "bordure visible"

## 🛠️ Stack technique

- HTML5 / CSS3 / JavaScript vanilla
- Canvas API pour le rendu des frames
- Pas de framework externe requis (léger et performant)
